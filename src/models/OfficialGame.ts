import { DataTypes, Sequelize } from "sequelize";


export const OfficialGameModel = (sequelize: Sequelize) => {
  return sequelize.define("OfficialGameTable", {
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
  });
}