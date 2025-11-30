import { Router } from "express";
import {
  getInventories,
  createInventory,
  deleteInventory,
  getStatistics,
} from "../controllers/inventoryControllers";

const router = Router();

router.get("/inventories", getInventories);
router.get("/statistics", getStatistics);
router.post("/inventories", createInventory);
router.delete("/inventories/:id", deleteInventory);

export default router;
