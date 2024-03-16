"use client"
import React, { useState, useEffect, useRef } from 'react';
import { Form, Button, Container, Row, Col, Spinner } from 'react-bootstrap';
import { useSendMessageMutation, useGetMessagesQuery } from '../../slices/messageSlice';
import { useLocation, useParams } from 'react-router-dom';
import Loader from "../../components/Loader"
import io from 'socket.io-client';

const ENDPOINT = 'http://localhost:5000'; 

function ChatArea({ receiverId, currentUserId }) {
  const location = useLocation();
  const { currentUsers, currentChat } = location.state || {};
  const { chatId } = useParams();
  const [messageContent, setMessageContent] = useState('');
  const [socketConnected, setSocketConnected] = useState(false);
  const [sendMessage] = useSendMessageMutation();
  const [receivedMessages, setReceivedMessages] = useState([]); 
  const [connectedUserName, setConnectedUserName] = useState('Connecting...');

  const { data: messages, isLoading, isError, error } = useGetMessagesQuery(chatId);
  console.log(currentChat)
  const socket = useRef(null);
 console.log("connect user name",connectedUserName)
  useEffect(() => {
    socket.current = io(ENDPOINT);

    socket.current.on('connect', () => {
      console.log('Socket connected!');
      setSocketConnected(true);
    });

    socket.current.on('disconnect', () => {
      console.error('Socket disconnected!');
      setSocketConnected(false);
    });

    socket.current.on('message received', (receivedMessage) => {
      console.log('Received message:', receivedMessage);
      setReceivedMessages(prevMessages => [...prevMessages, receivedMessage]); 
    });

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (!currentUsers || !chatId) {
      console.log("Data is not available");
    } else {
      socket.current.emit("join room", currentUsers[1]);
      socket.current.emit("setup", currentUsers[0]);
      console.log("Joined room and setup");
    }

    socket.current.on('connected', (connectedUserName) => {
      setSocketConnected(true);
      setConnectedUserName(connectedUserName);
    });
    

    return () => {
      if (socket.current) {
        socket.current.off('connected');
      }
    };
  }, [currentUsers, chatId]);

  const handleSendMessage = async () => {
    if (!messageContent.trim()) return;

    try {
      await sendMessage({ content: messageContent, chatId, currentUsers });
      setMessageContent('');

      socket.current.emit('new message', {
        chat: currentChat,
        sender: currentUsers[1],
        content: messageContent,
        senderId: currentUserId
      });
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <Container className="mt-3">
      <Row>
        <Col>
        <h4>Chat with {connectedUserName === 'Connecting...' ? connectedUserName : ''}</h4>

          
        </Col>
      </Row>
      <Row>
        <Col>
          {isLoading ? <Loader /> : isError ? <div>Error fetching messages: {error.message}</div> : (
            messages && messages.slice(-10).map((message) => (
              <div key={message.id}>{message.content}</div>
            ))
          )}
          {receivedMessages.length > 0 && (
            <div>
              <p>New messages received:</p>
              {receivedMessages.map((receivedMessage, index) => (
                <div key={index}>
                  <p>Sender: {receivedMessage.sender}</p>
                  <p>Content: {receivedMessage.content}</p>
                </div>
              ))}
            </div>
          )}
        </Col>
      </Row>
      <Row className="mt-3">
        <Col>
          <Form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}>
            <Form.Group controlId="messageInput">
              <Form.Control
                type="text"
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                placeholder="Type a message..."
                disabled={!socketConnected}
              />
            </Form.Group>
            <Button type="submit" variant="primary" disabled={!socketConnected}>
              Send
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default ChatArea;
