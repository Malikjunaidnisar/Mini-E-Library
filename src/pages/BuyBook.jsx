import { useState, useEffect } from 'react';
import { useFirebase } from '../context/FireBase.jsx';
import { useParams, useNavigate } from 'react-router';

const BuyBook = () => {
    const firebase = useFirebase();
    const navigate = useNavigate();
    const { id } = useParams();
    const [quantity, setQuantity] = useState(0);
    const [buyBook, setBuyBook] = useState(null); // Initialize to null for better loading checks
    const [errorMessage, setErrorMessage] = useState(''); // State for displaying messages

    // Effect to fetch the book details
    useEffect(() => {
        setErrorMessage(''); // Clear previous messages on load
        firebase.singleBookById(id)
            .then(book => setBuyBook(book.data()))
            .catch(err => {
                // Replaced alert with setting the error message state
                setErrorMessage(err.message || "Failed to load book details.");
            });
    }, [firebase, id]); 

    // Handler to update quantity
    const handleIncrement = (e) => {
        const val = parseInt(e.target.value, 10);
        // Ensure quantity is always 1 or more
        setQuantity(Math.max("", val || ""));
    };

    // Handler to confirm the purchase
    const handleBuyConfirm = async () => {
        setErrorMessage(''); // Clear previous messages

        // Replaced alert with setting the error message state
        if (!buyBook) {
            setErrorMessage("Book details not fully loaded yet. Please wait a moment.");
            return;
        }
        
        try {
            const timeStamp = new Date().toLocaleTimeString('en-US', {
                hour: '2-digit', minute: '2-digit', second: '2-digit'
            });

            // Assuming firebase.user is available
            await firebase.addOrder(firebase.user.uid, id, quantity, timeStamp);
            navigate('/orders');
        } catch (err) {
            // Replaced alert with setting the error message state
            setErrorMessage(err.message || "Order failed. Please try again.");
        }
    };

    // Calculate total price.
    const totalPrice = buyBook ? quantity * parseFloat(buyBook.bookPrice || 0) : 0;

    // Use a simple loading state if buyBook is null
    if (buyBook === null && !errorMessage) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <div className="text-xl font-medium text-gray-700 animate-pulse">Loading book details...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 flex justify-center items-start">
            {/* Main Content Card */}
            <div className="w-full max-w-lg bg-white shadow-xl rounded-xl p-6 md:p-8 mt-10">
                
                {/* --- Error Message Banner --- */}
                {errorMessage && (
                    <div className="mb-4 p-4 text-sm font-medium text-red-800 bg-red-100 border border-red-300 rounded-lg flex justify-between items-center" role="alert">
                        <p>{errorMessage}</p>
                        <button 
                            onClick={() => setErrorMessage('')} 
                            className="ml-4 text-red-600 hover:text-red-800 font-bold text-lg"
                            aria-label="Dismiss alert"
                        >
                            &times;
                        </button>
                    </div>
                )}
                
                {/* Book Details Section */}
                <header className="border-b pb-4 mb-4">
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-1">
                        {buyBook?.bookName}
                    </h1>
                    <p className="text-lg text-indigo-600 font-semibold">
                        by {buyBook?.bookAuthor}
                    </p>
                </header>

                <main className="space-y-4">
                    {/* Price */}
                    <div className="flex justify-between items-center py-2 border-b">
                        <p className="text-gray-600 text-lg font-medium">Unit Price</p>
                        <p className="text-2xl font-bold text-green-600">
                            {parseFloat(buyBook?.bookPrice || 0).toFixed(2)}
                        </p>
                    </div>

                    {/* Quantity Input */}
                    <div className="py-4">
                        <label htmlFor="quantity-input" className="block text-lg font-medium text-gray-700 mb-2">
                            Buy Quantity
                        </label>
                        <input
                            id="quantity-input"
                            type="number"
                            required
                            value={quantity}
                            onChange={handleIncrement}
                            min="1"
                            step="1"
                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-lg"
                        />
                    </div>

                    {/* Total Price */}
                    <div className="pt-4 border-t-2 border-dashed border-gray-200">
                        <p className="text-xl font-semibold text-gray-800 flex justify-between items-center">
                            <span>Total Price</span>
                            <span className="text-3xl font-extrabold text-red-600">
                                {totalPrice.toFixed(2)}
                            </span>
                        </p>
                    </div>
                </main>

                {/* Confirm Button */}
                <div className="mt-8">
                    <button
                        onClick={handleBuyConfirm}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-xl font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                    >
                        Confirm Purchase
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BuyBook;

