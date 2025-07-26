import React, { useState } from 'react'
import useAuthUser from '../hooks/useAuthUser'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { completeOnboarding } from '../lib/api';
import { CameraIcon, Loader, MapPin, Rabbit, ShuffleIcon } from 'lucide-react';
import { LANGUAGES } from "../constants";

const OnboardingPage = () => {
    const { authUser } = useAuthUser()
    const queryClient = useQueryClient();

    const [formState, setFormState] = useState({
        fullName: authUser?.fullName || "",
        bio: authUser?.bio || "",
        nativeLanguage: authUser?.nativeLanguage || "",
        learningLanguage: authUser?.learningLanguage || "",
        location: authUser?.location || "",
        profilePic: authUser?.profilePic || "",
    });

    const { mutate: onboardingMutation, isPending } = useMutation({
        mutationFn: completeOnboarding,
        onSuccess: () => {
            toast.success("Profile onboarded successfully")
            queryClient.invalidateQueries({ queryKey: ["authUser"] })
        },
        onError: (error) => { toast.error(error.response.data.message) }
    })

    const handleSubmit = (e) => {
        e.preventDefault();
        onboardingMutation(formState)
    }

    const handleRandomAvatar = () => {
        const index = Math.floor(Math.random() * 100) + 1;
        const randomAvatar = `https://avatar.iran.liara.run/public/${index}.png`;
        // get a random number between 1-100 and put that in the dynamic api to get a profile pic
        setFormState({ ...formState, profilePic: randomAvatar });
        toast.success("Random profile picture generated!");
    }

    return (
        <div className="min-h-screen bg-base-100 flex items-center justify-center p-2">
            <div className="card bg-base-200 w-full max-w-lg shadow-lg">
                <div className="card-body p-6 sm:p-8 space-y-5">
                    <h1 className="text-2xl font-semibold text-center">Complete Your Profile</h1>

                    <form onSubmit={handleSubmit} className="space-y-3 text-base">
                        <div className="flex flex-col items-center gap-3">
                            <div className="flex justify-center">
                                <div className="relative inline-block">
                                    <div className="size-28 rounded-full bg-base-300 overflow-hidden">
                                        {formState.profilePic ? (
                                            <img
                                                src={formState.profilePic}
                                                alt="Profile Preview"
                                                className="w-full h-full object-cover rounded-full"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full">
                                                <CameraIcon className="size-10 text-base-content opacity-40" />
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleRandomAvatar}
                                        className="btn btn-circle btn-sm btn-accent shadow-lg absolute"
                                        style={{ bottom: '-5%', right: '-5%', zIndex: 50 }}
                                        aria-label="Generate Random Avatar"
                                    >
                                        <ShuffleIcon className="size-4 font-semibold" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="form-control">
                            <label className="label label-text">Full Name</label>
                            <input
                                type="text"
                                name="fullName"
                                value={formState.fullName}
                                onChange={(e) => setFormState({ ...formState, fullName: e.target.value })}
                                className="input input-bordered input-md w-full"
                                placeholder="Your full name"
                            />
                        </div>

                        <fieldset className="form-control w-full">
                            <legend className="label label-text">Your Bio</legend>
                            <textarea
                                name="bio"
                                value={formState.bio}
                                onChange={(e) => setFormState({ ...formState, bio: e.target.value })}
                                className="textarea textarea-bordered h-24 w-full min-w-full"
                                placeholder="Tell others about yourself"
                            />
                        </fieldset>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Native Language</span>
                                </label>
                                <select
                                    name="nativeLanguage"
                                    value={formState.nativeLanguage}
                                    onChange={(e) => setFormState({ ...formState, nativeLanguage: e.target.value })}
                                    className="select select-bordered w-full"
                                >
                                    <option value="">Native tounge</option>
                                    {LANGUAGES.map((lang) => (
                                        <option key={`native-${lang}`} value={lang.toLowerCase()}>
                                            {lang}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Learning Language</span>
                                </label>
                                <select
                                    name="learningLanguage"
                                    value={formState.learningLanguage}
                                    onChange={(e) => setFormState({ ...formState, learningLanguage: e.target.value })}
                                    className="select select-bordered w-full"
                                >
                                    <option value="">what you wanna learn</option>
                                    {LANGUAGES.map((lang) => (
                                        <option key={`learning-${lang}`} value={lang.toLowerCase()}>
                                            {lang}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="form-control">
                            <label className="label label-text">Location</label>
                            <div className="relative w-full">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-base-content opacity-55 z-10" />
                                <input
                                    type="text"
                                    name="location"
                                    value={formState.location}
                                    onChange={(e) => setFormState({ ...formState, location: e.target.value })}
                                    className="input input-bordered input-md w-full pl-8"
                                    placeholder="City, Country"
                                />
                            </div>
                        </div>
                        <div className='flex justify-center'>
                            <button className="btn btn-primary btn-md w-fit" disabled={isPending} type="submit">
                                {!isPending ? (
                                    <>
                                        <Rabbit className="size-5 mr-2" />
                                        Complete Onboarding
                                    </>
                                ) : (
                                    <>
                                        <Loader className="animate-spin size-5 mr-2" />
                                        Onboarding...
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );


}

export default OnboardingPage