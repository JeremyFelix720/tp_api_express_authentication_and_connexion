import { Router } from "express";
import { OfficialGame } from "../index";

export const officialGamesRouter = Router();


// Ajouter un jeu payant
officialGamesRouter.post("/", async (req, res) => {
  const officialGameName = req.body.name;
  const officialGameDescription = req.body.description;
  const officialGameImage = req.body.image;
  const officialGamePrice = req.body.price;

  const newOfficialGame = await OfficialGame.create({
    name: officialGameName as string,
    description: officialGameDescription as string,
    image: officialGameImage as string,
    price: officialGamePrice as number,
  })
  res.status(200).json(newOfficialGame)
})

// Récupérer tous les jeux payants
officialGamesRouter.get("/", async (req, res) => {
  const savedOfficialGames = await OfficialGame.findAll();
  res.status(200).json(savedOfficialGames);
})

// Récupérer un jeu payant
officialGamesRouter.get("/:id", async (req, res) => {
  const officialGameId = req.params.id;
  const savedOfficialGame = await OfficialGame.findByPk(officialGameId);
  res.status(200).json(savedOfficialGame);
})

// Modifier un jeu payant
officialGamesRouter.put("/:id", async (req, res) => {
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
  await OfficialGame.update(officialGameModified, {where:
      {id: officialGameId}
    });
  res.status(200).json(officialGameModified);
})

// Supprimer un jeu payant
officialGamesRouter.delete("/:id", async (req, res) => {
  const officialGameId = req.params.id;
  const numberOfRegistrationDeleted = await OfficialGame.destroy({where:
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