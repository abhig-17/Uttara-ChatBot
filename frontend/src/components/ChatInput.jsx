import React, { useState } from 'react';
import { SendHorizontal } from 'lucide-react';

const ChatInput = ({ onSend, disabled }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input);
      setInput('');
    }
  };

  return (
    <div className="input-area">
      <form onSubmit={handleSubmit} className="input-form">
        <textarea
          rows="1"
          placeholder="Message Uttara AI..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          disabled={disabled}
        />
        <button type="submit" disabled={!input.trim() || disabled} className="send-btn">
          <SendHorizontal size={20} />
        </button>
      </form>
      <p className="input-footer">Uttara AI can make mistakes. Consider checking important information.</p>
    </div>
  );
};

export default ChatInput;
