import express from 'express';
import http from 'http';
import path from 'path';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import couponRoutes from './routes/couponRoutes.js'
import cors from 'cors';
import * as socketIO from 'socket.io'; 


dotenv.config();

const app = express();
const httpServer = http.createServer(app);
const io = new socketIO.Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173', 
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  },
  pingTimeout: 60000,
});

const port = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/coupons", couponRoutes);

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, '/frontend/build')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
  )
} else {
  app.get('/', (req, res) => {
    res.send('API is running');
  });
}

io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle user setup
  socket.on('setup', (currentUserId) => {
    console.log("setup",currentUserId)
    socket.join(currentUserId);
    socket.emit('connected');
  });
 
  // Handle joining a chat room
  socket.on('join room', (room) => { // Changed from 'join chat' to 'join room'
    console.log("hey room",room)
    socket.join(room);
  });
  
  socket.on('new message', (newMessageStatus) => {
    try {
      // Log the new message status
      console.log('Received new message status:', newMessageStatus);
      const { chat, sender, chatId } = newMessageStatus;;
     
      if (!chat || !chat.users) {
        throw new Error('chat or chat.users property not found');
      }

      const excludedUser = chatId

       // Notify other users in the chat (excluding the sender)
    chat.users.forEach((user) => {
      console.log('Current User:', user);

      // Check if user._id is different from the excludedUser
      if (user._id !== excludedUser) {
        console.log('Emitting message received event to user:', user._id);
        io.to(user._id).emit('message received', newMessageStatus);
      }
    });

    // Emit the chat and chat.users to the sender
    console.log('Emitting chat info event to sender:', sender);
    io.to(sender).emit('chat info', { chat, users: chat.users });
    } catch (error) {
      console.error('Error handling new message:', error);
    }
  });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start the server
httpServer.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});