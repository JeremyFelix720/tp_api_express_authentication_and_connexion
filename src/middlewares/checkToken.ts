// Token = la suite de carractères compliqués
// JWT = l'outil qui permet d'exploiter le token

import "dotenv/config";
import jwt from "jsonwebtoken";
import {Request, Response, NextFunction } from 'express';
import { TokenBlackList } from "../index";


export interface DecodeToken {
  id: number;
  username: string;
  email: string;
  iat: number;
  exp: number;
}


export async function checkToken(req: Request, res: Response, next: NextFunction) {
  const fullToken = req.headers.authorization;  // fullToken = "Bearer + JWT" (dans le header "Authorization" des requêtes)
  if (!fullToken) {
    res.status(401).send("Le Token n'a pas été fourni.");
  } else {
    const [typeToken, token] = fullToken.split(" ");
    // Le type "Bearer" indique uniquement que le Token qui se situe après l'espace a bien le bon format.
    if(typeToken !== "Bearer"){
      res.status(401).send("Le type de Token est incorrect.");
    } else {
      const isBlacklisted = await TokenBlackList.findOne({ where: { token } });
      const decoded = jwt.verify(token, process.env.JWT_SECRET!)
      // JWT_SECRET est une clé spécifique à notre serveur, ce qui permet de vérifier qu'aucun autre serveur ne souhaite accèder à notre BDD.
      console.log(decoded);
      if (decoded && !isBlacklisted) {  // si le Token est : valide + bien fourni par notre serveur && qu'il ne n'est pas un Token interdit (qui a été généré avant la deconnexion de l'utilisateur)
        req.body.token = token;
        next();  // Validation du middleware
      } else {
        res.status(401).send("Le Token est incorrect.");
      }
    }
  }
}