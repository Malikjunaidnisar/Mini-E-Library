import { useEffect, useState } from 'react';
import { useFirebase } from '../context/FireBase.jsx';
import { useNavigate } from 'react-router';

// Helper component for the message banner (reused from previous components)
const AlertMessage = ({ message, type, onDismiss }) => {
    if (!message) return null;

    const baseClasses = "p-4 text-sm font-medium rounded-lg flex justify-between items-center mb-6";
    const typeClasses = {
        error: "text-red-800 bg-red-100 border border-red-300",
        success: "text-green-800 bg-green-100 border border-green-300",
    };

    return (
        <div className={`${baseClasses} ${typeClasses[type] || typeClasses.error}`} role="alert">
            <p>{message}</p>
            <button 
                onClick={onDismiss} 
                className={`ml-4 text-${type === 'success' ? 'green' : 'red'}-600 hover:text-${type === 'success' ? 'green' : 'red'}-800 font-bold text-lg`}
                aria-label="Dismiss alert"
            >
                &times;
            </button>
        </div>
    );
};

const AllBookList = () => {
    const firebase = useFirebase();
    const navigate = useNavigate();
    const [books, setBooks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    
    // State to force re-fetching after a deletion or update
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // --- Fetch All Books ---
    useEffect(() => {
        setIsLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        firebase.allBooksList()
            .then(book => setBooks(book.docs))
            .catch(err => setErrorMessage(err.message || "Failed to fetch book list."))
            .finally(() => setIsLoading(false));

    // Dependency array fixed: Removed [books] to prevent infinite loop. 
    // We now use [refreshTrigger] to manually re-fetch data.
    }, [firebase, refreshTrigger]); 

    // --- Handlers ---
    
    const handleDeleteBook = async (id, bookName) => {
        setErrorMessage('');
        setSuccessMessage('');
        
        // Simple confirmation before deleting
        if (!window.confirm(`Are you sure you want to delete "${bookName}"? This action cannot be undone.`)) {
            return;
        }

        try {
            await firebase.deleteBookById(id);
            
            // 1. Trigger a state change to re-run the useEffect and re-fetch the list
            setRefreshTrigger(prev => prev + 1); 
            
            setSuccessMessage(`Book "${bookName}" deleted successfully!`);
        }
        catch (err) {
            setErrorMessage(err.message || "Failed to delete book.");
        }
    };

    const handleUpdateBook = (id) => {
        navigate(`/update/${id}`);
    };

    // --- Loading and Empty State ---
    
    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <div className="text-xl font-medium text-gray-700 animate-spin border-4 border-indigo-500 border-t-transparent rounded-full h-12 w-12"></div>
                <p className="ml-4 text-gray-700">Loading book inventory...</p>
            </div>
        );
    }
    
    if (books.length === 0 && !errorMessage) {
         return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
                <div className="text-center p-8 bg-white shadow-lg rounded-xl">
                    <h2 className="text-2xl font-bold text-gray-700 mb-4">Inventory Empty</h2>
                    <p className="text-gray-500 mb-6">There are no books in the system. Use the admin panel to add new titles!</p>
                    <button 
                        onClick={() => navigate('/admin/add-book')} // Assuming an admin route
                        className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition duration-150"
                    >
                        Add New Book
                    </button>
                </div>
            </div>
        );
    }

    // --- Main Render ---
    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-10">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-8 border-b pb-4">
                    Book Inventory ({books.length})
                </h1>

                {/* Message Banners */}
                <AlertMessage message={errorMessage} type="error" onDismiss={() => setErrorMessage('')} />
                <AlertMessage message={successMessage} type="success" onDismiss={() => setSuccessMessage('')} />

                {/* Responsive Grid of Books */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {books.map((bookDoc) => {
                        const book = bookDoc.data();
                        const bookId = bookDoc.id;
                        
                        return (
                            <div key={bookId} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 flex flex-col overflow-hidden">
                                
                                {/* Image Placeholder/Display */}
                                <div className="h-48 bg-gray-200 flex items-center justify-center">
                                    {book.bookImage ? (
                                        <img 
                                            src={book.bookImage} 
                                            alt={book.bookName} 
                                            className="h-full w-full object-cover" 
                                        />
                                    ) : (
                                        <span className="text-gray-500 text-sm">No Image</span>
                                    )}
                                </div>
                                
                                {/* Details */}
                                <div className="p-4 flex-1">
                                    <h2 className="text-xl font-bold text-gray-900 truncate mb-1">
                                        {book.bookName}
                                    </h2>
                                    <p className="text-sm text-indigo-600 font-medium">
                                        by {book.bookAuthor}
                                    </p>
                                    
                                    <p className="text-2xl font-extrabold text-green-600 mt-3">
                                        {parseFloat(book.bookPrice || 0).toFixed(2)}
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className="flex border-t border-gray-200">
                                    <button 
                                        onClick={() => handleUpdateBook(bookId)}
                                        className="flex-1 py-3 text-white font-semibold bg-indigo-600 hover:bg-indigo-700 transition duration-150 text-sm"
                                    >
                                        Update
                                    </button>
                                    <button 
                                        onClick={() => handleDeleteBook(bookId, book.bookName)}
                                        className="flex-1 py-3 text-white font-semibold bg-red-600 hover:bg-red-700 transition duration-150 text-sm"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default AllBookList;
