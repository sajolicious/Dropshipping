import Message from '../models/messageModel.js';
import User from '../models/userModel.js';
import Chat from '../models/chatModel.js';
import asyncHandler from '../middleware/asyncHandler.js';

const allMessage = asyncHandler(async (req, res) => {
    try {
        const messages = await Message.find({ chat: req.params.chatId })
            .populate("sender", "name email")
            .populate("receiver")
            .populate("chat");
        res.json(messages);
        
    } catch (error) {
        res.status(400);
        throw new Error(error.message)
    }
});

const sendMessage = asyncHandler(async (req, res) => {
    try {
        const { content, chatId } = req.body;
        console.log(content)
        console.log(chatId)

        if (!content || !chatId) {
            return res.sendStatus(400);
        }

        const newMessage = {
            sender: req.user._id,
            content: content,
            chat: chatId,
        };

        let message = await Message.create(newMessage);

        
        message = await Message.findById(message._id)
            .populate("sender", "name")
            .populate("chat")
            .populate("receiver");

        message = await User.populate(message, {
            path: "chat.users",
            select: "name email",
        });

        await Chat.findByIdAndUpdate(chatId, { latestMessage: message });

        res.json(message);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

export { allMessage, sendMessage };
