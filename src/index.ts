console.log('Hello world');

import express from "express"
import "dotenv/config"

const app = express()
const port = parseInt(process.env.PORT as string)



import { DataTypes, Sequelize } from "sequelize"

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./db.sqlite",
})

const bddName = sequelize.define("bddName", {
    property1: {
        type: DataTypes.STRING,
    },
    status: {
        type: DataTypes.BOOLEAN,
    },
}, {
  timestamps: false,
})

sequelize
  .sync({ force: true })
  .then(() => {
    console.log('La synchronisation a réussi.');
    bddName.create({
      property1: "value1",
      property2: "value2",
    })
    .then((bddRegistration) => {
      console.log("bddRegistration", bddRegistration)
      bddName.findAll().then((bddRegistrations) => {
        console.log("bddRegistrations", bddRegistrations)
      })
    })
  })
  .catch(error => {
    console.error('Erreur de synchronisation:', error);
  });




app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/toto/', (req, res) => {
    res.send('Toto')
  })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})