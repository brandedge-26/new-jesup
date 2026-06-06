import { Router } from "express";
import { subscribe, unsubscribe } from "../controllers/newsletter.controller.js";

export const newsletterRoutes = Router();

newsletterRoutes.post("/subscribe",           subscribe);
newsletterRoutes.get( "/unsubscribe/:token",  unsubscribe);
