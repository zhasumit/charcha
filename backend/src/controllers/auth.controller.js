import { upsertStreamUser } from "../lib/stream.js";
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

        try {
            await upsertStreamUser({
                id: newUser._id.toString(),
                name: newUser.fullName,
                image: newUser.profilePic || "",
            })
            console.log(`Stream User created for ${newUser.fullName}`)
        } catch (error) {
            console.log("Error creating stream user: ", error)
        }

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

export async function checkIfLoggedIn(req, res) {
    res.status(200).json({ success: true, user: req.user })
}

export function logout(req, res) {
    // clear the JWT token cookies
    res.clearCookie("jwt")
    res.status(200).json({ success: true, message: "Logout successful" })
}

export async function onboard(req, res) {
    // protected route is sending middleware and we get req.user 
    // req.user is not there in login, sigup, or any other which is not passed after middleware
    try {
        const userId = req.user._id
        const { fullName, bio, nativeLanguage, learningLanguage, location } = req.body
        if (!fullName || !bio || !nativeLanguage || !learningLanguage || !location) {
            return res.status(400).json({
                message: "All fields are required",
                missingFields: [
                    !fullName && "fullName",
                    !bio && "bio",
                    !nativeLanguage && "nativeLanguage",
                    !learningLanguage && "learningLanguage",
                    !location && "location",
                ].filter(Boolean),
            })
        }

        const updatedUser = await User.findByIdAndUpdate(userId, {
            ...req.body,
            isOnboarded: true,
        }, { new: true })
        // new:true gives the user after the update was applied (otherwise undefined -> gives old user)

        if (!updatedUser) return res.status(404).json({ message: "User not found" })


        try {
            await upsertStreamUser({
                id: updatedUser._id.toString(),
                name: updatedUser.fullName,
                image: updatedUser.profilePic || "",
            })
            console.log(`Stream user updated after onboarding for ${updatedUser.fullName}`)
        } catch (streamError) {
            console.log("Error updating stream user during onboarding: ", streamError.message)
        }


        return res.status(200).json({ success: true, user: updatedUser })
    } catch (error) {
        console.log("Onboarding error: ", error)
        res.status(500).json({ message: "Internal server error" })
    }
}