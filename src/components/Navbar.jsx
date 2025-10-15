import { Link } from 'react-router';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router';
import { useFirebase } from '../context/FireBase.jsx';
import { useState, useEffect } from 'react';

// --- Dark Mode Toggle Component (Unchanged) ---
const DarkModeToggle = ({ isDark, onToggle }) => (
  <button
    onClick={onToggle}
    className="p-2 ml-4 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 
               focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
               transition duration-300 ease-in-out hover:shadow-lg"
    aria-label="Toggle dark mode"
  >
    {isDark ? (
      // Sun Icon
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
      </svg>
    ) : (
      // Moon Icon
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
      </svg>
    )}
  </button>
);


// --- Theme Configuration (Unchanged) ---
const themes = {
  minimal: {
    navbar: 'bg-white shadow-md border-b border-gray-100 dark:bg-gray-900 dark:border-gray-700',
    link: 'text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium',
    font: 'font-sans',
    logout: 'text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300',
  },
  vintage: {
    navbar: 'bg-yellow-100 shadow-xl border-b-4 border-amber-800 dark:bg-gray-800 dark:border-gray-600',
    link: 'text-amber-800 dark:text-amber-300 hover:text-amber-600 dark:hover:text-amber-100 font-serif font-semibold',
    font: 'font-serif',
    logout: 'text-red-700 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200',
  },
};

// --- Navbar Component ---
const Navbar = ({ theme = 'minimal' }) => {
    const firebase = useFirebase();
    const user = firebase.user;
    const navigate = useNavigate();
    const currentTheme = themes[theme] || themes.minimal;
    
    // Dark Mode State Management (Unchanged)
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem('theme') === 'dark' || 
               (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    });

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);

    const toggleDarkMode = () => {
        setDarkMode(prev => !prev);
    };

    const handleLogOut = (e) => {
        e.preventDefault();
        const auth = getAuth();
        signOut(auth)
            .then(() => {
                navigate('/login');
            })
            .catch(error => console.error("Logout failed:", error));
    };

    return (
        <nav id="navbar-main" className={`h-16 p-4 ${currentTheme.navbar} ${currentTheme.font} transition-all duration-500 sticky top-0 z-50`}>
            <div className="container mx-auto flex justify-between items-center h-full"> 
                
                {/* Brand/Logo (Left Side) */}
                <Link to='/' className={`text-2xl font-bold ${currentTheme.link} transition-colors duration-300`}>
                    {theme === 'vintage' ? 'The Old Library' : 'BookMart'}
                </Link>

                {/* --- Navigation Links --- */}
                {/* - Default (mobile/small): flex-col (vertical stack) 
                  - sm:flex-row: Switch to horizontal layout on screens size 'sm' and up
                  - space-y-2: Add vertical spacing on mobile
                  - sm:space-x-6: Add horizontal spacing on desktop
                  - absolute/inset/p-4: To make the menu overlay the content when vertical
                */}
                <ul className="absolute sm:static top-16 right-0 w-full sm:w-auto p-4 sm:p-0 bg-white dark:bg-gray-900 sm:bg-transparent sm:dark:bg-transparent shadow-lg sm:shadow-none 
                               flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-6">
                    
                    {/* Home Link */}
                    <li> 
                        <Link to='/' className={`block text-base hover:opacity-80 transition duration-300 ${currentTheme.link}`}>Home</Link>
                    </li>
                    
                    {/* Admin Links */}
                    {user?.email === "admin@gmail.com" && (
                        <>
                            <li>
                                <Link to='/adminpage' className={`block text-base hover:opacity-80 transition duration-300 ${currentTheme.link}`}>Add Books</Link>
                            </li>
                            <li> 
                                <Link to='/allbooklist' className={`block text-base hover:opacity-80 transition duration-300 ${currentTheme.link}`}>Book List</Link>
                            </li>
                        </>
                    )}
                    
                    {/* User Links */}
                    <li>
                        <Link to='/cart' className={`block text-base hover:opacity-80 transition duration-300 ${currentTheme.link}`}>Cart</Link>
                    </li>
                    <li>
                        <Link to='/orders' className={`block text-base hover:opacity-80 transition duration-300 ${currentTheme.link}`}>Orders</Link>
                    </li>

                    {/* Logout Button */}
                    <li>
                        <button 
                            onClick={handleLogOut} 
                            className={`block text-left text-base font-medium transition duration-300 ${currentTheme.logout}`}
                        >
                            Logout
                        </button>
                    </li>
                    
                    {/* Dark Mode Toggle */}
                    <li className="sm:pl-4">
                        <DarkModeToggle isDark={darkMode} onToggle={toggleDarkMode} />
                    </li>
                </ul>
            </div>
        </nav>
    )
}

export default Navbar;
