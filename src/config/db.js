import { connect } from "mongoose"



function connectToDB() {

    connect(process.env.MONGO_URI)
        .then(() => {
            console.log("server is connected to DB")
        })
        .catch(err => {
            console.log("Error connecting to DB",err)
            process.exit(1)
        })

}


export default connectToDB