import { useState } from 'react';
import { useFirebase } from '../context/FireBase.jsx';
import { useNavigate } from 'react-router';
import { Uploader } from 'uploader';
import { UploadDropzone } from 'react-uploader';

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

const uploader = Uploader({
  apiKey: "public_kW2K8bpEsqn9M2xQPBKBqvsNj8zL" // <--- Your API Key
});

const uploadOptions = {
  multi: true, // Allow multiple file uploads
  maxFileCount: 1,
  mimeTypes: ["image/jpeg", "image/png"],
  styles: {
    colors: {
        primary: "#4f46e5", // Indigo for primary color
    },
    // Customize the dropzone height for a better look
    fontSizes: {
        base: 16,
    }
  },
};

const AdminBookList =()=>{
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [bookImage,setBookImage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const firebase = useFirebase();
    const navigate = useNavigate();
    const [bookInfo,setBookInfo] = useState({
        bookName:"",
        bookAuthor:"",
        bookPrice:"",
        bookGenre:""
    });

    const handleBookInfo = (e)=>{
        setBookInfo((prev)=>(
            {...prev,[e.target.name]:e.target.value}
        ));
        setErrorMessage("");
        setSuccessMessage("");
    };

    // Function to handle the successful upload result
      const handleUploadComplete = (files) => {
        setIsUploading(false);

        if(files && files.length > 0){
            const imageUrl  = files[0].fileUrl;
            setBookImage(imageUrl);
            setSuccessMessage("Image uploaded successfully! Ready to create book.");
        }
        setUploadedFiles(files);
        console.log("Upload Complete");
      };

    const handleSubmit =async (e)=>{
        e.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");

        if (!bookImage) {
            //return setErrorMessage("Please upload a book cover image.");
            setBookImage(bookInfo.bookName);
        }

        try{
            // 1. Check if genre exists and create it if necessary
            const genre = await firebase.booksByGenre(bookInfo.bookGenre);
            if(!genre.size){
                await firebase.newGenre(bookInfo.bookGenre);
            }

            // 2. Add the new book
            await firebase.handleNewBook(
                bookInfo.bookName,
                bookInfo.bookAuthor,
                bookInfo.bookPrice,
                bookInfo.bookGenre,
                bookImage
            );

            // 3. Clear the form and display success
            setBookInfo({
                bookName:"",
                bookAuthor:"",
                bookPrice:"",
                bookGenre:"",
            });
            setBookImage(""); // Also clear the image preview
            setUploadedFiles([]);
            setSuccessMessage(`Successfully created book: ${bookInfo.bookName}`);
        }
        catch(err){
            setErrorMessage(err.message || "Failed to create book. Please try again.");
        }
    }
    
    // --- Render ---

    return(
        <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-10 flex justify-center">
            <div className="w-full max-w-4xl bg-white shadow-xl rounded-xl p-6 md:p-10">
                <header className="border-b pb-4 mb-6">
                    <h1 className="text-3xl font-extrabold text-gray-900">Add New Book</h1>
                    <p className="text-gray-500">Enter the details and upload the cover image to add a new title to the inventory.</p>
                </header>

                <AlertMessage 
                    message={errorMessage} 
                    type="error" 
                    onDismiss={() => setErrorMessage("")} 
                />
                <AlertMessage 
                    message={successMessage} 
                    type="success" 
                    onDismiss={() => setSuccessMessage("")} 
                />

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* --- Column 1: Book Details --- */}
                        <div className="space-y-4">
                            
                            {/* Book Name */}
                            <div className="form-group">
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
                            <div className="form-group">
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
                            <div className="form-group">
                                <label htmlFor="bookPrice" className="block text-sm font-medium text-gray-700 mb-1">Book Price </label>
                                <input
                                    id="bookPrice"
                                    name="bookPrice"
                                    onChange={handleBookInfo}
                                    value={bookInfo.bookPrice}
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>

                            {/* Book Genre */}
                            <div className="form-group">
                                <label htmlFor="bookGenre" className="block text-sm font-medium text-gray-700 mb-1">Book Genre (e.g., Fantasy, Sci-Fi)</label>
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
                        </div>

                        {/* --- Column 2: Image Uploader and Preview --- */}
                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Book Cover Image</label>
                            
                            {/* Image Preview */}
                            {bookImage && (
                                <div className="mb-4 flex justify-center bg-gray-200 rounded-lg p-2">
                                    <img 
                                        src={bookImage} 
                                        alt="Book Cover Preview" 
                                        className="max-h-64 w-auto object-contain rounded-md shadow-md"
                                    />
                                </div>
                            )}

                            {/* Upload Dropzone */}
                            <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-1">
                                <UploadDropzone
                                    uploader={uploader}
                                    options={uploadOptions}
                                    onUpdate={files => setUploadedFiles(files)}
                                    onComplete={handleUploadComplete}
                                    width="100%"
                                    height="200px"
                                >
                                    {({ onClick }) => (
                                        <div 
                                            onClick={onClick}
                                            className="flex flex-col items-center justify-center p-4 h-full cursor-pointer hover:bg-gray-50"
                                        >
                                            <svg className="w-8 h-8 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                                            <p className="mt-2 text-sm text-gray-600">Click or Drag Image Here</p>
                                        </div>
                                    )}
                                </UploadDropzone>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4 border-t">
                        <button
                            type='submit'
                            disabled={isUploading}
                            className={`w-full py-3 px-4 rounded-lg text-lg font-semibold text-white transition duration-150 ${
                                (isUploading) 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                            }`}
                        >
                            {isUploading ? 'Uploading...' : 'Create New Book'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AdminBookList
