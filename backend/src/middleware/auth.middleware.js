import jwt from "jsonwebtoken"
import User from "../models/User.js"

// verify if 1> token present, 2> token matches the JWT secret key, 3> send user - password
export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt
        if (!token)
            return res.status(401).json({ message: "Unauthorized access - No token provided" })

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
        if (!decoded)
            return res.status(401).json({ message: "Unauthorized access - Invalid token" })

        const user = await User.findById(decoded.userId).select("-password")
        if (!user)
            return res.status(401).json({ message: "Unauthorized access - User not found" })

        req.user = user
        next()
    } catch (error) {
        console.log("Error in protect route middleware,", error)
        return res.status(500).json({ message: "Internal Server error" })
    }
}