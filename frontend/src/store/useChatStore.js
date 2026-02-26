import { create } from 'zustand';

const API_URL = 'https://uttara-chatbot.onrender.com/api';

const STORAGE_KEY = 'uttara_ai_chats';

const loadChats = () => {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.error('Failed to load chats from localStorage', e);
        return [];
    }
};

const saveChats = (chats) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
    } catch (e) {
        console.error('Failed to save chats to localStorage', e);
    }
};

export const useChatStore = create((set, get) => ({
    sessions: loadChats(),
    currentSessionId: null,
    messages: [],
    isLoading: false,
    error: null,
    success: null,

    fetchSessions: () => {
        const sessions = loadChats().sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        set({ sessions });
    },

    setCurrentSession: (sessionId) => {
        if (!sessionId) {
            set({ currentSessionId: null, messages: [] });
            return;
        }

        const session = get().sessions.find(s => s._id === sessionId);
        if (session) {
            set({
                currentSessionId: sessionId,
                messages: session.messages || [],
                error: null
            });
        } else {
            set({ error: 'Chat not found' });
        }
    },

    sendMessage: async (content) => {
        const { currentSessionId, messages, sessions } = get();

        // Prepare current session or create a temporary one
        let sessionId = currentSessionId;
        let updatedSessions = [...sessions];
        let sessionIndex = updatedSessions.findIndex(s => s._id === sessionId);

        if (sessionIndex === -1) {
            sessionId = Date.now().toString();
            const newSession = {
                _id: sessionId,
                title: content.substring(0, 30) + (content.length > 30 ? '...' : ''),
                messages: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            updatedSessions.unshift(newSession);
            sessionIndex = 0;
            set({ currentSessionId: sessionId });
        }

        // Add user message
        const userMessage = { role: 'user', content, timestamp: new Date().toISOString() };
        const updatedMessages = [...updatedSessions[sessionIndex].messages, userMessage];

        updatedSessions[sessionIndex].messages = updatedMessages;
        updatedSessions[sessionIndex].updatedAt = new Date().toISOString();

        set({
            messages: updatedMessages,
            sessions: updatedSessions,
            isLoading: true,
            error: null
        });
        saveChats(updatedSessions);

        try {
            // Stateless backend call
            const response = await fetch(`${API_URL}/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: content, history: updatedMessages })
            });

            if (!response.ok) throw new Error('Failed to send message');

            const data = await response.json();
            const aiMessage = { role: 'assistant', content: data.response, timestamp: new Date().toISOString() };

            // Re-fetch state to avoid race conditions
            const latestSessions = get().sessions;
            const currentIdx = latestSessions.findIndex(s => s._id === sessionId);

            if (currentIdx !== -1) {
                const finalMessages = [...latestSessions[currentIdx].messages, aiMessage];
                latestSessions[currentIdx].messages = finalMessages;
                latestSessions[currentIdx].updatedAt = new Date().toISOString();

                set({
                    messages: finalMessages,
                    sessions: [...latestSessions],
                    isLoading: false
                });
                saveChats(latestSessions);
            }
        } catch (error) {
            set({ error: error.message, isLoading: false });
        }
    },

    clearError: () => set({ error: null }),
    clearSuccess: () => set({ success: null }),

    createNewSession: () => {
        set({ currentSessionId: null, messages: [], error: null });
    },

    renameSession: (sessionId, newTitle) => {
        const sessions = get().sessions.map(s =>
            s._id === sessionId ? { ...s, title: newTitle, updatedAt: new Date().toISOString() } : s
        );
        set({ sessions });
        saveChats(sessions);
    },

    deleteSession: (sessionId) => {
        const sessions = get().sessions.filter(s => s._id !== sessionId);
        set({ sessions });
        saveChats(sessions);

        if (get().currentSessionId === sessionId) {
            if (sessions.length > 0) {
                get().setCurrentSession(sessions[0]._id);
            } else {
                get().createNewSession();
            }
        }
        set({ success: 'Conversation deleted' });
        setTimeout(() => set({ success: null }), 2000);
    }
}));
