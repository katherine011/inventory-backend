import { Router } from "express";
import {
  getInventories,
  createInventory,
  deleteInventory,
  getStatistics,
  updateInventory,
  getLocations,
} from "../controllers/inventoryControllers";

const router = Router();

router.get("/inventories", getInventories);
router.get("/statistics", getStatistics);
router.get("/locations", getLocations);
router.post("/inventories", createInventory);
router.put("/inventories/:id", updateInventory);
router.delete("/inventories/:id", deleteInventory);

export default router;
