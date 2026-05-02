import express from "express";
import { getDepots, getSchedule } from "../controllers/depot.controller.js";

const router = express.Router();

router.get("/depots", getDepots);
router.get("/schedule/:depotId", getSchedule);

export default router;