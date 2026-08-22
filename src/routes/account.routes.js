import { Router } from "express"
import { authMiddleware as _authMiddleware } from "../middleware/auth.middleware.js"
import { createAccountController, getUserAccountsController, getAccountBalanceController } from "../controllers/account.controller.js"


const router = Router()



/**
 * - POST /api/accounts/
 * - Create a new account
 * - Protected Route
 */
router.post("/", _authMiddleware, createAccountController)


/**
 * - GET /api/accounts/
 * - Get all accounts of the logged-in user
 * - Protected Route
 */
router.get("/", _authMiddleware, getUserAccountsController)


/**
 * - GET /api/accounts/balance/:accountId
 */
router.get("/balance/:accountId", _authMiddleware, getAccountBalanceController)



export default router