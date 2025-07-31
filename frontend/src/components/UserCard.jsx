import { CheckCircleIcon, MapPinIcon, UserPlusIcon } from "lucide-react";
import { capitalize } from "../lib/utils";
import { getLanguageFlag } from "./FriendCard";

const UserCard = ({ user, hasRequestBeenSent, onSendRequest, isPending }) => {
    return (
        <div className="relative bg-base-200/60 backdrop-blur-xl border border-base-300/40 shadow-md rounded-xl p-4 transition hover:shadow-lg">
            {/* Top Row */}
            <div className="flex items-center gap-4">
                <div className="avatar size-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                    <img src={user.profilePic} alt={user.fullName} />
                </div>

                <div className="flex-1">
                    <h3 className="text-lg font-semibold">{user.fullName}</h3>
                    {user.location && (
                        <div className="flex items-center text-xs text-base-content/70 mt-1">
                            <MapPinIcon className="size-3 mr-1" />
                            {user.location}
                        </div>
                    )}
                </div>
            </div>

            {/* Language Badges */}
            <div className="flex flex-wrap gap-1.5 my-2">
                <span className="badge badge-secondary">
                    {getLanguageFlag(user.nativeLanguage)}
                    Native: {capitalize(user.nativeLanguage)}
                </span>
                <span className="badge badge-outline">
                    {getLanguageFlag(user.learningLanguage)}
                    Learning: {capitalize(user.learningLanguage)}
                </span>
            </div>

            {/* Bio */}
            {user.bio && (
                <p className="text-sm text-base-content/70 line-clamp-2">{user.bio}</p>
            )}

            {/* Friend Request Button */}
            <button
                className={`btn w-full mt-3 ${hasRequestBeenSent ? "btn-disabled" : "btn-primary"} btn-sm`}
                onClick={() => onSendRequest(user._id)}
                disabled={hasRequestBeenSent || isPending}
            >
                {hasRequestBeenSent ? (
                    <>
                        <CheckCircleIcon className="size-4 mr-2" />
                        Request Sent
                    </>
                ) : (
                    <>
                        <UserPlusIcon className="size-4 mr-2" />
                        Send Request
                    </>
                )}
            </button>
        </div>
    );
};

export default UserCard;
