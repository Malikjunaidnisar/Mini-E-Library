import { useFirebase } from '../context/FireBase.jsx'
import { useEffect, useState } from 'react'
import { Link } from 'react-router' // Using 'react-router-dom'

const Home = () => {
    const firebase = useFirebase()
    const [books, setBooks] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true);
        firebase.allGenre()
            .then(snapshot => {
                setBooks(snapshot.docs);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching genres:", err);
                // Replaced alert with console error and fallback message
                setLoading(false); 
            })
    }, [])

    if (loading) {
        return (
            <div className="container mx-auto p-8 text-center min-h-screen">
                <p className="text-xl text-gray-600 dark:text-gray-400">Loading genre categories...</p>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mt-4"></div>
            </div>
        )
    }

    if (!books.length) {
        return (
            <div className="container mx-auto p-8 text-center min-h-screen">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                    No Genres Available
                </h1>
                <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                    It looks like the bookstore database is empty.
                </p>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-4 md:p-8 min-h-screen">
            <h1 className="text-4xl font-extrabold text-center mb-10 text-gray-900 dark:text-white">
                Explore Book Genres
            </h1>

            {/* Responsive Grid Layout for Genres */}
            <div
                className="grid gap-6 
                           grid-cols-2          /* 2 columns on mobile */
                           sm:grid-cols-3       /* 3 columns on small screens */
                           md:grid-cols-4       /* 4 columns on medium screens */
                           lg:grid-cols-5       /* 5 columns on large screens */"
            >
                {books.map((book) => {
                    const genre = book.data().genre;
                    const cleanGenre = genre.charAt(0).toUpperCase() + genre.slice(1);
                    return (
                        <Link 
                            key={book.id}
                            to={`/book/${genre}`} 
                            // Style the link as an interactive, clean card
                            className="flex items-center justify-center 
                                       h-32 p-4 
                                       bg-white dark:bg-gray-800 
                                       rounded-xl shadow-lg 
                                       hover:bg-blue-50 hover:dark:bg-gray-700 
                                       transform hover:scale-105 
                                       transition duration-300 ease-in-out 
                                       text-center cursor-pointer 
                                       border-b-4 border-blue-400 dark:border-blue-600"
                        >
                            <li className="list-none text-xl font-semibold text-gray-800 dark:text-gray-100">
                                {cleanGenre}
                            </li>
                        </Link>
                    );
                })}
            </div>
        </div>
    )
}

export default Home
