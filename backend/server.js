const express = require('express')
const fs = require('fs')
const path = require('path')
const cors = require('cors')
const bodyParser = require('body-parser')

const app = express()
const PORT = process.env.PORT || 3001
const dataFile = path.join(__dirname, 'data/games.json')
const playersFile = path.join(__dirname, 'data/players.json');

app.use(cors())
app.use(bodyParser.json())

// Helpers jeux
const readGames = () => JSON.parse(fs.readFileSync(dataFile))
const writeGames = (games) => fs.writeFileSync(dataFile, JSON.stringify(games, null, 2))

// Helpers joueurs
const readPlayers = () => JSON.parse(fs.readFileSync(playersFile))
const writePlayers = (players) => fs.writeFileSync(playersFile, JSON.stringify(players, null, 2))

// Routes jeux
app.get('/games', (req, res) => {
    res.json(readGames())
})

app.post('/games', (req, res) => {
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: 'Missing request body' })
    }
    const games = readGames()
    const newGame = { ...req.body, id: Date.now() }
    games.push(newGame)
    writeGames(games)
    res.status(201).json(newGame)
})

app.put('/games/:id', (req, res) => {
    const games = readGames()
    const id = parseInt(req.params.id)
    const index = games.findIndex((g) => g.id === id)
    if (index === -1) return res.status(404).json({ error: 'Game not found' })

    games[index] = { ...games[index], ...req.body }
    writeGames(games)
    res.json(games[index])
})

app.delete('/games/:id', (req, res) => {
    let games = readGames()
    const id = parseInt(req.params.id)
    const filtered = games.filter((g) => g.id !== id)
    if (filtered.length === games.length) return res.status(404).json({ error: 'Game not found' })

    writeGames(filtered)
    res.json({ success: true })
})

// Routes joueurs
app.get('/players', (req, res) => {
    res.json(readPlayers())
})

app.post('/players', (req, res) => {
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: 'Missing request body' })
    }
    const players = readPlayers()
    const newPlayer = { ...req.body, id: Date.now() }
    players.push(newPlayer)
    writePlayers(players)
    res.status(201).json(newPlayer)
})

app.put('/players/:id', (req, res) => {
    const players = readPlayers()
    const id = parseInt(req.params.id)
    const index = players.findIndex((p) => p.id === id)
    if (index === -1) return res.status(404).json({ error: 'Player not found' })

    players[index] = { ...players[index], ...req.body }
    writePlayers(players)
    res.json(players[index])
})

app.delete('/players/:id', (req, res) => {
    let players = readPlayers()
    const id = parseInt(req.params.id)
    const filtered = players.filter((p) => p.id !== id)
    if (filtered.length === players.length) return res.status(404).json({ error: 'Player not found' })

    writePlayers(filtered)

    // Nettoyage dans les jeux
    let games = readGames()
    games = games.map(game => ({
        ...game,
        players: game.players?.filter(p => p.id !== id) || []
    }))
    writeGames(games)

    res.json({ success: true })
})

// Ajouter un joueur à un jeu
app.post('/games/:gameId/players', (req, res) => {
    const games = readGames()
    const players = readPlayers()

    const gameId = parseInt(req.params.gameId)
    const playerId = req.body?.playerId

    const gameIndex = games.findIndex((g) => g.id === gameId)
    if (gameIndex === -1) return res.status(404).json({ error: 'Game not found' })

    const player = players.find((p) => p.id === playerId)
    if (!player) return res.status(404).json({ error: 'Player not found' })

    const existing = games[gameIndex].players || []
    const alreadyInGame = existing.some((p) => p.id === playerId)
    if (alreadyInGame) return res.status(400).json({ error: 'Player already in game' })

    games[gameIndex].players = [...existing, player]
    writeGames(games)

    res.status(200).json({ success: true, updatedGame: games[gameIndex] })
})

// Supprimer un joueur d’un jeu
app.delete('/games/:gameId/players/:playerId', (req, res) => {
    const games = readGames()
    const gameId = parseInt(req.params.gameId)
    const playerId = parseInt(req.params.playerId)

    const gameIndex = games.findIndex((g) => g.id === gameId)
    if (gameIndex === -1) return res.status(404).json({ error: 'Game not found' })

    if (!games[gameIndex].players) {
        return res.status(404).json({ error: 'No players in this game' })
    }

    games[gameIndex].players = games[gameIndex].players.filter((p) => p.id !== playerId)
    writeGames(games)

    res.json({ success: true, updatedGame: games[gameIndex] })
})

app.listen(PORT, () => {
    console.log(`✅ Backend running on http://localhost:${PORT}`)
})