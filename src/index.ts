import "dotenv/config"
import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import { DataTypes, Sequelize } from "sequelize"

import { OfficialGameModel } from "./models/OfficialGame";
import { FreeGameModel } from "./models/FreeGame";
import { UserModel } from "./models/User";
import { TokenBlackListModel } from "./models/TokenBlackList";

import { freeGamesRouter } from "./routes/freeGame";
import { officialGamesRouter } from "./routes/officialGame";
import { authRouter } from "./routes/auth";


const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./db.sqlite",
})

// Les modèles servent à encadrer la création des objets (à rajouter dans la BDD ou à renvoyer à l'utilisateur)
export const OfficialGame = OfficialGameModel(sequelize);
export const FreeGame = FreeGameModel(sequelize);
export const User = UserModel(sequelize);
export const TokenBlackList = TokenBlackListModel(sequelize);


// sequelize.sync( {force: true} )  // Réinitialise les données de la BDD à chaque fois que l'on execute le programme avec la commande "npm run dev" ou "npm run start".

sequelize.sync()  // Conserve les données de la BDD à chaque fois que l'on execute le programme avec la commande "npm run dev" ou "npm run start".


const app = express()
const PORT = parseInt(process.env.PORT as string)
app.use(cors());
app.use(bodyParser.json())


const apiRouter = express.Router();
apiRouter.use('/auth', authRouter);
apiRouter.use('/official-games', officialGamesRouter );
apiRouter.use('/free-games', freeGamesRouter);
//apiRouter.use('/users', userRouter);

app.use("/api", apiRouter);


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})