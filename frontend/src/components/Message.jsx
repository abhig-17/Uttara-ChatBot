import React from 'react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import { Bot, User } from 'lucide-react';

const Message = ({ role, content }) => {
  const isAI = role === 'assistant';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`message-wrapper ${isAI ? 'ai' : 'user'}`}
    >
      <div className={`avatar-wrapper ${isAI ? 'ai' : 'user'}`}>
        {isAI ? <Bot size={20} /> : <User size={20} />}
      </div>
      <div className={`message-bubble ${isAI ? 'ai' : 'user'}`}>
        {isAI ? (
          <div className="markdown-content">
            <ReactMarkdown>
              {typeof content === 'string' ? content : ''}
            </ReactMarkdown>
          </div>
        ) : (
          <p>{content}</p>
        )}
      </div>
    </motion.div>
  );
};

export default Message;
