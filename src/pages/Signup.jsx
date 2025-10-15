import { useFirebase } from '../context/FireBase.jsx'
import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router'

const Signup = () => {
    const firebase = useFirebase()
    let [userInfo, setUserInfo] = useState({
        userName: "",
        userEmail: "",
        userPassword: ''
    })
    const navigate = useNavigate()

    const handleInfo = (e) => {
        setUserInfo(prev => ({ ...prev, [e.target.name]: e.target.value })
        )
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            let res = await firebase.signup(userInfo.userEmail, userInfo.userPassword)
            // Navigation on success can be added here
           
        }
        catch (err) {
            alert(err)
        }
    }

    // Redirect if already logged i
    if (firebase.isLoggedIn) {
        return navigate('/')
    }

    return (
        // Outer Container: Centered, full-height, responsive padding
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            {/* Card Wrapper: Adjusted Max Width for larger screens 
              sm:max-w-md (small screens) -> md:max-w-lg (medium screens) -> lg:max-w-xl (large screens)
            */}
            <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl 
                            p-8 space-y-6 
                            bg-white dark:bg-gray-800 
                            rounded-xl shadow-2xl 
                            border border-gray-200 dark:border-gray-700">

                {/* Header */}
                <div className="text-center">
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                        Welcome to Signup Page
                    </h1>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* User Name Field */}
                    <div>
                        <label 
                            htmlFor="user-name" 
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                            User Name
                        </label>
                        <input type="text"
                            id="user-name"
                            value={userInfo.userName}
                            name="userName"
                            required
                            onChange={handleInfo}
                            placeholder="Enter User Name here"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
                                       rounded-lg shadow-sm 
                                       placeholder-gray-400 dark:placeholder-gray-500 
                                       focus:outline-none focus:ring-blue-500 focus:border-blue-500 
                                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                    </div>
                    
                    {/* User Email Field */}
                    <div>
                        <label 
                            htmlFor="user-email" 
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                            User Email
                        </label>
                        <input type="email"
                            id="user-email"
                            name="userEmail"
                            value={userInfo.userEmail}
                            required
                            onChange={handleInfo}
                            placeholder="Enter Your Email here"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
                                       rounded-lg shadow-sm 
                                       placeholder-gray-400 dark:placeholder-gray-500 
                                       focus:outline-none focus:ring-blue-500 focus:border-blue-500 
                                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                    </div>
                    
                    {/* User Password Field */}
                    <div>
                        <label 
                            htmlFor="user-password" 
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                            User Password
                        </label>
                        <input type="password"
                            id="user-password"
                            name="userPassword"
                            value={userInfo.userPassword}
                            required
                            onChange={handleInfo}
                            placeholder="Enter Your Password"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 
                                       rounded-lg shadow-sm 
                                       placeholder-gray-400 dark:placeholder-gray-500 
                                       focus:outline-none focus:ring-blue-500 focus:border-blue-500 
                                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                    </div>
                    
                    {/* Submit Button */}
                    <div>
                        <button 
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 
                                       border border-transparent rounded-lg shadow-sm 
                                       text-lg font-medium text-white 
                                       bg-blue-600 hover:bg-blue-700 
                                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
                                       dark:focus:ring-offset-gray-800 
                                       transition duration-150 ease-in-out"
                        >
                            Signup
                        </button>
                    </div>
                </form>

                {/* Login Link */}
                <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                    Already have an Account? 
                    <Link 
                        to="/login"
                        className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 ml-1 transition duration-150"
                    >
                        Login Page
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default Signup
