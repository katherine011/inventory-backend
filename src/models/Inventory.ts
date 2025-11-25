import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db";
import Location from "./Location";

export class Inventory extends Model {
  public id!: number;
  public name!: string;
  public price!: number;
  public locationId!: number;
}

Inventory.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    locationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Location,
        key: "id",
      },
    },
  },
  {
    sequelize,
    tableName: "inventories",
  }
);

Inventory.belongsTo(Location, { foreignKey: "locationId", as: "location" });
Location.hasMany(Inventory, { foreignKey: "locationId", as: "inventories" });

export default Inventory;
