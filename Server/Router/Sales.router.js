import express from "express";
import {
  getAllSales,
  getBestSellingItem,
} from "../Controller/Sales.Controller.js";
const router = express.Router();

router.get("/", getAllSales);
router.get("/best-selling-item", getBestSellingItem);

export default router;
