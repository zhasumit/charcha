import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js"
import {
  acceptFriendRequest,
  getFriendRequests,
  getMyFriends,
  getOutgoingFriendRequests,
  getRecommendedUsers,
  sendFriendRequest
} from "../controllers/user.controller.js"
const router = express.Router()

// use protectRoute middleware first and then go for different route
router.use(protectRoute)

router.get("/", getRecommendedUsers)
router.get("/friends", getMyFriends)

router.post("/friend-request/:id", sendFriendRequest)
router.put("/friend-request/:id/accept", acceptFriendRequest)

router.get("/friend-requests", getFriendRequests)
router.get("/outgoing-friend-requests", getOutgoingFriendRequests)

export default router 