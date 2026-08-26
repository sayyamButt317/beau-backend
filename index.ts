import dotenv from "dotenv";
import app from "./App.js";

dotenv.config({
  path: "./.env",
});

// Local/dev only — Vercel uses the default export as a serverless function
if (!process.env.VERCEL) {
  const port = Number(process.env.PORT) || 8000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

export default app;
