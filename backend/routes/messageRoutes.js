import express from 'express';
const router = express.Router();
import {
  allMessage,
  sendMessage
} from '../controller/messageController.js';

import { protect, admin } from '../middleware/authMiddleware.js';

router.route("/:chatId").get(protect,allMessage);
router.route("/").post(protect,sendMessage);

export default router;