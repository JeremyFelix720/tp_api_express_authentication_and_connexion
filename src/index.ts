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
  res.status(200).send('Hello World!')
})

app.get('/toto/', (req, res) => {
  res.status(200).send('Toto')
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
  res.status(200).json(myNewFreeGame)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

// Récupérer tous les jeux gratuits
app.get("/api/free-games/", async (req, res) => {
  const savedFreeGames = await FreeGameTable.findAll();
  res.status(200).json(savedFreeGames);
})

// Récupérer un jeu gratuit
app.get("/api/free-games/:id", async (req, res) => {
  const freeGameId = req.params.id;
  const savedFreeGame = await FreeGameTable.findByPk(freeGameId);
  res.status(200).json(savedFreeGame);
})

// Modifier un jeu gratuit
app.put("/api/free-games/:id", async (req, res) => {
  const freeGameId = req.params.id;
  const freeGameName = req.body.data.name;
  const freeGameDescription = req.body.data.description;
  const freeGameImage = req.body.data.image;
  const myFreeGameModified = {
    name: freeGameName,
    description: freeGameDescription,
    image: freeGameImage
  };
  await FreeGameTable.update(myFreeGameModified, {where:
      {id: freeGameId}
    });
  res.status(200).json(myFreeGameModified);
})

// Supprimer un jeu gratuit
app.delete("/api/free-games/:id", async (req, res) => {
  const freeGameId = req.params.id;
  const numberOfRegistrationDeleted = await FreeGameTable.destroy({where:
    { id: freeGameId }
  });

  if(numberOfRegistrationDeleted === 0) {
    res.status(400).json(
      {
        message: "Aucun enregistrement n'a été supprimé."
      }
    );
  } else {
    res.status(200).json(
      {
        message: "Enregistrement bien supprimé."
      }
    );
  }
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