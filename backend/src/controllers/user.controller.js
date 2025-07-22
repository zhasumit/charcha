import User from "../models/User.js"

export async function getRecommendedUsers(req, res) {
    try {
        const currentUserId = req.user.id
        const currentUser = req.user

        // recommended users -= not me + not my friends 
        const recommendedUsers = await User.find({
            $and: [
                { _id: { $ne: currentUserId } }, // not current user
                { $id: { $nin: currentUser.friends } }, // not in current friends
                { isOnboarded: true }
            ]
        })
        res.status(200), json(recommendedUsers)
    } catch (error) {
        console.log("Error in getting recommended users: ", error.message)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export async function getMyFriends(req, res) {
    try {
        const user = await User.findById(req.user.id)
            .select("friends")
            .populate("friends", "fullName profilePic nativeLanguage learningLanguage")
        res.status(200).json(user.friends)
    } catch (error) {
        console.log("Error in getMyFriends controller", error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}