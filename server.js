import "dotenv/config"

import app from "./src/app.js"
import connectToDB from "./src/config/db.js"

connectToDB()

app.listen(2000, () => {
    console.log("Server is running on port 2000")
})