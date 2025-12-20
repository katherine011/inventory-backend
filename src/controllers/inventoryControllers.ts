import { Request, Response } from "express";
import Inventory from "../models/Inventory";
import Location from "../models/Location";
import { WhereOptions, Order } from "sequelize";
import { sequelize } from "../config/db";
import { Op } from "sequelize";

export const getInventories = async (req: Request, res: Response) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Number(req.query.limit) || 20);
    const offset = (page - 1) * limit;

    const locationFilter = req.query.location as string;
    const sort = (req.query.sort as string) || "name_asc";

    const where: WhereOptions = {};

    if (locationFilter && locationFilter !== "ყველა") {
      const location = await Location.findOne({
        where: { name: locationFilter },
        attributes: ["id"],
      });
      if (location) where.locationId = location.id;
    }

    let order: Order = [];
    switch (sort) {
      case "name_asc":
        order = [["name", "ASC"]];
        break;
      case "name_desc":
        order = [["name", "DESC"]];
        break;
      case "price_asc":
        order = [["price", "ASC"]];
        break;
      case "price_desc":
        order = [["price", "DESC"]];
        break;
      default:
        order = [["id", "ASC"]];
        break;
    }

    const { rows, count } = await Inventory.findAndCountAll({
      where,
      limit,
      offset,
      order,
      attributes: ["id", "name", "price", "locationId"],
      include: [
        {
          model: Location,
          as: "location",
          attributes: ["name"],
        },
      ],
    });

    return res.json({
      total: count,
      page,
      perPage: limit,
      inventories: rows,
    });
  } catch (error) {
    return res.status(500).json({ error: "failed to fetch inventories" });
  }
};

export const getStatistics = async (req: Request, res: Response) => {
  try {
    const stats = await Location.findAll({
      attributes: [
        "id",
        "name",
        [sequelize.fn("COUNT", sequelize.col("inventories.id")), "count"],
        [sequelize.fn("SUM", sequelize.col("inventories.price")), "totalPrice"],
      ],
      include: [
        {
          model: Inventory,
          as: "inventories",
          attributes: [],
        },
      ],

      group: ["Location.id", "Location.name"],
      raw: true,
    });

    interface StatResult {
      id: number;
      name: string;
      count: string;
      totalPrice: string | null;
    }

    const statResults = stats as unknown as StatResult[];

    const totalProducts = statResults.reduce(
      (sum, x) => sum + parseInt(x.count),
      0
    );
    const totalValue = statResults.reduce(
      (sum, x) => sum + parseFloat(x.totalPrice || "0"),
      0
    );

    const formattedStats = statResults.map((el) => ({
      location: el.name,
      count: parseInt(el.count),
      totalPrice: parseFloat(parseFloat(el.totalPrice || "0").toFixed(2)),
    }));

    res.json({
      stats: formattedStats,
      totalProducts,
      totalValue: parseFloat(totalValue.toFixed(2)),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "failed to load statistics" });
  }
};

export const getLocations = async (req: Request, res: Response) => {
  try {
    const locations = await Location.findAll({
      where: { name: { [Op.ne]: "" } },
      attributes: ["id", "name"],
      order: [["name", "ASC"]],
    });
    res.json({ locations });
  } catch (error) {
    res.status(500).json({ error: "ლოკაციების მოპოვება ვერ მოხერხდა" });
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

export const updateInventory = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const { name, price, locationId } = req.body;

    if (!name || !price || !locationId) {
      return res.status(400).json({ error: "ყველა ველი სავალდებულოა" });
    }

    const inventory = await Inventory.findByPk(id);
    if (!inventory) {
      return res.status(404).json({ error: "inventory not found" });
    }

    inventory.name = name;
    inventory.price = price;
    inventory.locationId = locationId;

    await inventory.save();

    res.json({ message: "inventory updated", inventory });
  } catch (error) {
    res.status(500).json({ error: "failed to update inventory" });
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
