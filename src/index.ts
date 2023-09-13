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


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/toto/', (req, res) => {
    res.send('Toto')
  })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})