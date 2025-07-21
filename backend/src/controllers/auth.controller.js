import User from "../models/User.js";
import jwt from "jsonwebtoken"

export async function signup(req, res) {
    const { email, password, fullName } = req.body

    try {
        if (!email || !password || !fullName) {
            return res.status(400).json({ message: "All fields are required" })
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be atleast 6 characters" })
        }

        const emailRegex = /^(?!\.)[a-zA-Z0-9._%+-]{1,64}(?<!\.)@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid Email format" })
        }

        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists, please use a different email" })
        }

        const idx = Math.floor(Math.random() * 100) + 1; // [1...100]
        const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`
        const newUser = await User.create({
            email,
            fullName,
            password,
            profilePic: randomAvatar,
        })

        // TODO: just created in mongodb need to be created in stream

        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET_KEY, {
            expiresIn: "7d"
        })

        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true, // XSS attach protection
            sameSite: "strict", // CSRF attacks protection
            secure: process.env.NODE_ENV === "production"
        })

        res.status(201).json({ success: true, user: newUser })
    } catch (error) {
        console.log("error in signup controller", error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export async function login(req, res) {
    // user -> login (api/auth/login) -> check credentials -> JWT token(ifvalid) -> send token
    try {
        // get the request and find email and password from body
        const { email, password } = req.body

        if (!email || !password) {
            res.status(400).json({ message: "All fields are required!" })
        }

        // check the user credentials
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" })
        }
        const isPasswordCorrect = await user.matchPassword(password) // matchpassword from user model
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Invalid email or password" })
        }

        // assign JWT token to the user and send it back as cookies
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
            expiresIn: "7d"
        })

        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true, // XSS attach protection
            sameSite: "strict", // CSRF attacks protection
            secure: process.env.NODE_ENV === "production"
        })

        res.status(200).json({ success: true, user })
    } catch (error) {
        console.log("Error in login controller", error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export function logout(req, res) {
    // clear the JWT token cookies
    res.clearCookie("jwt")
    res.status(200).json({ success: true, message: "Logout successful" })
}