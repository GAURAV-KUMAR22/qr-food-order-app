import express from "express";
import {
  getAllSales,
  getBestSellingItem,
  getTotelSale,
} from "../Controller/Sales.Controller.js";
import ProtectedRoute from "../Service/ProtectedRoute.js";
const router = express.Router();

router.get("/", ProtectedRoute, getAllSales);
router.get("/totelSale", ProtectedRoute, getTotelSale);
router.get("/best-selling-item", getBestSellingItem);

export default router;
