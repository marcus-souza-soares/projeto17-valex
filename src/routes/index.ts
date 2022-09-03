import { Router } from "express";
import cardRoutes from '../routes/cardRoutes.js'

const router = Router();

router.use("/", cardRoutes)

export default router;