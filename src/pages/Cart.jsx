import { useState, useEffect } from 'react';
import { useFirebase } from '../context/FireBase.jsx';
import { useParams, useNavigate } from 'react-router';

// Helper component for the message banner (unchanged)
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

const Cart = () => {
	const [cartItem, setCartItem] = useState([]);
	const firebase = useFirebase();
	const navigate = useNavigate();
	let id = firebase.user?.uid || null; 
	
	const [quantities, setQuantities] = useState({}); 
    
	const [buyBook, setBuyBook] = useState([]); 
	const [cartToOrder, setCartToOrder] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // --- 1. Fetch Cart Items & Initialize Quantities ---
	useEffect(() => {
        if (!id) {
            setIsLoading(false);
            setErrorMessage("User not logged in.");
            return;
        }
        setIsLoading(true);
		firebase.getCartItems(id)
			.then(bookDocs => {
                setCartItem(bookDocs.docs);
                
                // Initialize quantities for all items to 1
                const initialQuantities = bookDocs.docs.reduce((acc, doc) => {
                    acc[doc.id] = 1; // Default to quantity 1
                    return acc;
                }, {});
                setQuantities(initialQuantities);
            })
			.catch(err => setErrorMessage(err.message || "Failed to fetch cart items."))
            .finally(() => setIsLoading(false));
	}, [firebase, id]);

    // --- 2. Fetch Book Details for Cart Items ---
    // (This useEffect will automatically re-run when `cartItem` changes, which is what we want!)
	useEffect(() => {
		if (cartItem.length === 0) {
			setBuyBook([]);
			return;
		}

		const promises = cartItem.map((item) => {
			const bookId = item.data().bookId;
			return firebase.singleBookById(bookId);
		});

		Promise.all(promises)
			.then(data => {
				const books = data.map(book => ({
					...book.data()
				}));
				setBuyBook(books);
			})
			.catch(err => {
				setErrorMessage(err.message || "Failed to fetch book details.");
			});

	}, [cartItem, firebase]);
	
    // --- Handlers ---

	const handleQuantity = (cartId, value) => {
		const val = parseInt(value, 10);
        const newQuantity = Math.max("", val || ""); 
        
		setQuantities(prev => ({
            ...prev,
            [cartId]: newQuantity
        }));
	};

	const handleCheckbox = (e, cart, cartId) => {
        setErrorMessage('');
		if (e.target.checked) {
			const timeStamp = new Date().toLocaleTimeString('en-US', {
				hour: '2-digit', minute: '2-digit', second: '2-digit'
			});
            
			setCartToOrder(prev => [
				...prev,
				{ 
                    ...cart.data(), 
                    id: cartId, 
                    timeStamp,
                    quantity: quantities[cartId] 
                } 
			]);
		} else {
			setCartToOrder(prev => prev.filter(item => item.id !== cartId));
		}
	};
    
	const handleCart = async (userId) => {
        setErrorMessage('');

		if (cartToOrder.length === 0) {
			return setErrorMessage("Please select at least one item to checkout.");
		}
		
		const orderPromises = cartToOrder.map(async (item) => {
			try {
				const timeStamp = new Date().toLocaleTimeString('en-US', {
					hour: '2-digit', minute: '2-digit', second: '2-digit'
				});
                
                const itemQuantity = item.quantity || quantities[item.id] || 1;

				// 1. ADD THE NEW ORDER
				const addOrderPromise = firebase.addOrder(
					userId,
					item.bookId,
					itemQuantity,
					timeStamp
				);

				// 2. DELETE THE CART ITEM
				const deleteOrderPromise = firebase.deleteCartItems(item.id);

				await Promise.all([addOrderPromise, deleteOrderPromise]);
                
				return { success: true, itemId: item.id };

			} catch (err) {
				console.error(`Error processing cart item ${item.id}:`, err);
				return { success: false, itemId: item.id, error: err.message };
			}
		});

        const results = await Promise.all(orderPromises);
        
        const failedOrders = results.filter(r => !r.success);

        if (failedOrders.length > 0) {
            setErrorMessage(`Successfully checked out ${cartToOrder.length - failedOrders.length} item(s), but ${failedOrders.length} failed. Please check the console for details.`);
        } else {
            // Clean state updates instead of full page reload
            setCartItem(prev => prev.filter(doc => !cartToOrder.some(item => item.id === doc.id)));
            setCartToOrder([]);
            // Navigate after state update
            navigate('/orders'); 
        }
	};
    
    /**
     * Deletes the item from Firebase and updates local state for an instant re-render.
     * @param {string} cartId - The ID of the cart item to delete.
     */
	const handleDeleteCartItem = async (cartId) => {
        setErrorMessage('');
        
		try {
            await firebase.deleteCartItems(cartId);
            
            // --- STATE UPDATE FOR INSTANT RE-RENDER ---
            
            // 1. Remove the item from the main cart list
            setCartItem(prev => prev.filter(doc => doc.id !== cartId));

            // 2. Remove the item from the quantities map
            setQuantities(prev => {
                const newQuantities = { ...prev };
                delete newQuantities[cartId];
                return newQuantities;
            });

            // 3. Remove the item from the checkout list if it was selected
            setCartToOrder(prev => prev.filter(item => item.id !== cartId));
            
            // Since `cartItem` updated, the `useEffect` for `buyBook` will automatically refetch book details if needed (though typically not, as we just removed one).
            
		} catch (err) {
            setErrorMessage(err.message || "Failed to delete item. Please try again.");
        }
	};

    // --- Loading and Empty State (unchanged) ---
    
    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <div className="text-xl font-medium text-gray-700 animate-spin border-4 border-indigo-500 border-t-transparent rounded-full h-12 w-12"></div>
                <p className="ml-4 text-gray-700">Loading your cart...</p>
            </div>
        );
    }

    if (cartItem.length === 0 && !errorMessage) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
                <div className="text-center p-8 bg-white shadow-lg rounded-xl">
                    <h2 className="text-2xl font-bold text-gray-700 mb-4">Your Cart is Empty</h2>
                    <p className="text-gray-500 mb-6">Start exploring our collection to find your next favorite book!</p>
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
    
    // --- Main Render (unchanged) ---
	return (
		<div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-10">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-8 border-b pb-4">
                    Your Shopping Cart
                </h1>

                {/* Message Banner */}
                <AlertMessage 
                    message={errorMessage} 
                    type="error" 
                    onDismiss={() => setErrorMessage('')} 
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items List (2/3 width on large screens) */}
                    <div className="lg:col-span-2 space-y-4">
                        {cartItem.map((cart, i) => {
                            const book = buyBook[i];
                            const cartId = cart.id;
                            const currentQuantity = quantities[cartId] || 0; 
                            const isSelected = cartToOrder.some(item => item.id === cartId);
                            
                            if (!book) return null;

                            return (
                                <div key={cartId} className={`flex flex-col sm:flex-row bg-white p-4 rounded-xl shadow-md transition duration-200 border-2 ${isSelected ? 'border-indigo-500' : 'border-gray-200 hover:shadow-lg'}`}>
                                    
                                    {/* Checkbox and Details */}
                                    <label htmlFor={`checkbox-${cartId}`} className="flex-1 flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            id={`checkbox-${cartId}`}
                                            checked={isSelected}
                                            onChange={(e) => handleCheckbox(e, cart, cartId)}
                                            className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                        />
                                        
                                        <div className="ml-4 flex-1">
                                            <p className="text-lg font-semibold text-gray-900">{book.bookName}</p>
                                            <p className="text-sm text-gray-500">by {book.bookAuthor}</p>
                                            <p className="text-base font-medium text-green-600 mt-1">{parseFloat(book.bookPrice || 0).toFixed(2)}</p>
                                        </div>
                                    </label>
                                    
                                    {/* Quantity and Total */}
                                    <div className="flex items-center space-x-4 mt-3 sm:mt-0 sm:ml-4">
                                        <div className="flex flex-col items-center">
                                            <label htmlFor={`quant-${cartId}`} className="text-xs font-medium text-gray-500">Qty</label>
                                            <input 
                                                type="number" 
                                                onChange={(e) => handleQuantity(cartId, e.target.value)} 
                                                id={`quant-${cartId}`}
                                                value={currentQuantity}
                                                min="0"
                                                className="w-16 text-center border border-gray-300 rounded-lg p-1 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                            />
                                        </div>
                                        
                                        <div className="text-right">
                                            <p className="text-xs font-medium text-gray-500">Total</p>
                                            <p className="text-lg font-bold text-gray-800">{(currentQuantity * parseFloat(book.bookPrice || 0)).toFixed(2)}</p>
                                        </div>
                                        
                                        <button 
                                            onClick={() => handleDeleteCartItem(cartId)}
                                            className="p-2 text-red-500 hover:text-red-700 transition duration-150"
                                            aria-label={`Delete ${book.bookName}`}
                                        >
                                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Checkout Summary */}
                    <div className="lg:col-span-1 h-fit sticky top-10">
                        <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-indigo-600">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Summary</h2>
                            
                            <div className="space-y-2 text-gray-600">
                                <p className="flex justify-between">
                                    <span>Items Selected:</span>
                                    <span className="font-semibold text-gray-800">{cartToOrder.length}</span>
                                </p>
                                <p className="flex justify-between">
                                    <span>Total Items in Cart:</span>
                                    <span className="font-semibold text-gray-800">{cartItem.length}</span>
                                </p>
                            </div>

                            <div className="border-t pt-4 mt-4">
                                <p className="flex justify-between text-xl font-bold text-gray-900">
                                    <span>Selected Total:</span>
                                    <span className="text-indigo-600">
                                        {cartToOrder.reduce((acc, item) => {
                                            const bookIndex = cartItem.findIndex(c => c.id === item.id);
                                            const price = parseFloat(buyBook[bookIndex]?.bookPrice || 0);
                                            const itemQuantity = quantities[item.id] || 1;
                                            return acc + (price * itemQuantity);
                                        }, 0).toFixed(2)}
                                    </span>
                                </p>
                            </div>
                            
                            <button 
                                type='button' 
                                onClick={() => handleCart(id)}
                                disabled={cartToOrder.length === 0}
                                className={`w-full mt-6 py-3 px-4 rounded-lg text-lg font-semibold text-white transition duration-150 ${cartToOrder.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'}`}
                            >
                                Checkout Selected ({cartToOrder.length})
                            </button>
                        </div>
                    </div>
                </div>
            </div>
		</div>
	);
}

export default Cart;
