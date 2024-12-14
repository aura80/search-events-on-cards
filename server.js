import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";

// Configurații pentru Express
const app = express();
const PORT = 3000; // Sau alt port dacă 3000 este ocupat
const API_KEY = "PGvnw7R39KdJOdgwdwYIUxNYPmXcTUQi"; // Cheia mea API

// Determinăm calea către directorul rădăcină
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.static(__dirname)); // Servirea fisierelor statice din directorul rădăcină

// Endpoint pentru evenimente
app.get("/events", async (req, res) => {
  const { keyword = "", page = 0, size = 20 } = req.query;
  const apiUrl = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${API_KEY}&keyword=${keyword}&size=${size}&page=${page}`;
  console.log("Fetching events from URL:", apiUrl); 
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Ticketmaster API error! Status: ${response.statusText}`);
    }
    const data = await response.json();
    console.log("Data fetched:", data); 
    res.json(data);
  } catch (error) {
    console.error("Error fetching events:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint pentru fișierul `index.html`
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Pornirea serverului
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});



// "start": "node server.js"
