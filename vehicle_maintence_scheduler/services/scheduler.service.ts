import { Log } from "../../logging_middleware/logger.js";

let AUTH_TOKEN = "";

async function getToken(): Promise<string> {
  Log("backend", "info", "auth", "Fetching fresh auth token");
  const response = await fetch("http://20.207.122.201/evaluation-service/auth", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "pg5789@srmist.edu.in",
      name: "Priyanshu Gupta",
      rollNo: "RA2311003030294",
      accessCode: "QkbpxH",
      clientID: "36e9ae7a-eb2c-4ce4-bd05-89e7dcb15249",
      clientSecret: "YDYSnUHbgbYFJRAV"
    })
  });
  const data = await response.json();
  AUTH_TOKEN = data.access_token;
  Log("backend", "info", "auth", "Auth token refreshed successfully");
  return AUTH_TOKEN;
}

async function getHeaders() {
  await getToken();
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${AUTH_TOKEN}`
  };
}

export async function fetchDepots() {
  Log("backend", "info", "service", "Calling depots API");
  const headers = await getHeaders();
  const response = await fetch("http://20.207.122.201/evaluation-service/depots", { headers });
  const data = await response.json();
  Log("backend", "info", "service", `Depots API returned ${data.depots.length} depots`);
  return data.depots;
}

export async function fetchVehicles() {
  Log("backend", "info", "service", "Calling vehicles API");
  const headers = await getHeaders();
  const response = await fetch("http://20.207.122.201/evaluation-service/vehicles", { headers });
  const data = await response.json();
  Log("backend", "info", "service", `Vehicles API returned ${data.vehicles.length} vehicles`);
  return data.vehicles;
}

export async function computeSchedule(depotId: number) {
  Log("backend", "info", "service", `Starting schedule computation for depot ${depotId}`);

  const [depots, vehicles] = await Promise.all([fetchDepots(), fetchVehicles()]);

  const depot = depots.find((d: any) => d.ID === depotId);
  if (!depot) {
    Log("backend", "error", "service", `Depot ${depotId} not found`);
    throw new Error(`Depot ${depotId} not found`);
  }

  const capacity = depot.MechanicHours;
  Log("backend", "info", "service", `Depot ${depotId} has ${capacity} mechanic hours available`);

  const n = vehicles.length;
  const dp = Array(n + 1).fill(null).map(() => Array(capacity + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    const vehicle = vehicles[i - 1];
    for (let w = 0; w <= capacity; w++) {
      dp[i][w] = dp[i - 1][w];
      if (vehicle.Duration <= w) {
        dp[i][w] = Math.max(dp[i][w], dp[i - 1][w - vehicle.Duration] + vehicle.Impact);
      }
    }
  }

  const selected = [];
  let w = capacity;
  for (let i = n; i > 0; i--) {
    if (dp[i][w] !== dp[i - 1][w]) {
      selected.push(vehicles[i - 1]);
      w -= vehicles[i - 1].Duration;
    }
  }

  Log("backend", "info", "service", `Selected ${selected.length} vehicles with total impact ${dp[n][capacity]}`);

  return {
    depotId,
    mechanicHours: capacity,
    totalImpact: dp[n][capacity],
    selectedVehicles: selected
  };
}