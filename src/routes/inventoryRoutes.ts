import { Router } from "express";
import {
  getInventories,
  createInventory,
  deleteInventory,
  getStatistics,
  updateInventory,
} from "../controllers/inventoryControllers";

const router = Router();

router.get("/inventories", getInventories);
router.get("/statistics", getStatistics);
router.post("/inventories", createInventory);
router.put("/inventories/:id", updateInventory);
router.delete("/inventories/:id", deleteInventory);

export default router;
