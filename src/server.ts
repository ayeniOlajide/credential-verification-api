import app from './app';
import { connectDB } from './config/dbinit';
import './config/env';

const PORT = process.env.PORT || 4040

const startServer = async () => {
    try {
        await connectDB();  //connect to db first
        app.listen(PORT, () => {
            console.log(`🚀 Server is running on http://localhost:${PORT}`)
        })
    } catch (error) {
        console.log('❌ Failed to start server:', error)
        process.exit(1); //exit app if connection fails
    }
};

startServer()
