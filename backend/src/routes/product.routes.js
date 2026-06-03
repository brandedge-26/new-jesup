import { Router } from "express";
import {
    getProducts,
    getProductById,
    getBestsellers,
    uploadProductImage,
    createProduct,
    updateProduct,
    deleteProduct,
    bulkDeleteProducts,
} from "../controllers/product.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";
import { uploadProduct } from "../config/multer.js";

const productRoutes = Router();

productRoutes.get(   "/",              getProducts);
productRoutes.get(   "/bestsellers",   getBestsellers);
productRoutes.get(   "/:id",           getProductById);
productRoutes.post(  "/upload-image",  authMiddleware, adminMiddleware, uploadProduct.single("image"), uploadProductImage);
productRoutes.post(  "/",              authMiddleware, adminMiddleware, createProduct);
productRoutes.put(   "/:id",           authMiddleware, adminMiddleware, updateProduct);
productRoutes.delete("/bulk",          authMiddleware, adminMiddleware, bulkDeleteProducts);
productRoutes.delete("/:id",           authMiddleware, adminMiddleware, deleteProduct);

export { productRoutes };
