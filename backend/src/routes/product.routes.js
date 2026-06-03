import { Router } from "express";
import {
    getProducts,
    getProductById,
    getBestsellers,
    createProduct,
    updateProduct,
    deleteProduct,
    bulkDeleteProducts,
} from "../controllers/product.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";

const productRoutes = Router();

// GET is public (shop needs it); write operations are admin-only
productRoutes.get(   "/",             getProducts);
productRoutes.get(   "/bestsellers",  getBestsellers);
productRoutes.get(   "/:id",          getProductById);
productRoutes.post(  "/",    authMiddleware, adminMiddleware, createProduct);
productRoutes.put(   "/:id", authMiddleware, adminMiddleware, updateProduct);
productRoutes.delete("/bulk", authMiddleware, adminMiddleware, bulkDeleteProducts);
productRoutes.delete("/:id", authMiddleware, adminMiddleware, deleteProduct);

export { productRoutes };
