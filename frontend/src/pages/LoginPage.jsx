import React, { useState } from 'react'
import { ArrowUpRight, Loader2, Rabbit, Siren } from 'lucide-react'
import { Link } from 'react-router'
import useLogin from '../hooks/useLogin'
import LanguagePartnersIllustration from '../components/icons/LanguagePartnersIllustration'
import { useThemeStore } from '../store/useThemeStore'

const LoginPage = () => {
    const { theme } = useThemeStore()
    const [loginData, setLoginData] = useState({
        email: "",
        password: ""
    })

    // make the hook just like the /auth/me for getting the userAuth
    const { isPending, error, loginMutation } = useLogin()
    const handleLogin = (e) => {
        e.preventDefault()
        loginMutation(loginData)
    }

    return (
        <div
            className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8"
            data-theme={theme}
        >
            <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden">
                {/* LOGIN FORM SECTION */}
                <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col">
                    {/* LOGO */}
                    <div className="mb-4 flex items-center justify-start gap-2">
                        <Rabbit className="size-9 text-primary" />
                        <span className="text-3xl font-bold bg-clip-text ">
                            Charcha
                        </span>
                    </div>

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

                    <div className="w-full">
                        <form onSubmit={handleLogin}>
                            <div className="space-y-4">
                                <div>
                                    <h2 className="text-lg font-semibold">Welcome back</h2>
                                    <p className="text-xs opacity-70">
                                        Sign in to your account to continue your language journey
                                    </p>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <div className="form-control w-full">
                                        <label className="label">
                                            <span className="label-text">Email</span>
                                        </label>
                                        <input
                                            type="email"
                                            placeholder="hello@example.com"
                                            className="input input-bordered w-full"
                                            value={loginData.email}
                                            onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="form-control w-full">
                                        <label className="label">
                                            <span className="label-text">Password</span>
                                        </label>
                                        <input
                                            type="password"
                                            placeholder="••••••••"
                                            className="input input-bordered w-full"
                                            value={loginData.password}
                                            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                            required
                                        />
                                    </div>


                                    <button className="btn btn-primary w-full flex items-center justify-center gap-2" type="submit" disabled={isPending}>
                                        {isPending ? (
                                            <>
                                                <Loader2 className="animate-spin w-4 h-4" />
                                                <span>Signing in...</span>
                                            </>
                                        ) : (
                                            "Sign In"
                                        )}
                                    </button>


                                    <div className="text-center mt-4">
                                        <p className="text-sm">
                                            Don't have an account?{" "}
                                            <Link to="/signup" className="text-primary hover:underline inline-flex items-center">
                                                <span className="text-sm">Create Account</span>
                                                <ArrowUpRight className="w-3 h-3 relative -top-0.5" />
                                            </Link>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                {/* IMAGE SECTION */}
                <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
                    <div className="max-w-md p-8">
                        {/* Illustration */}
                        <div className="relative aspect-square max-w-sm mx-auto">
                            <LanguagePartnersIllustration />
                        </div>

                        <div className="text-center space-y-3 mt-6">
                            <h2 className="text-lg font-semibold">Continue your language journey</h2>
                            <p className="text-sm opacity-70">
                                Chat, connect, and grow your skills with global partners.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage