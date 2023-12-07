import { DataTypes, Sequelize } from "sequelize";

export const UserModel  = (sequelize: Sequelize) => {
  return sequelize.define("User", {
    pseudo: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
  }, {
    timestamps: false,
  });
}