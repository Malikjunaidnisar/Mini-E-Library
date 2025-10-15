import { useFirebase } from '../context/FireBase.jsx'
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router'

const DetailPage = () => {
    const firebase = useFirebase()
    const navigate = useNavigate()
    const { name, id } = useParams()
    const user = firebase.user

    const [singleBook, setSingleBook] = useState(null)
    const [message, setMessage] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true);
        firebase.singleBookById(id)
            .then(book => {
                if (book.exists()) {
                    setSingleBook(book.data());
                } else {
                    setMessage({ type: 'error', text: "Book not found." });
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching book:", err.message);
                setMessage({ type: 'error', text: "Failed to load book details." });
                setLoading(false);
            })
    }, [id])

    const handleCart = async () => {
        if (!user) {
            setMessage({ type: 'error', text: "Please log in to add items to your cart." });
            return;
        }
        setMessage(null);
        try {
            const res = await firebase.addItemToCart(user.uid, id, 1)
            setMessage({ type: 'success', text: "Successfully added to cart!" })
        }
        catch (err) {
            console.error("Cart error:", err.message);
            setMessage({ type: 'error', text: err.message || "Failed to add to cart." })
        }
    }

    const handleBuy = (bookId) => {
        navigate(`/buybook/${bookId}`)
    }
    
    // --- Loading State ---
    if (loading) {
        return (
            <div className="container mx-auto p-8 text-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mt-20"></div>
                <p className="text-xl text-gray-600 dark:text-gray-400 mt-4">Loading book details...</p>
            </div>
        );
    }

    // --- Book Not Found / Error State ---
    if (!singleBook && message?.type === 'error') {
        return (
            <div className="container mx-auto p-8 text-center min-h-screen">
                <h1 className="text-3xl font-bold text-red-600 dark:text-red-400 mt-20">{message.text}</h1>
            </div>
        );
    }
    
    if (!singleBook) return null; // Fallback for an empty book object


    // --- Main Detail View ---
    return (
        <div className="container mx-auto p-4 md:p-10 min-h-screen">

            {message && (
                <div 
                    className={`mb-6 p-3 rounded-lg text-sm font-medium ${
                        message.type === 'error' ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200' :
                        'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'
                    }`}
                    role="alert"
                >
                    {message.text}
                </div>
            )}

            <div className="bg-white dark:bg-gray-800 p-6 sm:p-10 rounded-xl shadow-2xl 
                            grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 
                            border border-gray-100 dark:border-gray-700">
                
                {/* 1. Book Image/Cover (1/3 width on desktop) */}
                <div className="md:col-span-1 flex justify-center">
                    {/* Replaced mock with img tag */}
                    <img 
                        src={singleBook.bookImage || 'https://via.placeholder.com/256x320?text=No+Cover'} // Fallback placeholder
                        alt={`Cover of ${singleBook.bookName}`}
                        className="w-64 h-80 object-cover rounded-lg shadow-lg 
                                   border border-gray-200 dark:border-gray-700" 
                    />
                </div>

                {/* 2. Book Info (2/3 width on desktop) */}
                <div className="md:col-span-2 space-y-6">
                    
                    {/* Title and Author */}
                    <div className="border-b pb-4 border-gray-200 dark:border-gray-700">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight">
                            {singleBook.bookName}
                        </h1>
                        <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mt-2">
                            By: {singleBook.bookAuthor}
                        </h3>
                    </div>

                    {/* Price and Genre */}
                    <div className="space-y-3">
                        <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                            Price: {singleBook.bookPrice || 'N/A'}
                        </p>
                        <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                            <span className="font-semibold">Genre:</span> 
                            <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full dark:bg-blue-900 dark:text-blue-200">
                                {singleBook.bookGenre}
                            </span>
                        </p>
                    </div>

                    {/* Action Block */}
                    <div className="pt-4 space-y-4">
                        
                        {/* Quantity Label */}
                        <div>
                            <label className="block text-lg font-medium text-gray-700 dark:text-gray-300">
                                Quantity: 1
                            </label>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            
                            {/* Add To Cart Button */}
                            <button 
                                onClick={handleCart}
                                className="w-full sm:w-auto px-6 py-3 
                                           bg-green-600 hover:bg-green-700 
                                           text-white text-lg font-bold 
                                           rounded-lg shadow-md 
                                           transition duration-200 ease-in-out 
                                           focus:outline-none focus:ring-4 focus:ring-green-300 dark:focus:ring-green-800"
                            >
                                Add To Cart
                            </button>

                            {/* Buy Now Button */}
                            <button 
                                onClick={() => handleBuy(id)}
                                className="w-full sm:w-auto px-6 py-3 
                                           bg-blue-600 hover:bg-blue-700 
                                           text-white text-lg font-bold 
                                           rounded-lg shadow-md 
                                           transition duration-200 ease-in-out 
                                           focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
                            >
                                Buy Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DetailPage
