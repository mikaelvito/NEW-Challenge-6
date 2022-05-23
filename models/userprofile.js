"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserProfile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      UserProfile.belongsTo(models.UserGame, {
        foreignKey: "userGameId",
        as: "userGame",
      });
      // define association here
    }
  }
  UserProfile.init(
    {
      fullName: DataTypes.STRING,
      address: DataTypes.STRING,
      phoneNumber: DataTypes.STRING,
      userGameId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "UserProfile",
    }
  );
  return UserProfile;
};
