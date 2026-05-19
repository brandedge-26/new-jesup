import express from "express";
import { createContactController, getContactsController, deleteContactController } from "../controllers/contact.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

export const contactRoutes = express.Router();

contactRoutes.post("/",          createContactController);
contactRoutes.get("/",           authMiddleware, getContactsController);
contactRoutes.delete("/:id",     authMiddleware, deleteContactController);
