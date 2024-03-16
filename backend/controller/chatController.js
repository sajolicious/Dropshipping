import Chat from '../models/chatModel.js'
import User from '../models/userModel.js'
import asyncHandler from '../middleware/asyncHandler.js'


const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  console.log(userId)
  if (!userId) {
    console.log('userId param not send with request')
    return res.status(400).send('Missing userId')
  }

  const isChat = await Chat.findOne({
    isGroupChat: false,
    users: { $all: [req.user._id, userId] }, 
  })
    .populate('users', '-password')
    .populate('latestMessage.sender', 'name email')

  if (isChat) {
    res.send(isChat)
  } else {
    try {
      const chatData = {
        chatname: 'sender',
        isGroupChat: false,
        users: [req.user._id, userId],
      }
      const createdChat = await Chat.create(chatData)
      const fullChat = await createdChat.populate('users', '-password') 
      res.status(200).json(fullChat)
    } catch (error) {
      console.error(error)
      res.status(400).json({ error: 'Failed to create chat' }) 
    }
  }
})

const fetchChats = asyncHandler(async (req, res) => {
  try {
    Chat.find({ users: { $all: [req.user._id, userId] } })
      .populate('users', '-password')
      .populate('groupAdmin', '-password')
      .populate('latestMessage')
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: 'latestMessage.sender',
          select: 'name email',
        })
        res.status(200).send(results)
      })
  } catch (error) {
    res.status(400)
    throw new Error(error.message)
  }
})

const fetchGroups = asyncHandler(async (req, res) => {
  try {
    const allGroups = await Chat.where('isGroupChat').equals(true)
    res.status(200).send(allGroups)
  } catch (error) {
    res.status(400)
    throw new Error(error.message)
  }
})
const createGroupChat = asyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: 'Data is insufficient' })
  }
  const users = JSON.parse(req.body.users)
  console.log('chatController/createGroups : ', req)
  users.push(req.user);

  try {
    const groupChat = await Chat.create({
        chatName: req.body.name,
        users:  users,
        isGroupChat: true,
        groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({_id: groupChat._id})
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);

  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
})
const groupExit = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;

    try {
        const chat = await Chat.findById(chatId);


        if (!chat) {
            res.status(404);
            throw new Error("Chat not found");
        }
        if (!chat.users.includes(userId)) {
            res.status(400);
            throw new Error("User is not a member of this chat");
        }

        chat.users = chat.users.filter(id => id.toString() !== userId);

        const updatedChat = await chat.save();

        const populatedChat = await updatedChat
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .execPopulate();

        res.status(200).json(populatedChat);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

const addSelfToGroup = asyncHandler (async(req,res) => {
    const { chatId, userId }= req.body;
    const added = await Chat.findByIdAndUpdate(
        chatId, {
            $push: { users: userId },
        },
        {
            new: true,
        }
    )
    .populate("users", "-password")
    .populate("groupAdmin", "-password")

    if(!added) {
        res.statis(404);
        throw new Error("Chat Not Found");
    } else {
        res.json(added)
    }
})

export { accessChat, fetchChats, fetchGroups, createGroupChat, groupExit, addSelfToGroup }
