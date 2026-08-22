import { Router } from 'express';
import { authMiddleware as _authMiddleware, authSystemUserMiddleware } from '../middleware/auth.middleware.js';
import { createTransaction, createInitialFundsTransaction } from "../controllers/transaction.controller.js";

const transactionRoutes = Router();

/**
 * - POST /api/transactions/
 * - Create a new transaction
 */

transactionRoutes.post("/", _authMiddleware, createTransaction)


/**
 * - POST /api/transactions/system/initial-funds
 * - Create initial funds transaction from system user
 */
transactionRoutes.post("/system/initial-funds", authSystemUserMiddleware, createInitialFundsTransaction)

export default transactionRoutes;