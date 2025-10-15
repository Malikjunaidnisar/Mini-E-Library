import { useFirebase } from '../context/FireBase.jsx'
import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router' // Changed 'react-router' to 'react-router-dom'

const Login = () => {
    const firebase = useFirebase()
    let [userInfo, setUserInfo] = useState({
        userEmail: "",
        userPassword: ""
    })
    const [message, setMessage] = useState(null) // State for messages/errors
    const [loading, setLoading] = useState(false) // State for loading indicator

    let navigate = useNavigate()

    const handleInfo = (e) => {
        setUserInfo(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setMessage(null)
        setLoading(true)

        try {
            await firebase.login(userInfo.userEmail, userInfo.userPassword)
            // Firebase automatically logs in and the useEffect/if(isLoggedIn) below handles navigation
            setMessage({ type: 'success', text: 'Login successful! Redirecting...' })
        }
        catch (err) {
            console.error(err);
            // Replace alert with a styled message
            setMessage({ type: 'error', text: err.message || "Login failed. Check your credentials." })
        } finally {
            setLoading(false)
        }
    }

    const handleGoogleLogin = async () => {
        setMessage(null)
        setLoading(true)

        try {
            await firebase.loginWithGoogle()
            setMessage({ type: 'success', text: 'Google login successful! Redirecting...' })
        }
        catch (err) {
            console.error(err);
            // Replace alert with a styled message
            setMessage({ type: 'error', text: err.message || "Google login failed." })
        } finally {
            setLoading(false)
        }
    }

    // Check login status and redirect if needed
    if (firebase.isLoggedIn) {
        return navigate('/')
    }

    return (
        // Outer Container: Centered, full-height, responsive padding
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            {/* Card Wrapper: Responsive width matching the Signup page */}
            <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl 
                            p-8 space-y-6 
                            bg-white dark:bg-gray-800 
                            rounded-xl shadow-2xl 
                            border border-gray-200 dark:border-gray-700">

                {/* Header */}
                <div className="text-center">
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                        Welcome to Login Page
                    </h1>
                </div>

                {/* Message Display (Replaces alert()) */}
                {message && (
                    <div 
                        className={`p-3 rounded-lg text-sm font-medium ${
                            message.type === 'error' ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200' :
                            'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'
                        }`}
                        role="alert"
                    >
                        {message.text}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* User Email Field (Moved above Password for typical flow) */}
                    <div>
                        <label htmlFor="user-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            User Email
                        </label>
                        <input type="email"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
                                       rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 
                                       focus:outline-none focus:ring-blue-500 focus:border-blue-500 
                                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            id="user-email"
                            name="userEmail"
                            value={userInfo.userEmail}
                            required
                            onChange={handleInfo}
                            placeholder="Enter Your Email here"
                        />
                    </div>

                    {/* User Password Field */}
                    <div>
                        <label htmlFor="user-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Password
                        </label>
                        <input type="password"
                            id="user-password"
                            value={userInfo.userPassword}
                            name="userPassword"
                            required
                            onChange={handleInfo}
                            placeholder="Enter Password here"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
                                       rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 
                                       focus:outline-none focus:ring-blue-500 focus:border-blue-500 
                                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                    </div>
                    
                    {/* Submit Button */}
                    <div>
                        <button 
                            type="submit"
                            disabled={loading} // Disable button while loading
                            className="w-full flex justify-center py-2 px-4 
                                       border border-transparent rounded-lg shadow-sm 
                                       text-lg font-medium text-white 
                                       bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 
                                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
                                       dark:focus:ring-offset-gray-800 
                                       transition duration-150 ease-in-out"
                        >
                            {loading ? (
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : "Login"}
                        </button>
                    </div>
                </form>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                        <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                            Or continue with
                        </span>
                    </div>
                </div>

                {/* Google Login Button */}
                <div>
                    <button 
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="w-full flex justify-center items-center py-2 px-4 
                                   border border-gray-300 dark:border-gray-600 
                                   rounded-lg shadow-sm 
                                   text-md font-medium text-gray-700 dark:text-gray-300 
                                   bg-white hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 
                                   focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
                                   transition duration-150 ease-in-out disabled:opacity-50"
                    >
                        {/* Google Icon SVG */}
                        <svg className="w-5 h-5 mr-3" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M44.5 20H24V28.5H35.42C34.73 31.84 32.22 34.58 29.07 36.65L29.09 36.93 37.64 43.14 37.8 43.35C43.14 37.93 46 30.65 46 24C46 22.33 45.74 20.69 45.24 19.14L44.5 20Z" fill="#4285F4"/>
                            <path d="M24 46C30.41 46 36.05 44.06 40.54 40.85L32.24 34.69C30.13 36.19 27.24 37.1 24 37.1C17.38 37.1 11.75 32.61 9.77 26.54L9.46 26.86 1.77 32.74 1.48 33.04C5.81 41.71 14.18 46 24 46Z" fill="#34A853"/>
                            <path d="M9.77 26.54C9.28 25.13 9 23.59 9 22C9 20.41 9.28 18.87 9.77 17.46L9.46 17.14 1.48 11.04 1.77 10.74C5.81 2.37 14.18 0 24 0C29.67 0 34.66 1.95 38.64 5.67L32.48 10.45C29.84 8.04 26.79 7.04 24 7.04C17.38 7.04 11.75 11.53 9.77 17.6L9.77 17.46Z" fill="#FBBC05"/>
                            <path d="M40.54 8.71L32.48 13.49C36.05 16.63 38 20.37 38 24C38 25.67 37.74 27.31 37.24 28.86L44.5 27.5C45.26 25.95 46 24.16 46 22C46 15.39 43.14 9.17 37.8 4.65L40.54 8.71Z" fill="#EA4335"/>
                        </svg>
                        Login with Google
                    </button>
                </div>

                {/* Signup Link */}
                <div className="pt-2 text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Don't have an Account! 
                        <Link 
                            to="/signup"
                            className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 ml-1 transition duration-150"
                        >
                            Signup First
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login
