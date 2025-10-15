import { Link } from 'react-router'; // Assuming you use 'react-router'

const CardBook = (props) => {
    return (
        // Wrapper for the Card Link: Block-level link, styled as a card.
        <Link 
            to={`/book/${props.bookName}/${props.id}`}
            // Tailwind Classes for Card styling
            className="block 
                       w-full sm:w-64 md:w-72 
                       mx-auto my-4 
                       bg-white dark:bg-gray-800 
                       rounded-xl shadow-lg hover:shadow-2xl 
                       transform hover:-translate-y-1 
                       transition duration-300 ease-in-out 
                       border border-gray-100 dark:border-gray-700"
        >
            {/* Inner div for padding and content layout */}
            <div className="p-6 flex flex-col items-start space-y-2">
                
                {/* Book Name (Title) */}
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 truncate w-full">
                    {props.bookName}
                </h1>
                
                {/* Book Author (Subtitle/Author) */}
                <h1 className="text-sm font-medium text-gray-600 dark:text-gray-400 truncate w-full">
                    By: {props.bookAuthor}
                </h1>
                
                {/* Empty h1 (Maintained structure) */}
                <h1>
                    {/* Placeholder for Price/Rating/Image, etc. */}
                </h1>
                
                {/* View Button */}
                <button
                    className="mt-3 px-4 py-2 
                               bg-blue-600 hover:bg-blue-700 
                               text-white text-sm font-semibold 
                               rounded-lg shadow-md 
                               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
                >
                    View
                </button>
            </div>
        </Link>
    )
}

export default CardBook
