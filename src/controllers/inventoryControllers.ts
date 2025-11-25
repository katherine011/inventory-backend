import { Request, Response } from "express";
import Inventory from "../models/Inventory";
import Location from "../models/Location";
import { WhereOptions, Order } from "sequelize";

export const getInventories = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;
    const locationFilter = req.query.location as string;
    const sort = (req.query.sort as string) || "name_asc";

    const where: WhereOptions = {};
    if (locationFilter && locationFilter !== "ყველა") {
      const location = await Location.findOne({
        where: { name: locationFilter },
      });
      if (location) where.locationId = location.id;
    }

    const order: Order = [];
    if (sort === "name_asc") order.push(["name", "ASC"]);
    if (sort === "name_desc") order.push(["name", "DESC"]);
    if (sort === "price_asc") order.push(["price", "ASC"]);
    if (sort === "price_desc") order.push(["price", "DESC"]);

    const { rows, count } = await Inventory.findAndCountAll({
      where,
      include: [{ model: Location, as: "location", attributes: ["name"] }],
      limit,
      offset,
      order,
    });

    res.json({ total: count, inventories: rows });
  } catch (error) {
    res.status(500).json({ error: "failed to fetch inventories" });
  }
};

export const createInventory = async (req: Request, res: Response) => {
  try {
    const { name, price, locationId } = req.body;
    if (!name || !price || !locationId)
      return res.status(400).json({ error: "ყველა ველი სავალდებულოა" });

    const inventory = await Inventory.create({ name, price, locationId });
    res.status(201).json(inventory);
  } catch (error) {
    res.status(500).json({ error: "failed to create inventory" });
  }
};

export const deleteInventory = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const deleted = await Inventory.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ error: "inventory not found" });
    res.json({ message: "inventory deleted" });
  } catch (error) {
    res.status(500).json({ error: "failed to delete inventory" });
  }
};
