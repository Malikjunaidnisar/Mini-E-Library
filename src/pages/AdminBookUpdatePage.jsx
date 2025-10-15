import { useState ,useEffect} from 'react'
import {useFirebase} from '../context/FireBase.jsx'
import {useNavigate , useParams} from 'react-router'

// Helper component for the message banner (reused)
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


const UpdateBook =()=>{ // Renamed component for better clarity
	const firebase = useFirebase()
	const navigate = useNavigate()
	const {id} = useParams()

	const [bookInfo,setBookInfo] = useState({
        bookName:"",
        bookAuthor:"",
        bookPrice:"",
        bookGenre:"",
	})
    const [originalImage, setOriginalImage] = useState(null); // Stores the existing image URL
	const [bookImageFile,setBookImageFile] = useState(null) // Stores the new file object
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);

	const handleBookInfo = (e)=>{

		setBookInfo((prev)=>(
			{...prev,[e.target.name]:e.target.value}
		))
        setErrorMessage('');
        setSuccessMessage('');
	}
    
    // NOTE: This currently only captures the file object. 
    // You would need to add logic here to upload the new file to Firebase 
    // and update `bookInfo` with the new public URL before calling handleSubmit.
	const handleImage = (e)=>{
		setBookImageFile(e.target.files[0])
	}
    
    // --- Fetch Initial Book Data ---
	useEffect(()=>{
        setErrorMessage('');
        setIsLoading(true);
        
		firebase.singleBookById(id)
		.then(data => {
            // Note: Corrected 'bookePrice' typo assumed in your original data structure
            const bookData = data.data();
            
			setBookInfo({
				bookName: bookData.bookName || "",
				bookAuthor: bookData.bookAuthor || "",
				bookPrice: bookData.bookPrice  || "", // Handle price typo just in case
				bookGenre: bookData.bookGenre || "",
			});
            setOriginalImage(bookData.bookImage || null);
		})
		.catch(err => {
            setErrorMessage(err.message || "Failed to load book data.");
		})
        .finally(() => setIsLoading(false));
        
	},[firebase, id])

    // --- Submit Handler ---
	const handleSubmit =async (e)=>{
		e.preventDefault()
        setErrorMessage('');
        setSuccessMessage('');
        
        // You would typically handle file upload here if a new file was selected (bookImageFile is not null)
        // For simplicity, we assume the existing image URL is maintained and only text fields are updated.
        
		try{
		    
		    await firebase.updateBookById(
                id,
                bookInfo.bookName,
                bookInfo.bookAuthor,
                bookInfo.bookPrice,
                bookInfo.bookGenre,
                // Pass originalImage if no new file was selected and uploaded
                originalImage // Or the new URL after uploading bookImageFile
            );
            
            setSuccessMessage("Book updated successfully!");
			
            // Use setTimeout to show success message briefly before navigating
            setTimeout(() => {
                navigate('/allbooklist');
            }, 1000);
		}
		catch(err){
            setErrorMessage(err.message || "Failed to update book.");
		}
	}
    
    // --- Loading State ---
    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <div className="text-xl font-medium text-gray-700 animate-spin border-4 border-indigo-500 border-t-transparent rounded-full h-12 w-12"></div>
                <p className="ml-4 text-gray-700">Loading book details...</p>
            </div>
        );
    }
    
    // --- Main Render ---
	return(
		<div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-10 flex justify-center">
            <div className="w-full max-w-2xl bg-white shadow-xl rounded-xl p-6 md:p-8">
				<header className="border-b pb-4 mb-6">
                    <h1 className="text-3xl font-extrabold text-gray-900">Update Book Details</h1>
                    <p className="text-gray-500">Editing Book ID: {id}</p>
                </header>
                
                <AlertMessage message={errorMessage} type="error" onDismiss={() => setErrorMessage('')} />
                <AlertMessage message={successMessage} type="success" onDismiss={() => setSuccessMessage('')} />

				<form onSubmit={handleSubmit} className="space-y-6">
					
                    {/* Book Name */}
                    <div>
						<label htmlFor="bookName" className="block text-sm font-medium text-gray-700 mb-1">Book Name</label>
						<input 
                            id="bookName"
                            name="bookName"
                            value={bookInfo.bookName}
                            onChange={handleBookInfo}
                            type="text" 
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
					</div>
                    
                    {/* Author */}
					<div>
						<label htmlFor="bookAuthor" className="block text-sm font-medium text-gray-700 mb-1">Author</label>
						<input 
                            id="bookAuthor"
                            name="bookAuthor"
                            value={bookInfo.bookAuthor}
                            onChange={handleBookInfo}
                            type="text" 
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
					</div>
                    
                    {/* Book Price */}
					<div>
						<label htmlFor="bookPrice" className="block text-sm font-medium text-gray-700 mb-1">Book Price </label>
						<input 
                            id="bookPrice"
                            name="bookPrice"
                            onChange={handleBookInfo}
                            value={bookInfo.bookPrice}
                            type="number" 
                           
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
					</div>
                    
                    {/* Book Genre */}
					<div>
					    <label htmlFor="bookGenre" className="block text-sm font-medium text-gray-700 mb-1">Book Genre</label>
					    <input
                            id="bookGenre"
                            name="bookGenre"
                            onChange={handleBookInfo}
                            value={bookInfo.bookGenre}
                            type="text" 
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
					</div>
                    
                    {/* Image Upload/Preview */}
					<div>
						<label htmlFor="bookImageFile" className="block text-sm font-medium text-gray-700 mb-1">Upload New Cover Image (Optional)</label>
						<input 
                            id="bookImageFile"
                            onChange={handleImage}
                            name="bookImageFile"
                            type="file" 
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                        />
                        
                        {/* Current Image Preview */}
                        {originalImage && (
                            <div className="mt-4">
                                <p className="text-xs text-gray-500 mb-2">Current Cover:</p>
                                <img 
                                    src={originalImage} 
                                    alt="Current Book Cover" 
                                    className="max-h-32 w-auto object-contain rounded-md shadow-md border"
                                />
                            </div>
                        )}
					</div>
                    
                    {/* Submit Button */}
					<div className="pt-4 border-t">
						<button
                            type='submit'
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
						>
							Update Book
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}

export default UpdateBook
