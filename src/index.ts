console.log('Hello world');

import { DataTypes, Sequelize } from "sequelize"
import bodyParser from "body-parser"
import express from "express"
import "dotenv/config"
import cors from "cors"

const app = express()
const port = parseInt(process.env.PORT as string)

app.use(cors());
app.use(bodyParser.json())

/*
interface IMyBodyRequest {
  name: string,
  description: string,
  duration: string,
}
*/

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./db.sqlite",
})

const FreeGameTable = sequelize.define("FreeGameTable", {
  name: {
    type: DataTypes.STRING,
  },
  description: {
    type: DataTypes.STRING,
  },
  image: {
    type: DataTypes.STRING,
  },
}, {
  timestamps: false,
})

const OfficialGameTable = sequelize.define("OfficialGameTable", {
  name: {
    type: DataTypes.STRING,
  },
  description: {
    type: DataTypes.STRING,
  },
  image: {
    type: DataTypes.STRING,
  },
  price: {
    type: DataTypes.NUMBER,
  },
}, {
  timestamps: false,
})


sequelize.sync()

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/toto/', (req, res) => {
    res.send('Toto')
})

/*
// Ajouter un utilisateur VOIR CA A LA FIN
app.post("/api/auth/local/register", async (req, res) => {
  res.send()
})
*/

// Ajouter un jeu gratuit
app.post("/api/free-games/", async (req, res) => {
  const freeGameName = req.body.name;
  const freeGameDescription = req.body.description;
  const freeGameImage = req.body.image;

  const myNewFreeGame = await FreeGameTable.create({
    name: freeGameName as string,
    description: freeGameDescription as string,
    image: freeGameImage as string,
  })

  console.log(myNewFreeGame);
  res.json(myNewFreeGame)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

// Récupérer tous les jeux gratuits
app.get("/api/free-games/", async (req, res) => {
  const savedFreeGames = await FreeGameTable.findAll();
  res.json(savedFreeGames);
})


/*
// Pour faire le lien entre le code précédent et le fichier "bd.sqlite" ?
sequelize
  .sync()
  // .sync({ force: true })
  .then(() => {
    console.log("Base de données synchronisée et prête");

  })
  .catch(error => {
    console.error('Erreur de synchronisation:', error);
  });
  */