import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv';

const app = express()
dotenv.config({
    path:'./.env'
})


app.get('/', (req, res) => {
    res.send("Skill Sync is running")
})








import authRoutes from './routes/auth.routes.ts'
app.use('/api/auth', authRoutes)


app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})





