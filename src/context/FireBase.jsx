import {createContext, useContext,useState,useEffect} from 'react';
import {initializeApp} from 'firebase/app';
import {updateDoc,deleteDoc, getFirestore,collection,query,where,addDoc,doc,getDocs,getDoc} from 'firebase/firestore'
import {onAuthStateChanged,GoogleAuthProvider,signInWithPopup,getAuth, createUserWithEmailAndPassword,signInWithEmailAndPassword} from 'firebase/auth';
const FirebaseContext = createContext(null)


const firebaseConfig = {
  apiKey: "AIzaSyBcTPQeqsnRQXA0b9CpFbqKK-ALkCvU-04",
  authDomain: "online-bookstore-dc026.firebaseapp.com",
  projectId: "online-bookstore-dc026",
  storageBucket: "online-bookstore-dc026.firebasestorage.app",
  messagingSenderId: "107393603757",
  appId: "1:107393603757:web:d6f7f22d06ad7504e98e24"
};

export const useFirebase = ()=>useContext(FirebaseContext)

const firebaseApp = initializeApp(firebaseConfig)

const firebaseAuth = getAuth(firebaseApp)
const googleProvider = new GoogleAuthProvider()
const fireStore = getFirestore(firebaseApp)

export const FirebaseProvider =(props)=>{
const [user,setUser] = useState(null)
const [isLoading,setIsLoading] = useState(true)

useEffect(()=>{
	onAuthStateChanged(firebaseAuth,user=>{
		if(user){
		setUser(user)
		setIsLoading(false)
			
		} 
		else setUser(null)
	})
},[])

const handleNewBook =async (bookName,bookAuthor,bookPrice,bookGenre,bookImage)=>{
	return await addDoc(collection(fireStore,'books'),{
		bookName,
		bookAuthor,
		bookPrice,
		bookGenre,
	//	bookImage:bookImage.name
	})
}
const newGenre = async(bookGenre)=>{
	
	return await addDoc(collection(fireStore,'bookGenre'),{
		genre:bookGenre
	})
}


const booksByGenre= async(reqGenre)=>{
	let genre = query(collection(fireStore,"bookGenre"),where("genre","==",reqGenre))
	return await getDocs(genre)

	
}
const allGenre = async()=>{
	return await getDocs(collection(fireStore,"bookGenre"))
}
const allBooks = async (genre)=>{
	return await getDocs(query(collection(fireStore,"books"),where("bookGenre","==",genre)))
}
const allBooksList = async ()=>{
    return await getDocs(collection(fireStore,"books"))
}
const singleBookById = async(id)=>{
	return await getDoc(doc(fireStore,'books',id))
}
const deleteBookById =async (id)=>{
	return await deleteDoc(doc(fireStore,"books",id))
}
const updateBookById =async (id,name,author,price,genre)=>{
	return await updateDoc(doc(fireStore,"books",id),{
		bookName:name,
		bookAuthor:author,
		bookPrice:price,
		bookGenre:genre
	})
}
const addOrder =async (userId,bookId,quantity,timeStamp)=>{
	return await addDoc(collection(fireStore,"orders"),{
	userId,
	bookId,
	quantity,
	timeStamp
		
	})
}
const getOrders =async (id)=>{

	return await getDocs(query(collection(fireStore,'orders'),where("userId","==",id)))
	 
	
}
const addItemToCart =async (userId,bookId,quantity)=>{
	return await addDoc(collection(fireStore,"carts"),{
		userId,
		bookId,
		quantity
	})
	
}
const getCartItems = async (id)=>{
	return await getDocs(query(collection(fireStore,"carts"),where("userId","==",id)))
}
const deleteCartItems =async (id)=>{
    return await deleteDoc(doc(fireStore,"carts",id))
}
const signup=(email,password)=>
	createUserWithEmailAndPassword(firebaseAuth,email,password)

const login =(email,password)=>
	signInWithEmailAndPassword(firebaseAuth,email,password)
const isLoggedIn = user ?  true:false

const loginWithGoogle = ()=>signInWithPopup(firebaseAuth,googleProvider)
	return(
		<FirebaseContext.Provider value={{deleteCartItems,getCartItems, addItemToCart, getOrders,addOrder,updateBookById, deleteBookById, allBooksList, user,singleBookById, allGenre,booksByGenre,newGenre,allBooks,handleNewBook, isLoggedIn, loginWithGoogle, signup,login}}>
			{props.children}	
		</FirebaseContext.Provider>
		
	)
}

