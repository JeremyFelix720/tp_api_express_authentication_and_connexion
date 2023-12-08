import { Router } from "express";
import { TokenBlackList, User } from "../index";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { DecodeToken, checkToken } from "../middlewares/checkToken";

export const authRouter = Router();


// Ajout d'un utilisateur
authRouter.post("/local/register", async (req, res) => {
  //const userId = req.body.id;
  const userPseudo = req.body.pseudo;
  const userEmail = req.body.email;
  const userPassword = req.body.password;

  // Vérification si un utilisateur existant dans la BDD a le même email que celui que l'on souhaite rajouté.
  const sameUserEmail = await User.findOne( {where: {email: userEmail} || {pseudo: userPseudo} })

  if(sameUserEmail === null){ // si aucun utilisateur similaire n'a été trouvé précédement.
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

// Connexion d'un utilisateur
authRouter.post("/local", async (req, res) => {
  const userEmail = req.body.identifier;
  const userPassword = req.body.password;

  const sameUserEmail = await User.findOne( {where: {email: userEmail} })

  if(sameUserEmail) {

    const isPasswordCorrect = await bcrypt.compare(userPassword, sameUserEmail.dataValues.password);

    if (isPasswordCorrect) {
      delete sameUserEmail.dataValues.password;

      const token = jwt.sign(sameUserEmail.dataValues, process.env.JWT_SECRET!);
      res.status(200).json({
        message: "L'utilisateur a bien été connecté.",
        jwt: token,
      });
      // JWT SECRET est la clé pour coder et encoder les informations communiquées entre le temps entre le client et le serveur.
    }
    else {
        res.status(400).send("Email or Password is incorrect");
    }
  } else {
    res.status(400).json(
      {
        message: "Il n'existe aucun compte ayant ce couple email / mot de passe.",
      }
    )
  }
})

// Déconnexion d'un utilisateur
authRouter.post("/logout", /*checkToken,*/ async (req, res) => {
  const decoded = jwt.decode(req.body.token!) as DecodeToken
  const user = await User.findOne({ where: { id: decoded.id } });
  if (user) {
      await TokenBlackList.create({ token: req.body.token });
      res.send("Logged out");
  }
  else {
      res.status(404).send("User not found");
  }
})