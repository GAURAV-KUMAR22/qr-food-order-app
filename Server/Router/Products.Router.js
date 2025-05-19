import express from "express";
import upload from "../Services/Multer.js";
import {
  deleteProduct,
  getAllCategory,
  getAllProducts,
  getBestSellingItem,
  getCategory,
  getProduct,
  postCategory,
  postNewProduct,
  postRating,
  putProduct,
} from "../Controller/Products.controller.js";
import ProtectedRoute from "../Service/ProtectedRoute.js";
const route = express.Router();

// Products Route
route.get("/", getAllProducts);
route.post(
  "/new-product",
  ProtectedRoute,
  upload.single("picture"),
  postNewProduct
);
route.get("/:productId", getProduct);
route.delete("/:productId", deleteProduct);
route.put("/:productId", ProtectedRoute, upload.single("picture"), putProduct);

// Category Route
route.post(
  "/new-category",
  ProtectedRoute,
  upload.single("picture"),
  postCategory
);
route.get("/category", getAllCategory);
route.get("/:category", getCategory);

// Rating Route
route.post("/rating", postRating);

// Best-Selling-Item
route.get("/best-selling-item", getBestSellingItem);

export default route;
