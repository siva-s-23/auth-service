import express from "express";
import dotenv from "dotenv";
import passport from "passport";
import "./prisma";
import authRoutes from "./routes/auth";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(passport.initialize());

// Mount all auth-related routes
app.use("/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Auth service running on http://localhost:${PORT}`);
});
