import {useState,useEffect} from 'react'
import {useFirebase} from '../context/FireBase.jsx'
import {useParams,useNavigate} from 'react-router'

const Cart =()=>{
/*	const firebase = useFirebase()
	const navigate= useNavigate()
	let id = firebase.user
	const [quantity,setQuantity] =useState(1)
	const [cartItem,setCartItem] = useState([])
	const [buyBook,setBuyBook] =useState([]) 
	let dummyBook =[]
	let  bookId = []
	const [cartToOrder,setCartToOrder] = useState([])
	if(id){
		id = id.uid
		
	}
	let newArray = []
	useEffect(()=>{
		
		const res = firebase.getCartItems(id)
		.then(book=>setCartItem(book.docs))
		.catch(err=>alert(err.message))
	},[])*/


/*	for(let i = 0; i < cartItem.length; i++){
	
		const res = firebase.singleBookById(cartItem[i].data().bookId)
		.then(data=>{
		bookId = [...bookId,data.id]
		dummyBook = [...dummyBook,data.data()]
		
		}
		)
		.catch(err=>alert(err.message))
		
	
		
	}*/
	//	setBuyBook(dummyBook)
	
/*	const handleBlurQuantity=(e)=>{
		if(!e.target.value){
			return setQuantity(1)
		alert("1")
			
		}
	}
	const handleQuantity=(e)=>{
		return setQuantity(e.target.value)
		
	}
	const handleCheckbox=(e,cart,id)=>{
	
		if(e.target.checked){
		const timeStamp = new Date().toLocaleTimeString('en-Us',{
			hour:'2-digit',minute:'2-digit',second:'2-digit'
		})
			setCartToOrder([...cartToOrder,
			{...cart.data(),id:cart.id,timeStamp}])
			
		}
		
		
		else{
		newArray=[]
		for (let i = 0;i < cartToOrder.length;i++){
			if(cartToOrder[i].id != id){
			newArray.push(cartToOrder[i])
			
				
			}
		}
		
		setCartToOrder(newArray)
			
		}
	}
	const handleCart=(id,buyBook)=>{
		let book = "u"
		if(cartToOrder.length == 0){
			return alert("Please Select a item first")
		}
		for (let i = 0; i<cartToOrder.length; i++){
			const res = firebase.allBooks(buyBook[i].bookGenre)
			.then(data=>setBookId([data.docs[i].id]))
			.catch(err=>alert(err.message))
			const timeStamp = new Date().toLocaleTimeString('en-Us',{
				hour:'2-digit',minute:'2-digit',second:'2-digit'
			})
			const addOrder = firebase.addOrder(id,bookId[i],cartToOrder[i].quantity,timeStamp)
			alert(cartToOrder[i].id)
			const deleteOrder = firebase.deleteCartItems(cartToOrder[i].id)
			
			
		}
		window.location.reload()
	
	}*/
	
	return(
{/*	<>
	{cartItem.map((cart,i)=>(
		<>
			<h1>{cart.data().userId}</h1>
			{buyBook[i]&& 
			<>
				<label htmlFor={`checkbox${i}`}>
				<p>{buyBook[i].bookName}</p>
				
				<p>{cartToOrder.length}</p>
				<p>{buyBook[i].bookAuthor}</p>
				<p>{buyBook[i].bookPrice}</p>
				<label htmlFor="quant">Quantity</label>
				<input 
				type="number" 
				onChange={handleQuantity}
				
				id="quant"
				value={quantity}
				/>
				<p>Total Price:{quantity*buyBook[i].bookPrice}</p>
				<input 
				type="checkbox" 
				id={`checkbox${i}`}
				onChange={(e)=>handleCheckbox(e,cart,cart.id)}
				/>
				</label>
			</>
			}
			
		</>
	))}
				<button type='button' onClick={()=>handleCart(id,buyBook)}>Checkout</button>
	
	</>*/}
	<h1>Test</h1>

		
	)
}

export default Cart
