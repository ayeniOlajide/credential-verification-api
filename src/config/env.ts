import dotenv from 'dotenv'
//load different .env files based on NODE_ENV
if (process.env.NODE_ENV === 'production') {
    dotenv.config({ path: '.env.production' })
} else {
    dotenv.config({path: '.env.development'})
}
console.log('Environment', process.env.ENVIRONMENT)