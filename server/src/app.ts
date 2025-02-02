import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv';
import { errorHandler } from './middlewares/errorHandler.middleware.ts';


const app = express()
dotenv.config({
    path:'./.env'
})


app.get('/', (req, res) => {
    res.send("Skill Sync is running")
})



app.use(express.json({limit: '50mb'}))
app.use(cors({origin: true, credentials: true}))





import authRoutes from './routes/auth.routes.ts'
app.use('/api/auth', authRoutes)


app.use(errorHandler)
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})





