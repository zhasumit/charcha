import express from "express"
import { checkIfLoggedIn, login, logout, onboard, signup } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// for getting new user, getting Token for user, removing token of user
router.post("/signup", signup)
router.post("/login", login)
router.get("/me", protectRoute, checkIfLoggedIn)
router.post("/logout", logout)

// for filling some info like bio, native, learning language, location
// only go to onboarding if authenticated (Token), protected route 
router.post("/onboarding", protectRoute, onboard)

export default router;