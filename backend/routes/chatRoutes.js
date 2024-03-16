import express from 'express';
const router =express.Router();
import {
    accessChat,
    fetchChats,
    createGroupChat,
    fetchGroups,
    groupExit,
    addSelfToGroup
} from '../controller/chatController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route("/").post(protect,accessChat);
router.route("/").get(protect,fetchChats);
router.route("/createGroup").post(protect,createGroupChat);
router.route("/fetchGroup").get(protect,fetchGroups);
router.route("/groupExit").put(protect,groupExit);
router.route("/addSelfToGroup").put(protect,addSelfToGroup);

export default router;