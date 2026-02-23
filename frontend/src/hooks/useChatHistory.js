import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'uttara-ai-chat-history';

function isValidMessage(msg) {
  return msg && typeof msg.role === 'string' && typeof msg.content === 'string';
}

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isValidMessage).map((m) => ({
      ...m,
      id: m.id || crypto.randomUUID(),
    }));
  } catch {
    return [];
  }
}

function saveToStorage(messages) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  } catch {
    // Ignore storage quota or other errors
  }
}

function createMessage(role, content) {
  return {
    id: crypto.randomUUID(),
    role,
    content,
    timestamp: new Date().toISOString(),
  };
}

export function useChatHistory() {
  const [messages, setMessages] = useState(() => loadFromStorage());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    saveToStorage(messages);
  }, [messages]);

  const sendMessage = useCallback(async (text) => {
    const content = text?.trim?.();
    if (!content) return;

    const userMessage = createMessage('user', content);
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: content }),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error('Invalid response from server.');
      }

      if (!res.ok) {
        throw new Error(data.error || data.message || `Request failed: ${res.status}`);
      }

      const aiContent =
        data.response ?? data.text ?? data.output ?? data.generated ?? 'Sorry, I could not process your message.';
      const aiMessage = createMessage('assistant', String(aiContent));
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      const message =
        err.message || 'Failed to connect. Make sure the backend is running at localhost:5000.';
      setError(message);
      const errorMessage = createMessage('assistant', message);
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return { messages, sendMessage, isLoading, error, clearError };
}
