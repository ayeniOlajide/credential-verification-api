import { connect } from 'mongoose'

export const connectDB = async () => {
    const isProduction = process.env.NODE_ENV === 'production';

    const MONGO_URI = isProduction
    ? process.env.MONGO_URI_PROD    //Production URI
    : process.env.MONGO_URI_DEV

    if(!MONGO_URI){
        console.log('Please connect to a database')
        return
    }
    
    try {
        await connect(MONGO_URI, {})
        console.log('Connected  to ' + process.env.NODE_ENV + " DB") 
    } catch (error) {
        console.error('Error connecting to ', process.env.NODE_ENV + ' DocumentDB:' + error )
    }
}