import dotenv from "dotenv";
import { app } from "./App.ts";
import { connectionDB } from "./db/connection.ts";

// Environment variable configuration
dotenv.config({
  path: "./.env",
});

// Connect to MongoDB
connectionDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server running on port ${process.env.PORT || 8000}`);
    });
  })
  .catch((err) => console.log(`MongoDB connection failed`, err));
