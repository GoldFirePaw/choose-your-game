require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
const PORT = process.env.PORT || 3001;
const client = new MongoClient(process.env.MONGO_URI);
const dbName = "choose-your-game";

let db; // Connexion unique réutilisable

// Connexion unique à MongoDB
(async () => {
  try {
    await client.connect();
    db = client.db(dbName);
    console.log(`✅ Connexion MongoDB établie à ${dbName}`);
  } catch (err) {
    console.error("❌ Erreur de connexion MongoDB :", err);
  }
})();

app.use(cors());
app.use(bodyParser.json());

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
    const { name, minimumPlayers, maximumPlayers, players = [] } = req.body;
    const game = {
      name,
      minimumPlayers,
      maximumPlayers,
      players: players.map((id) => new ObjectId(id)),
    };
    const result = await db.collection("games").insertOne(game);
    res.status(201).json({ ...game, _id: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// PUT /games/:id
app.put("/games/:id", async (req, res) => {
  try {
    const gameId = new ObjectId(req.params.id);
    console.log("🧩 ID reçu dans la route :", gameId);

    const allowedFields = ["name", "minimumPlayers", "maximumPlayers", "players"];
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

    const result = await client
      .db(dbName)
      .collection("games")
      .findOneAndUpdate(
        { _id: gameId },
        { $set: updateFields },
        { returnOriginal: "false" } 
      );

    console.log("🧪 Résultat brut :", result);
    console.log("🎯 Résultat .value :", result.value);

    console.log("🧪 Document retourné :", result);

if (!result) {
  console.log("🟥 Aucun jeu trouvé avec cet ID.");
  return res.status(404).json({ error: "Game not found" });
}

res.json(result);

    console.log("✅ Jeu mis à jour :", result.value);
    res.json(result.value);
  } catch (err) {
    console.error("🔥 Erreur PUT /games/:id :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// DELETE /games/:id
app.delete("/games/:id", async (req, res) => {
  try {
    const result = await db.collection("games").deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) return res.status(404).json({ error: "Game not found" });
    res.json({ success: true });
  } catch (err) {
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

// DELETE /players/:id (et supprime des jeux)
app.delete("/players/:id", async (req, res) => {
  try {
    const playerId = new ObjectId(req.params.id);

    const result = await db.collection("players").deleteOne({ _id: playerId });
    if (result.deletedCount === 0) return res.status(404).json({ error: "Player not found" });

    await db.collection("games").updateMany({}, { $pull: { players: playerId } });

    res.json({ success: true });
  } catch (err) {
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

app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});