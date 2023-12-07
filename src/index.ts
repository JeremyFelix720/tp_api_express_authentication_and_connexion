import "dotenv/config"
import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import { DataTypes, Sequelize } from "sequelize"

// import models

// import routes



const app = express()
const port = parseInt(process.env.PORT as string)

app.use(cors());
app.use(bodyParser.json())

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

const UserTable = sequelize.define("UserTable", {
  pseudo: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
  },
  password: {
    type: DataTypes.STRING,
  },
}, {
  timestamps: false,
})

sequelize.sync( {force: true} )


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


// UTILISATEURS

// AUTH

import { Router } from "express";
// import { TokenBlackList, User } from "..";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
// import { DecodeToken, checkToken } from "../middlewares/checkToken";


// Ajout d'un utilisateur sous certaines conditions
app.post("/api/auth/local/register", async (req, res) => {
  //const userId = req.body.id;
  const userPseudo = req.body.pseudo;
  const userEmail = req.body.email;
  const userPassword = req.body.password;

  // Vérification si un utilisateur existant dans la BDD a le même email que celui que l'on souhaite rajouté.
  const sameUserResearched = await UserTable.findOne( {where: {email: userEmail} || {pseudo: userPseudo} })

  if(sameUserResearched === null){ // si aucun utilisateur similaire n'a été trouvé précédement.

    // Le mdp "userPassword" est hashé ici :
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userPassword, saltRounds);
    const myUser = {
      // id: userId,
      pseudo: userPseudo,
      email: userEmail,
      password: hashedPassword
    };

    const newUser = await UserTable.create(myUser)

    delete newUser.dataValues.password  // mdp pas supprimé de la BDD mais seulement de l'objet renvoyé à l'utilisateur (qui n'en a pas besoin).

    res.status(200).json(
      {
        message: "L'utilisateur a bien été ajouté.",
        // ...myUser, // destructuration de l'objet myUser qui correxpond à aux lignes suivantes :
        // id: userId,
        pseudo: userPseudo,
        email: userEmail
        // password: hashedPassword
      }
    )
  } else {
      res.status(400).json(
        {
          message: "Il y a déjà un utilisateur ayant la même adresse email."
        }
      )
    }
})


// USER





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