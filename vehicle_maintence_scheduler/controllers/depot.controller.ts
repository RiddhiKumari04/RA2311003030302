import { Request, Response } from "express";
import { Log } from "../../logging_middleware/logger.js";
import { fetchDepots, fetchVehicles, computeSchedule } from "../services/scheduler.service.js";

export async function getDepots(req: Request, res: Response) {
  try {
    Log("backend", "info", "controller", "Fetching all depots");
    const depots = await fetchDepots();
    Log("backend", "info", "controller", `Successfully fetched ${depots.length} depots`);
    res.json({ depots });
  } catch (error) {
    Log("backend", "error", "controller", `Failed to fetch depots: ${error}`);
    res.status(500).json({ error: "Failed to fetch depots" });
  }
}

export async function getSchedule(req: Request, res: Response) {
  try {
    const depotId = parseInt(req.params.depotId);
    Log("backend", "info", "controller", `Computing schedule for depot ${depotId}`);
    const result = await computeSchedule(depotId);
    Log("backend", "info", "controller", `Schedule computed for depot ${depotId}`);
    res.json(result);
  } catch (error) {
    Log("backend", "error", "controller", `Failed to compute schedule: ${error}`);
console.error("Full error:", error);
    res.status(500).json({ error: "Failed to compute schedule" });
  }
}