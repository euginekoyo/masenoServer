import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

export const Comment = sequelize.define(
  "Comment",
  {
    blogId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

await Comment.sync(); //sync the model with the database.  //sync the model with the databas
