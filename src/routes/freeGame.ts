import { Router } from "express";
import { FreeGame } from "../index";

export const freeGamesRouter = Router();


// Ajouter un jeu gratuit
freeGamesRouter.post("/", async (req, res) => {
  const freeGameName = req.body.name;
  const freeGameDescription = req.body.description;
  const freeGameImage = req.body.image;

  const newFreeGame = await FreeGame.create({
    name: freeGameName as string,
    description: freeGameDescription as string,
    image: freeGameImage as string,
  })
  res.status(200).json(newFreeGame)
})

// Récupérer tous les jeux gratuits
freeGamesRouter.get("/", async (req, res) => {
  const savedFreeGames = await FreeGame.findAll();
  res.status(200).json(savedFreeGames);
})

// Récupérer un jeu gratuit
freeGamesRouter.get("/:id", async (req, res) => {
  const freeGameId = req.params.id;
  const savedFreeGame = await FreeGame.findByPk(freeGameId);
  res.status(200).json(savedFreeGame);
})

// Modifier un jeu gratuit
freeGamesRouter.put("/:id", async (req, res) => {
  const freeGameId = req.params.id;
  const freeGameName = req.body.data.name;
  const freeGameDescription = req.body.data.description;
  const freeGameImage = req.body.data.image;
  const freeGameModified = {
    name: freeGameName,
    description: freeGameDescription,
    image: freeGameImage
  };
  await FreeGame.update(freeGameModified, {where:
      {id: freeGameId}
    });
  res.status(200).json(freeGameModified);
})

// Supprimer un jeu gratuit
freeGamesRouter.delete("/:id", async (req, res) => {
  const freeGameId = req.params.id;
  const numberOfRegistrationDeleted = await FreeGame.destroy({where:
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