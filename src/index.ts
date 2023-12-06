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

// JEUX GRATUITS

// Ajouter un jeu gratuit
app.post("/api/free-games/", async (req, res) => {
  const freeGameName = req.body.name;
  const freeGameDescription = req.body.description;
  const freeGameImage = req.body.image;

  const newFreeGame = await FreeGameTable.create({
    name: freeGameName as string,
    description: freeGameDescription as string,
    image: freeGameImage as string,
  })
  res.status(200).json(newFreeGame)
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
  const freeGameModified = {
    name: freeGameName,
    description: freeGameDescription,
    image: freeGameImage
  };
  await FreeGameTable.update(freeGameModified, {where:
      {id: freeGameId}
    });
  res.status(200).json(freeGameModified);
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


// JEUX PAYANTS

// Ajouter un jeu payant
app.post("/api/official-games/", async (req, res) => {
  const officialGameName = req.body.name;
  const officialGameDescription = req.body.description;
  const officialGameImage = req.body.image;
  const officialGamePrice = req.body.price;

  const newOfficialGame = await OfficialGameTable.create({
    name: officialGameName as string,
    description: officialGameDescription as string,
    image: officialGameImage as string,
    price: officialGamePrice as number,
  })
  res.status(200).json(newOfficialGame)
})

// Récupérer tous les jeux payants
app.get("/api/official-games/", async (req, res) => {
  const savedOfficialGames = await OfficialGameTable.findAll();
  res.status(200).json(savedOfficialGames);
})

// Récupérer un jeu payant
app.get("/api/official-games/:id", async (req, res) => {
  const officialGameId = req.params.id;
  const savedOfficialGame = await OfficialGameTable.findByPk(officialGameId);
  res.status(200).json(savedOfficialGame);
})

// Modifier un jeu payant
app.put("/api/official-games/:id", async (req, res) => {
  const officialGameId = req.params.id;
  const officialGameName = req.body.data.name;
  const officialGameDescription = req.body.data.description;
  const officialGameImage = req.body.data.image;
  const officialGamePrice = req.body.data.price;

  const officialGameModified = {
    name: officialGameName,
    description: officialGameDescription,
    image: officialGameImage,
    price: officialGamePrice,
  };
  await OfficialGameTable.update(officialGameModified, {where:
      {id: officialGameId}
    });
  res.status(200).json(officialGameModified);
})

// Supprimer un jeu payant
app.delete("/api/official-games/:id", async (req, res) => {
  const officialGameId = req.params.id;
  const numberOfRegistrationDeleted = await OfficialGameTable.destroy({where:
    { id: officialGameId }
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


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
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