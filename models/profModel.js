import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import { User } from "./User.js";

const ProfImage = sequelize.define(
  "ProfImage",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    filePath: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Users", // Ensure this matches the actual table name
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
  },
  {
    tableName: "ProfImages", // Explicitly define table name
    timestamps: true, // Ensure timestamps are included
  }
);

// Define associations explicitly
User.hasOne(ProfImage, {
  foreignKey: "userId",
  sourceKey: "id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
ProfImage.belongsTo(User, {
  foreignKey: "userId",
  targetKey: "id",
});

export default ProfImage;
