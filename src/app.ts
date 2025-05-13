import express from 'express'
const app = express()


app.use(express.json())

app.get("/", (req, res) => {
    res.send("This is a Credential verification API")
})

export default app;
