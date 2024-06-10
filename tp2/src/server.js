import express from 'express';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const port = 3001;

app.use(cors());

app.use(express.json());

let db;

MongoClient.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    db = client.db();
    console.log('Conectado a la base de datos');
  })
  .catch(error => console.error(error));

app.post('/api/save-city', (req, res) => {
  const city = req.body.city;

  if (!city) {
    return res.status(400).json({ message: 'El campo ciudad es obligatorio' });
  }

  const collection = db.collection('ciudades');
  collection.insertOne({ city })
    .then(result => {
      res.status(201).json({ message: 'Ciudad guardada con éxito' });
    })
    .catch(error => {
      res.status(500).json({ message: 'Error al guardar la ciudad' });
    });
});

app.listen(port, () => {
  console.log("Servidor escuchando en http://localhost:${port}");
});