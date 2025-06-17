require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
const PORT = process.env.PORT || 3001;
const client = new MongoClient(process.env.MONGO_URI);
const dbName = "choose-your-game"; // Doit correspondre à ton nom de base sur Atlas

app.use(cors());
app.use(bodyParser.json());

// GET /games
app.get("/games", async (req, res) => {
  try {
    await client.connect();
    const games = await client.db(dbName).collection("games").find().toArray();
    res.json(games);
  } catch (err) {
    console.error("GET /games error:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// POST /games
app.post("/games", async (req, res) => {
  try {
    const newGame = { ...req.body, players: req.body.players || [] };
    await client.connect();
    const result = await client.db(dbName).collection("games").insertOne({
        ...newGame,
        _id: new ObjectId(),
    });    
res.status(201).json({ ...newGame, _id: result.insertedId });
  } catch (err) {
    console.error("POST /games error:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// PUT /games/:id
app.put("/games/:id", async (req, res) => {
  try {
    await client.connect();
    const updated = await client
      .db(dbName)
      .collection("games")
      .findOneAndUpdate(
        { _id: new ObjectId(req.params.id) },
        { $set: req.body },
        { returnDocument: "after" }
      );
    if (!updated.value) return res.status(404).json({ error: "Game not found" });
    res.json(updated.value);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// DELETE /games/:id
app.delete("/games/:id", async (req, res) => {
  try {
    await client.connect();
    const result = await client
      .db(dbName)
      .collection("games")
      .deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) return res.status(404).json({ error: "Game not found" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// GET /players
app.get("/players", async (req, res) => {
  try {
    await client.connect();
    const players = await client.db(dbName).collection("players").find().toArray();
    res.json(players);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// POST /players
app.post("/players", async (req, res) => {
  try {
    const newPlayer = req.body;
    await client.connect();
    const result = await client.db(dbName).collection("players").insertOne({
        ...newPlayer,
        _id: new ObjectId(),
    });    
res.status(201).json({ ...newPlayer, _id: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// PUT /players/:id
app.put("/players/:id", async (req, res) => {
  try {
    await client.connect();
    const updated = await client
      .db(dbName)
      .collection("players")
      .findOneAndUpdate(
        { _id: new ObjectId(req.params.id) },
        { $set: req.body },
        { returnDocument: "after" }
      );
    if (!updated.value) return res.status(404).json({ error: "Player not found" });
    res.json(updated.value);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// DELETE /players/:id + retire le joueur des jeux
app.delete("/players/:id", async (req, res) => {
  try {
    const playerId = new ObjectId(req.params.id);
    await client.connect();
    const db = client.db(dbName);

    const result = await db.collection("players").deleteOne({ _id: playerId });
    if (result.deletedCount === 0) return res.status(404).json({ error: "Player not found" });

    await db.collection("games").updateMany(
    {},
    { $pull: { players: { _id: playerId.toString() } } }
    );

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

    await client.connect();
    const db = client.db(dbName);
    const player = await db.collection("players").findOne({ _id: playerId });
    if (!player) return res.status(404).json({ error: "Player not found" });

    const updated = await db.collection("games").findOneAndUpdate(
      { _id: gameId },
      { $addToSet: { players: player } }, // évite les doublons
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

    await client.connect();
    const db = client.db(dbName);
    const updated = await db.collection("games").findOneAndUpdate(
      { _id: gameId },
      { $pull: { players: { _id: playerId.toString } } },
      { returnDocument: "after" }
    );
    if (!updated.value) return res.status(404).json({ error: "Game not found" });

    res.json({ success: true, updatedGame: updated.value });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Backend MongoDB running on http://localhost:${PORT}`);
});