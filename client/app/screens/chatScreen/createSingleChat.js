"use client"
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'; // Import useSelector and useDispatch hooks
import { useGetUsersQuery } from '../../slices/usersApiSlice';
import { useCreateChatMutation } from '../../slices/chatSlice';
import { useNavigate } from 'react-router-dom';
import { setCredients } from '../../slices/authSlice'; // Import the setCredients action creator

const CreateSingleChat = () => {
  const [selectedUserId, setSelectedUserId] = useState(null);

  const dispatch = useDispatch(); // Initialize useDispatch hook
  const userInfo = useSelector((state) => state.auth.userInfo); // Get user info from Redux store
  const { data: users, isLoading, isError, error } = useGetUsersQuery();
  const [createChat, { isLoading: createChatLoading, isError: createChatError }] = useCreateChatMutation();
  const navigate = useNavigate();

  const handleUserSelect = (userId) => {
    setSelectedUserId(userId);
  };

  const handleCreateChat = async () => {
    if (!selectedUserId) return;
  
    try {
      const response = await createChat({ userId: selectedUserId });
      if (response.error) {
        console.error('Failed to create chat:', response.error);
        return;
      }
  
      const createdChat = response.data;
      const chatId = createdChat._id;
  
      dispatch(setCredients({ ...userInfo, currentUserId: selectedUserId }));
  
      navigate(`/chat/${chatId}`, {
        state: {
          currentUsers: [selectedUserId, userInfo.currentUserId],
          currentChat: createdChat,
          receiverId: selectedUserId, // Pass selectedUserId as receiverId
          currentUserId: userInfo.currentUserId, // Pass currentUserId
        },
      });
    } catch (error) {
      console.error('Failed to create chat:', error);
    }
  };
  

  if (isLoading) return <div>Loading users...</div>;
  if (isError) return <div>Error fetching users: {error.message}</div>;

  return (
    <div>
      <h2>Create Single Chat</h2>
      <div>
        <h3>Select User:</h3>
        <ul>
          {users && users.map((user) => (
            <li
              key={user.id}
              onClick={() => handleUserSelect(user._id)}
              className={selectedUserId === user.id ? 'selected' : ''}
            >
              {user.name}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <button disabled={isLoading || createChatLoading} onClick={handleCreateChat}>
          Create Chat
        </button>
        {createChatError && <div>Error creating chat: {createChatError.message}</div>}
      </div>
    </div>
  );
};
export default CreateSingleChat;
