import express from 'express'

import  cors from 'cors'


const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.get('/try',(req,res)=>{
	
})
app.listen(process.env.Port,()=>{
	console.log(`Server is running on port${process.env.PORT}`)
})
