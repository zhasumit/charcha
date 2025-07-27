import { useState } from "react";
import { ArrowUpRight, Loader2, Rabbit, Siren } from "lucide-react";
import { Link } from "react-router";
import useSignup from '../hooks/useSignup'
import LanguagePartnersIllustration from "../components/icons/LanguagePartnersIllustration";

const SignUpPage = () => {
    const [signupData, setSignupData] = useState({
        fullName: "",
        email: "",
        password: "",
    });

    const { isPending, error, signupMutation } = useSignup()

    const handleSignup = (e) => {
        e.preventDefault(); // screen is not refreshed 
        signupMutation(signupData) // sending signup data at the endpoint (declared above )
    };

    return (
        <div
            className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8"
            data-theme="dark"
        >
            <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden">
                {/* SIGNUP FORM - LEFT SIDE */}
                <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col">
                    {/* LOGO */}
                    <div className="mb-4 flex items-center justify-start gap-2">
                        <Rabbit className="size-9 text-primary" />
                        <span className="text-3xl font-bold bg-clip-text ">
                            Charcha
                        </span>
                    </div>


                    <div className="w-full">
                        <form onSubmit={handleSignup}>
                            <div className="space-y-4">
                                <div>
                                    <h2 className="text-lg font-semibold">Create an Account</h2>
                                    <p className="text-xs opacity-70">
                                        Join Charcha and start your language learning adventure!
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    {/* FULLNAME */}
                                    <div className="form-control w-full">
                                        <label className="label">
                                            <span className="label-text">Full Name</span>
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Full Name *"
                                            className="input input-bordered w-full"
                                            value={signupData.fullName}
                                            onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
                                            required
                                        />
                                    </div>
                                    {/* EMAIL */}
                                    <div className="form-control w-full">
                                        <label className="label">
                                            <span className="label-text">Email</span>
                                        </label>
                                        <input
                                            type="email"
                                            placeholder="your email address *"
                                            className="input input-bordered w-full"
                                            value={signupData.email}
                                            onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                                            required
                                        />
                                    </div>
                                    {/* PASSWORD */}
                                    <div className="form-control w-full">
                                        <label className="label">
                                            <span className="label-text">Password</span>
                                        </label>
                                        <input
                                            type="password"
                                            placeholder="********"
                                            className="input input-bordered w-full"
                                            value={signupData.password}
                                            onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                                            required
                                        />
                                        <p className="text-xs opacity-70 mt-1">
                                            Password must be at least 6 characters long
                                        </p>
                                    </div>

                                    <div className="form-control">
                                        <label className="label cursor-pointer justify-start gap-2">
                                            <input
                                                type="checkbox"
                                                className="checkbox checkbox-sm border-gray-300 checked:border-green-900 checked:bg-green-700"
                                                required
                                            />
                                            <span className="text-xs leading-tight">
                                                I agree to the{" "}
                                                <span className="text-primary hover:underline">terms of service</span> and{" "}
                                                <span className="text-primary hover:underline">privacy policy</span>
                                            </span>
                                        </label>
                                    </div>

                                </div>

                                <button className="btn btn-primary w-full flex items-center justify-center gap-2" type="submit" disabled={isPending}>
                                    {isPending ? (
                                        <>
                                            <Loader2 className="animate-spin w-4 h-4" />
                                            <span>Signing up...</span>
                                        </>
                                    ) : (
                                        "Create Account"
                                    )}
                                </button>

                                {error && (
                                    <div className="flex justify-center mb-3">
                                        <div className="alert alert-error shadow-lg w-full px-6 py-4 rounded-xl border border-red-500 bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-200">
                                            <div className="flex items-center gap-3">
                                                <Siren className="w-5 h-5 stroke-red-600 dark:stroke-red-300" />
                                                <span className="text-sm font-medium">{error.response?.data?.message || "Something went wrong"}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="text-center mt-4">
                                    <p className="text-sm">
                                        Already have an account?{" "}
                                        <Link to="/login" className="text-primary hover:underline inline-flex items-center">
                                            <span className="text-sm">Sign in</span>
                                            <ArrowUpRight className="w-3 h-3 relative -top-0.5" />
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                {/* SIGNUP FORM - RIGHT SIDE */}
                <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
                    <div className="max-w-md p-8">
                        {/* Illustration */}
                        <div className="relative aspect-square max-w-sm mx-auto">
                            <LanguagePartnersIllustration />
                        </div>

                        <div className="text-center space-y-3 mt-6">
                            <h2 className="text-lg font-semibold">Connect with language partners worldwide</h2>
                            <p className="text-sm opacity-70">
                                Practice conversations, make friends, and improve your language skills together
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;