import './types/express.d.ts'
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser'
import { errorHandler } from './middlewares/errorHandler.middleware.ts';

const app = express()
dotenv.config({
    path:'./.env'
})

app.use(express.json({limit: '50mb'}))
app.use(cors({origin: true, credentials: true}))
app.use(express.urlencoded({ limit: '50mb', extended: true }))
app.use(cookieParser())
app.use(express.static('public'))


app.get('/', (req, res) => {
    res.send("Skill Sync is running")
})








import authRoutes from './routes/auth.routes.ts'
app.use('/api/v1/auth', authRoutes)


app.use(errorHandler)
app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`)
})





