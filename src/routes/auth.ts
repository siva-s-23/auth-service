import { Router } from "express";
import passport from "passport";
import { setupGoogleStrategy } from "../strategies/google";

setupGoogleStrategy(); // configure Passport Google strategy

const router = Router();

// Trigger Google login
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Callback route
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req: any, res) => {
    res.json({ message: "Google login successful", user: req.user });
  }
);

export default router;
