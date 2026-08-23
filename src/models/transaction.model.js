import { Schema, model } from "mongoose"


const transactionSchema = new Schema({
    fromAccount: {
        type: Schema.Types.ObjectId,
        ref: "account",
        required: [ true, "Transaction must be associated with a from account" ],
        index: true
    },
    toAccount: {
        type: Schema.Types.ObjectId,
        ref: "account",
        required: [ true, "Transaction must be associated with a to account" ],
        index: true
    },
    status: {
        type: String,
        enum: {
            values: [ "PENDING", "COMPLETED", "FAILED", "REVERSED" ],
            message: "Status can be either PENDING, COMPLETED, FAILED or REVERSED",
        },
        default: "PENDING"
    },
    amount: {
        type: Number,
        required: [ true, "Amount is required for creating a transaction" ],
        min: [ 0, "Transaction amount cannot be negative" ]
    },
    //An idempotency key is used to make sure that the same API request doesn't accidentally perform the same
    //  operation multiple times.
    idempotencyKey: {
        type: String,
        required: [ true, "Idempotency Key is required for creating a transaction" ],
        index: true,
        unique: true
    }
}, {
    timestamps: true
})

const transactionModel = model("transaction", transactionSchema)


export default transactionModel   