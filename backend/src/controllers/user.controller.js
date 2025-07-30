import User from "../models/User.js"
import FriendRequest from "../models/FriendRequest.js"

export async function getRecommendedUsers(req, res) {
    try {
        const currentUserId = req.user.id;
        const currentUser = req.user;

        const recommendedUsers = await User.find({
            $and: [
                { _id: { $ne: currentUserId } }, //exclude current user
                { _id: { $nin: currentUser.friends } }, // exclude current user's friends
                { isOnboarded: true },
            ],
        });
        res.status(200).json(recommendedUsers);
    } catch (error) {
        console.error("Error in getRecommendedUsers controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
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

export async function sendFriendRequest(req, res) {
    try {
        const myId = req.user.id
        const { id: recipientId } = req.params

        // dont send friend request to myself
        if (myId === recipientId) return res.status(400).json({ message: "Cannot send Friend Request to yourself" })

        // find the user to send the request to 
        const recipient = await User.findById(recipientId)
        if (!recipient) return res.status(400).json({ message: "Recipient not found" })

        // if already friends
        if (recipient.friends.includes(myId)) return res.status(400).json({ message: "Already friends with this user" })

        // if request already pending
        const requestPending = await FriendRequest.findOne({
            $or: [
                { sender: myId, recipient: recipientId },
                { sender: recipientId, recipient: myId }
            ]
        })
        if (requestPending) return res.status(400).json({ message: "Friend Request already pending" })

        // create a friend request
        const friendRequest = await FriendRequest.create({
            sender: myId,
            recipient: recipientId
        })
        res.status(201).json(friendRequest)

    } catch (error) {
        console.log("Error in friend request controller", error.message)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export async function acceptFriendRequest(req, res) {
    try {
        const { id: requestId } = req.params
        const friendRequest = await FriendRequest.findById(requestId)
        if (!friendRequest) res.status(404).json({ message: "Friend request not found" })

        // if req can be accepted by me? (recipient)
        if (friendRequest.recipient.toString() !== req.user.id)
            return res.status(403).json({ message: "Not authorized to accept the request" })

        // accept the request (enum -> accepted)
        friendRequest.status = "accepted"
        await friendRequest.save()

        // add my id in the friends of the other person and viceversa (addToSet: add elements in [] if they do not exist)
        await User.findByIdAndUpdate(friendRequest.sender, {
            $addToSet: { friends: friendRequest.recipient }
        })
        await User.findByIdAndUpdate(friendRequest.recipient, {
            $addToSet: { friends: friendRequest.sender }
        })

        res.status(200).json({ message: "Friend request Accepted" })
    } catch {
        console.log("Error in acceptfriendRequest controller", error.message)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export async function getFriendRequests(req, res) {
    try {
        const incomingFriendRequests = await FriendRequest.find({
            recipient: req.user.id,
            status: "pending"
        }).populate("sender", "fullName profilePic nativeLanguage learningLanguage")

        const acceptedFriendRequests = await FriendRequest.find({
            sender: req.user.id,
            status: "accepted"
        }).populate("recipient", "fullName profilePic")

        res.status(200).json({ incomingFriendRequests, acceptedFriendRequests })
    } catch (error) {
        console.log("Error in getFriendRequests controller", error.message)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export async function getOutgoingFriendRequests(req, res) {
    try {
        const outgoingRequests = await FriendRequest.find({
            sender: req.user.id,
            status: "pending"
        }).populate("recipient", "fullName profilePic nativeLanguage learningLanguage")
        res.status(200).json(outgoingRequests)
    } catch (error) {
        console.log("Error in getOutgoingFriendRequests controller", error.message)
        res.status(500).json({ message: "Internal Server error" })
    }
}
