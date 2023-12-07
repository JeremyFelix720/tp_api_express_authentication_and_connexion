import { Router } from "express";
// import { TokenBlackList, User } from "..";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
// import { DecodeToken, checkToken } from "../middlewares/checkToken";

import { User } from "../index";

export const authRouter = Router();


// Ajout d'un utilisateur sous certaines conditions
authRouter.post("/local/register", async (req, res) => {
  //const userId = req.body.id;
  const userPseudo = req.body.pseudo;
  const userEmail = req.body.email;
  const userPassword = req.body.password;

  // Vérification si un utilisateur existant dans la BDD a le même email que celui que l'on souhaite rajouté.
  const sameUserResearched = await User.findOne( {where: {email: userEmail} || {pseudo: userPseudo} })

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

    const newUser = await User.create(myUser)

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