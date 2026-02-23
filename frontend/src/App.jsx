import React from 'react';
import Sidebar from './components/Sidebar';
import ChatContainer from './components/ChatContainer';
import ChatInput from './components/ChatInput';
import { useChatStore } from './store/useChatStore';
import { AlertCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

function App() {
  const { messages, sendMessage, isLoading, error, clearError, success, clearSuccess } = useChatStore();

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-chat">
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20, x: 20 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="toast error"
            >
              <AlertCircle size={18} />
              <span>{error}</span>
              <button onClick={clearError}><X size={16} /></button>
            </motion.div>
          )}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -20, x: 20 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="toast success"
            >
              <AlertCircle size={18} />
              <span>{success}</span>
              <button onClick={clearSuccess}><X size={16} /></button>
            </motion.div>
          )}
        </AnimatePresence>
        <ChatContainer messages={messages} isLoading={isLoading} />
        <ChatInput onSend={sendMessage} disabled={isLoading} />
      </div>
    </div>
  );
}

export default App;
