import express from "express";
import depotRouter from "./routes/depot.js";

const app = express();
app.use(express.json());

app.use("/api", depotRouter);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;