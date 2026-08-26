import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import productRoutes from "./Routes/product.routes.ts";
import morgan from "morgan";

const app = express();

// Middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// Routes Declaration
app.use("/api", productRoutes);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

export { app };

