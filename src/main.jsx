import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter,RouterProvider } from 'react-router'
import {FirebaseProvider} from './context/FireBase.jsx'
import './index.css'
import App from './App.jsx'

import Signup from './pages/Signup.jsx'
import Login from './pages/Login.jsx'
import Home from './pages/Home.jsx'
import AdminBookList from './pages/AdminPage.jsx'
import GenreWiseBook from './pages/GenreWiseBook.jsx'
import AllBookList from './pages/AllBookList.jsx'
import DetailPage from './pages/detailPage.jsx'
import AdminBookUpdatePage from './pages/AdminBookUpdatePage.jsx'
import BuyBook from './pages/BuyBook.jsx'
import Orders from './pages/Orders.jsx'
import Cart from './pages/Cart.jsx'
import ProtectedRoute from './pages/ProtectedRoute.jsx'

import Layout from './components/Layout.jsx'


let router = createBrowserRouter([
	{
		element:<ProtectedRoute />,
		children:[
		
	{
		path:'/',
		element:<Layout />,
		children:[
			
			
	{
		path:'/',
		element:<Home />
		
	},
	
	{
		path:'/book/:genre',
		element:<GenreWiseBook />
		
	},
	{
		path:'/book/:name/:id',
		element:<DetailPage />
	},
	
	{
		path:'/buybook/:id',
		element:<BuyBook />
	},
	{
		path:'/orders',
		element:<Orders />
	},
	{
		path:'/cart',
		element:<Cart />
	},
		]
	},
	]},
	{
		path:'/',
		element:<Layout />,
		children:[
			
	{
	        path:'/adminpage',
	        element:<AdminBookList />
	    },
	 {
	         path:'/allbooklist',
	         element:<AllBookList />
	     },
	     {
	         path:'/update/:id',
	         element:<AdminBookUpdatePage />
	     },
		]
	},
	{
		path:'/signup',
		element:<Signup />
	},
	
	{	
		path:'/login',
		element:<Login />
	}
	
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
  <FirebaseProvider>
  <RouterProvider router={router}>
    
  </RouterProvider>
  </FirebaseProvider>
  </StrictMode>
)
