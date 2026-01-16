require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const compression = require("compression");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
const PORT = process.env.PORT || 3001;
const client = new MongoClient(process.env.MONGO_URI);
const dbName = "choose-your-game";

// Admin password for destructive operations (default: "admin123")
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

let db; // Connexion unique réutilisable

// Connexion unique à MongoDB
(async () => {
  try {
    await client.connect();
    db = client.db(dbName);
    console.log(`✅ Connexion MongoDB établie à ${dbName}`);
    
    // Create indexes for better performance
    await db.collection("games").createIndex({ name: 1 });
    await db.collection("games").createIndex({ players: 1 });
    await db.collection("players").createIndex({ name: 1 });
    console.log("📈 Index MongoDB créés pour optimiser les performances");
  } catch (err) {
    console.error("❌ Erreur de connexion MongoDB :", err);
    console.log("⚠️  Serveur démarré sans base de données - certaines fonctions ne marcheront pas");
  }
})();

// Start server regardless of database connection status
app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
  console.log(`🔑 Admin password configured: ${ADMIN_PASSWORD ? 'Yes' : 'No'}`);
});

app.use(compression()); // Enable gzip compression
app.use(cors());
app.use(bodyParser.json());

// Password validation middleware for destructive operations
const validateAdminPassword = (req, res, next) => {
  const { adminPassword } = req.body;
  
  if (!adminPassword) {
    return res.status(401).json({ error: "Password required for this operation" });
  }
  
  if (adminPassword !== ADMIN_PASSWORD) {
    console.log("🔐 Invalid admin password attempt");
    return res.status(403).json({ error: "Invalid admin password" });
  }
  
  console.log("✅ Admin password validated");
  next();
};

// POST /admin/verify (requires admin password)
app.post("/admin/verify", validateAdminPassword, (req, res) => {
  res.json({ success: true });
});

/* =======================
   ROUTES GAMES
======================= */

// GET /games
app.get("/games", async (req, res) => {
  try {
    const games = await db.collection("games").find().toArray();
    const formatted = games.map((g) => ({
      ...g,
      _id: g._id.toString(),
      players: g.players?.map((id) => id.toString()) || [],
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// POST /games
app.post("/games", async (req, res) => {
  try {
    console.log("📨 Données reçues pour créer un jeu :", req.body);
    
    const { name, minimumPlayers, maximumPlayers, players = [], isNavGame = false } = req.body;
    
    // Validate required fields
    if (!name || typeof name !== 'string') {
      return res.status(400).json({ error: "Le nom du jeu est requis" });
    }
    
    if (!minimumPlayers || !maximumPlayers) {
      return res.status(400).json({ error: "Le nombre de joueurs min/max est requis" });
    }
    
    console.log("🎮 Players data:", players);
    
    const game = {
      name,
      minimumPlayers: parseInt(minimumPlayers),
      maximumPlayers: parseInt(maximumPlayers),
      players: players.map((player) => {
        try {
          // Handle both string IDs and player objects
          const id = typeof player === 'string' ? player : player._id;
          console.log("🆔 Converting player ID:", id);
          
          // Validate ObjectId format (24 character hex string)
          if (!id || typeof id !== 'string' || id.length !== 24 || !/^[0-9a-fA-F]+$/.test(id)) {
            throw new Error(`Invalid ObjectId format: ${id}`);
          }
          
          return new ObjectId(id);
        } catch (err) {
          console.error("❌ Erreur conversion ObjectId:", err);
          throw new Error(`Invalid player ID: ${JSON.stringify(player)} - ${err.message}`);
        }
      }),
      isNavGame: Boolean(isNavGame),
    };
    
    console.log("💾 Game object to save:", game);
    
    // Check if database is connected
    if (!db) {
      console.error("❌ Database not connected");
      return res.status(500).json({ error: "Database connection error" });
    }
    
    const result = await db.collection("games").insertOne(game);
    console.log("✅ Insert result:", result);
    
    // Format the response to match the expected structure
    const formattedGame = {
      ...game,
      _id: result.insertedId.toString(),
      players: game.players.map(id => id.toString())
    };
    
    console.log("📤 Returning formatted game:", formattedGame);
    res.status(201).json(formattedGame);
  } catch (err) {
    console.error("❌ Erreur POST /games :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// PUT /games/:id
app.put("/games/:id", async (req, res) => {
  try {
    const gameId = new ObjectId(req.params.id);
    console.log("🧩 ID reçu dans la route :", gameId);

    const allowedFields = ["name", "minimumPlayers", "maximumPlayers", "players", "isNavGame"];
    const updateFields = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateFields[field] =
          field === "players"
            ? req.body[field].map((id) => new ObjectId(id))
            : req.body[field];
      }
    });

    console.log("✏️ Champs à mettre à jour :", updateFields);

    const result = await db
      .collection("games")
      .findOneAndUpdate(
        { _id: gameId },
        { $set: updateFields },
        { returnDocument: "after" } 
      );

    console.log("🧪 Résultat brut :", result);

    if (!result) {
      console.log("🟥 Aucun jeu trouvé avec cet ID.");
      return res.status(404).json({ error: "Game not found" });
    }

    // Format the response to match the expected structure
    const formattedGame = {
      ...result,
      _id: result._id.toString(),
      players: result.players?.map(id => id.toString()) || []
    };

    console.log("✅ Jeu mis à jour :", formattedGame);
    res.json(formattedGame);
  } catch (err) {
    console.error("🔥 Erreur PUT /games/:id :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// DELETE /games/:id (requires admin password)
app.delete("/games/:id", validateAdminPassword, async (req, res) => {
  try {
    console.log("🗑️ Deleting game with ID:", req.params.id);
    
    // Check if database is connected
    if (!db) {
      console.error("❌ Database not connected");
      return res.status(500).json({ error: "Database connection not ready" });
    }
    
    // Validate ObjectId format
    if (!req.params.id || req.params.id.length !== 24 || !/^[0-9a-fA-F]+$/.test(req.params.id)) {
      return res.status(400).json({ error: "Invalid game ID format" });
    }
    
    const gameId = new ObjectId(req.params.id);
    const result = await db.collection("games").deleteOne({ _id: gameId });
    
    if (result.deletedCount === 0) {
      console.log("🟥 Game not found for deletion");
      return res.status(404).json({ error: "Game not found" });
    }
    
    console.log("✅ Game deleted successfully");
    res.json({ success: true, message: "Game deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting game:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// POST /games/:gameId/players
app.post("/games/:gameId/players", async (req, res) => {
  try {
    const gameId = new ObjectId(req.params.gameId);
    const playerId = new ObjectId(req.body.playerId);
    const player = await db.collection("players").findOne({ _id: playerId });
    if (!player) return res.status(404).json({ error: "Player not found" });

    const updated = await db.collection("games").findOneAndUpdate(
      { _id: gameId },
      { $addToSet: { players: playerId } },
      { returnDocument: "after" }
    );

    if (!updated.value) return res.status(404).json({ error: "Game not found" });
    res.json({ success: true, updatedGame: updated.value });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// DELETE /games/:gameId/players/:playerId
app.delete("/games/:gameId/players/:playerId", async (req, res) => {
  try {
    const gameId = new ObjectId(req.params.gameId);
    const playerId = new ObjectId(req.params.playerId);

    const updated = await db.collection("games").findOneAndUpdate(
      { _id: gameId },
      { $pull: { players: playerId } },
      { returnDocument: "after" }
    );

    if (!updated.value) return res.status(404).json({ error: "Game not found" });
    res.json({ success: true, updatedGame: updated.value });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

/* =======================
   ROUTES PLAYERS
======================= */

// GET /players
app.get("/players", async (req, res) => {
  try {
    const players = await db.collection("players").find().toArray();
    res.json(players);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// POST /players
app.post("/players", async (req, res) => {
  try {
    const newPlayer = req.body;
    const result = await db.collection("players").insertOne({
      ...newPlayer,
      _id: new ObjectId(),
    });
    res.status(201).json({ ...newPlayer, _id: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// DELETE /players/:id (requires admin password)
app.delete("/players/:id", validateAdminPassword, async (req, res) => {
  try {
    console.log("🗑️ Deleting player with ID:", req.params.id);
    
    // Check if database is connected
    if (!db) {
      console.error("❌ Database not connected");
      return res.status(500).json({ error: "Database connection not ready" });
    }
    
    const playerId = new ObjectId(req.params.id);

    const result = await db.collection("players").deleteOne({ _id: playerId });
    if (result.deletedCount === 0) return res.status(404).json({ error: "Player not found" });

    // Remove player from all games
    await db.collection("games").updateMany({}, { $pull: { players: playerId } });
    console.log("✅ Player deleted and removed from all games");

    res.json({ success: true });
  } catch (err) {
    console.error("❌ Error deleting player:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// PUT /players/:playerId/add-to-games
app.put("/players/:playerId/add-to-games", async (req, res) => {
  const { playerId } = req.params;
  const { gameIds } = req.body;

  try {
    const playerObjectId = new ObjectId(playerId);
    const gameObjectIds = gameIds.map((id) => new ObjectId(id));

    const result = await db.collection("games").updateMany(
      { _id: { $in: gameObjectIds } },
      { $addToSet: { players: playerObjectId } }
    );

    res.json({
      modifiedCount: result.modifiedCount,
      message: `Le joueur a été ajouté à ${result.modifiedCount} jeu(x)`,
    });
  } catch (err) {
    console.error("Erreur lors de l'ajout du joueur :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

/* =======================
   LANCEMENT DU SERVEUR
======================= */

// Server startup is handled above after database connection attempt
