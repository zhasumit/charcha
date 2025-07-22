import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js"
import { getMyFriends, getRecommendedUsers } from "../controllers/user.controller.js"
const router = express.Router()

// use protectRoute middleware first and then go for different route
router.use(protectRoute)

router.get("/", getRecommendedUsers)
router.get("/friends", getMyFriends)

export default router