import { Router } from "express";
import cardRoutes from '../routes/cardRoutes.js'
import rechargeRoutes from "../routes/rechargeRoutes.js";
import paymentRouter from "./paymentRoutes.js";

const router = Router();

router.use("/", cardRoutes);
router.use("/", rechargeRoutes);
router.use("/", paymentRouter);
export default router;