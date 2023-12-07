import { DataTypes, Sequelize } from "sequelize";

export const FreeGameModel = (sequelize: Sequelize) => {
  return sequelize.define("FreeGameTable", {
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
  });
}