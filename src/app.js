import express from "express"
import cookieParser from "cookie-parser"



const app = express()


app.use(express.json())
app.use(cookieParser())

/**
 * - Routes required
 */
import authRouter from "./routes/auth.routes.js"
import accountRouter from "./routes/account.routes.js"
import transactionRoutes from "./routes/transaction.routes.js"

/**
 * - Use Routes
 */

app.get("/", (req, res) => {
    res.send("Ledger Service is up and running")
})



app.get("/debug", (req, res) => {
    res.send("THIS IS MY LEDGER SERVER")
})

app.use("/api/auth", authRouter)



app.use("/api/auth", authRouter)
app.use("/api/accounts", accountRouter)
app.use("/api/transactions", transactionRoutes)

export default app