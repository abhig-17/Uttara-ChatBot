import React, { useRef, useEffect } from 'react';
import Message from './Message';
import { motion, AnimatePresence } from 'framer-motion';

const ChatContainer = ({ messages, isLoading }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <main className="chat-container">
      <div className="messages">
        <AnimatePresence>
          {messages.length === 0 && !isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="empty-state"
            >
              <h1>How can I help you today?</h1>
            </motion.div>
          )}
          {messages.map((msg, index) => (
            <Message key={index} role={msg.role} content={msg.content} />
          ))}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="message-wrapper ai"
            >
              <div className="avatar-wrapper ai">
                <div className="pulse-loader" />
              </div>
              <div className="message-bubble ai italic text-muted">
                Uttara is thinking...
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>
    </main>
  );
};

export default ChatContainer;
