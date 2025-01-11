const express = require("express");
const mysql = require("mysql");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const session = require("express-session");

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(session({
  secret: 'secretkey', // Chiave segreta per la sessione
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false, // Imposta su `true` se usi HTTPS, altrimenti lascialo su `false`
  }
}));

// Connessione al database MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root", // O il tuo nome utente MySQL
  password: "", // La tua password MySQL
  database: "solarhouse", // Nome del database
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to the database!");
});

// Rotta per il login
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email e password sono obbligatorie" });
  }

  app.get("/profile", (req, res) => {
    console.log(req.session.user); // Aggiungi un log per vedere se la sessione contiene un utente
    if (!req.session.user) {
      return res.status(401).json({ message: "Non sei autenticato" });
    }
    res.status(200).json({ message: "Benvenuto!", user: req.session.user });
  });

  // Verifica se l'utente esiste nel database
  const query = "SELECT * FROM users WHERE email = ?";
  db.query(query, [email], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Errore nel server" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Utente non trovato" });
    }

    // Confronta la password fornita con quella salvata
    const user = results[0];
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Errore nel server" });
      }

      if (!isMatch) {
        return res.status(401).json({ message: "Password errata" });
      }

      // Salva l'utente nella sessione per il login
      req.session.user = {
        id: user.id,
        username: user.username,
        email: user.email,
      };

      return res.status(200).json({ message: "Login effettuato con successo", user: req.session.user });
    });
  });
});

// Avvia il server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
