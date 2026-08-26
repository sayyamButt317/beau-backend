import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import productRoutes from "./Routes/product.routes.ts";
import { connectionDB } from "./db/connection.ts";

const app = express();

// Middleware
app.use(morgan("dev"));
app.use(express.json({ limit: "15mb" }));
app.use(cors());
app.use(cookieParser());

// Routes Declaration
app.use("/api", productRoutes);

// Health check (useful on Vercel)
app.get("/", (_req, res) => {
  res.status(200).json({ status: 200, message: "API is running" });
});

// Error handling middleware
app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).send("Something broke!");
  }
);

// Connect DB once (reused across serverless invocations when warm)
await connectionDB();

export default app;
