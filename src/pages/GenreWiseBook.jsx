import { useFirebase } from '../context/FireBase.jsx'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router' // Using react-router-dom
import CardBook from '../components/CardBook.jsx'

const GenreWiseBook = () => {
    const firebase = useFirebase()
    const { genre } = useParams()

    const [books, setBooks] = useState([])
    const [loading, setLoading] = useState(true) // Added loading state

    useEffect(() => {
        setLoading(true);
        // Use a descriptive, capitalized title for the page
        document.title = `${genre.charAt(0).toUpperCase() + genre.slice(1)} Books | Bookstore`; 

        firebase.allBooks(genre)
            .then(book => {
                setBooks(book.docs)
                setLoading(false)
            })
            .catch(err => {
                console.error("Error fetching books:", err);
                alert("Failed to load books. Please try again.");
                setLoading(false);
            })
    }, [genre]) // Added 'genre' to dependency array for correct re-fetch if route changes

    // --- Loading and Error States ---
    if (loading) {
        return (
            <div className="container mx-auto p-8 text-center">
                <p className="text-xl text-gray-600 dark:text-gray-400">
                    Loading books in the **{genre.toUpperCase()}** genre...
                </p>
                {/* Simple Spinner Placeholder */}
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mt-4"></div>
            </div>
        )
    }

    if (!books.length) {
        return (
            <div className="container mx-auto p-8 text-center bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                    No Books Found
                </h1>
                <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                    We couldn't find any books in the **{genre.charAt(0).toUpperCase() + genre.slice(1)}** category.
                </p>
            </div>
        )
    }

    // --- Main Content: Responsive Grid ---
    return (
        <div className="container mx-auto p-4 md:p-8">
            <h1 className="text-3xl font-extrabold mb-8 text-gray-900 dark:text-white border-b-2 border-blue-600 pb-2">
                Books in: {genre.charAt(0).toUpperCase() + genre.slice(1)}
            </h1>

            <div 
                className="grid gap-6 
                           grid-cols-1          /* Default: 1 column on small screens */
                           sm:grid-cols-2       /* Small screens (sm): 2 columns */
                           lg:grid-cols-3       /* Large screens (lg): 3 columns */
                           xl:grid-cols-4       /* Extra Large screens (xl): 4 columns for max appeal */"
            >
                {/* Mapping Books to CardBook Components */}
                {books.map((book) => (
                    <CardBook key={book.id} id={book.id} {...book.data()} />
                ))}
            </div>
        </div>
    )
}

export default GenreWiseBook
