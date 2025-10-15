import { useEffect, useState } from 'react';
import { useFirebase } from '../context/FireBase.jsx';
import { useNavigate } from 'react-router'; // Added navigate for potential future use or consistency

// Helper component for the message banner
const AlertMessage = ({ message, type, onDismiss }) => {
    if (!message) return null;

    const baseClasses = "p-4 text-sm font-medium rounded-lg flex justify-between items-center mb-6";
    const typeClasses = {
        error: "text-red-800 bg-red-100 border border-red-300",
        success: "text-green-800 bg-green-100 border border-green-300",
        info: "text-blue-800 bg-blue-100 border border-blue-300",
    };

    return (
        <div className={`${baseClasses} ${typeClasses[type] || typeClasses.info}`} role="alert">
            <p>{message}</p>
            <button 
                onClick={onDismiss} 
                className={`ml-4 text-${type}-600 hover:text-${type}-800 font-bold text-lg`}
                aria-label="Dismiss alert"
            >
                &times;
            </button>
        </div>
    );
};

const Orders = () => {
    const firebase = useFirebase();
    const navigate = useNavigate(); // Added for consistency
    let id = firebase.user?.uid || null;

    const [userOrder, setUserOrder] = useState([]);
    const [bookDetail, setBookDetail] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    // --- 1. Fetch Order Items ---
    useEffect(() => {
        setErrorMessage('');
        if (!id) {
            setIsLoading(false);
            setErrorMessage("User not logged in or ID is unavailable.");
            return;
        }

        setIsLoading(true);
        firebase.getOrders(id)
            .then(data => setUserOrder(data.docs))
            .catch(err => setErrorMessage(err.message || "Failed to fetch orders."))
            .finally(() => setIsLoading(false));
    }, [firebase, id]);

    // --- 2. Fetch Book Details for Orders (Improved Logic) ---
    useEffect(() => {
        if (userOrder.length === 0) {
            setBookDetail([]);
            return;
        }

        setErrorMessage(''); // Clear previous errors related to this fetch

        const bookDetailPromises = userOrder.map(orderItem => {
            const bookId = orderItem.data().bookId;
            return firebase.singleBookById(bookId);
        });

        Promise.all(bookDetailPromises)
            .then(bookDocs => {
                // We trust the order of bookDocs matches userOrder array based on your logic,
                // but we map them to an array of objects to be robust.
                const finalBookDetails = bookDocs.map(doc => ({
                    ...doc.data(),
                    id: doc.id,
                }));
                setBookDetail(finalBookDetails);
            })
            .catch(err => {
                console.error("Error fetching book details:", err.message);
                setErrorMessage("Some book details failed to load. Please try again.");
            });

    }, [userOrder, firebase]);

    // --- Loading and Empty States ---

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <div className="text-xl font-medium text-gray-700 animate-spin border-4 border-indigo-500 border-t-transparent rounded-full h-12 w-12"></div>
                <p className="ml-4 text-gray-700">Loading your orders...</p>
            </div>
        );
    }

    if (userOrder.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
                <div className="text-center p-8 bg-white shadow-lg rounded-xl">
                    <h2 className="text-2xl font-bold text-gray-700 mb-4">No Orders Found</h2>
                    <p className="text-gray-500 mb-6">You haven't placed any orders yet. Let's start shopping!</p>
                    <button 
                        onClick={() => navigate('/')} 
                        className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition duration-150"
                    >
                        Go to Shop
                    </button>
                </div>
            </div>
        );
    }
    
    // --- Main Render ---

    // The order data structure combines order details (from userOrder) and book details (from bookDetail)
    const combinedOrders = userOrder.map((orderDoc, i) => {
        const orderData = orderDoc.data();
        const bookData = bookDetail[i]; // Relying on index match
        
        // Ensure both data sources are available before proceeding with calculation
        const price = parseFloat(bookData?.bookPrice || 0);
        const quantity = orderData.quantity || 1;
        const total = price * quantity;
        
        return {
            orderId: orderDoc.id,
            book: bookData,
            quantity,
            total,
            timestamp: orderData.timeStamp, // Assuming you store a timestamp
        };
    }).filter(item => item.book); // Filter out any orders where the book details failed to load

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-10">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-8 border-b pb-4">
                    Your Order History
                </h1>

                {/* Message Banner */}
                <AlertMessage 
                    message={errorMessage} 
                    type="error" 
                    onDismiss={() => setErrorMessage('')} 
                />

                <div className="space-y-6">
                    {combinedOrders.map((order, i) => (
                        <div key={order.orderId} className="bg-white p-5 rounded-xl shadow-lg border-l-4 border-indigo-500">
                            <header className="flex justify-between items-start border-b pb-3 mb-3">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Order ID: <span className="text-gray-700">{order.orderId.substring(0, 10)}...</span></p>
                                    <p className="text-sm font-medium text-gray-500">Ordered at: {order.timestamp || 'N/A'}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-base font-semibold text-gray-700">Total Paid</p>
                                    <p className="text-2xl font-extrabold text-green-600">{order.total.toFixed(2)}</p>
                                </div>
                            </header>

                            <div className="flex items-center space-x-4">
                                {/* Book Details */}
                                <div className="flex-1 min-w-0">
                                    <h2 className="text-lg font-bold text-gray-900 truncate">{order.book.bookName}</h2>
                                    <p className="text-sm text-gray-500">by {order.book.bookAuthor}</p>
                                </div>

                                {/* Price and Quantity */}
                                <div className="text-right flex-shrink-0">
                                    <p className="text-sm font-medium text-gray-600">Unit Price: <span className="font-semibold">{parseFloat(order.book.bookPrice).toFixed(2)}</span></p>
                                    <p className="text-sm font-medium text-gray-600">Quantity: <span className="font-semibold text-indigo-600">{order.quantity}</span></p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Orders;
