import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db";

export class Location extends Model {
  public id!: number;
  public name!: string;
}

Location.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    tableName: "locations",
  }
);

export default Location;
