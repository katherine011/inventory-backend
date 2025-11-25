import { Router } from "express";
import {
  getInventories,
  createInventory,
  deleteInventory,
} from "../controllers/inventoryControllers";

const router = Router();

router.get("/inventories", getInventories);
router.post("/inventories", createInventory);
router.delete("/inventories/:id", deleteInventory);

export default router;
