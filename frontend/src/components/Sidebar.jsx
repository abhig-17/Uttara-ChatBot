import React, { useEffect } from 'react';
import { useChatStore } from '../store/useChatStore';
import { Plus, MessageSquare, MoreVertical, Pencil, Trash2, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = () => {
    const { sessions, fetchSessions, setCurrentSession, currentSessionId, createNewSession, deleteSession, renameSession } = useChatStore();
    const [openMenuId, setOpenMenuId] = React.useState(null);
    const [editingId, setEditingId] = React.useState(null);
    const [editValue, setEditValue] = React.useState('');

    useEffect(() => {
        fetchSessions();
    }, [fetchSessions]);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = () => setOpenMenuId(null);
        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, []);

    const handleDelete = (e, sessionId) => {
        e.stopPropagation();
        deleteSession(sessionId);
        setOpenMenuId(null);
    };

    const handleRenameStart = (e, session) => {
        e.stopPropagation();
        setEditingId(session._id);
        setEditValue(session.title);
        setOpenMenuId(null);
    };

    const handleRenameSave = (sessionId) => {
        if (editValue.trim()) {
            renameSession(sessionId, editValue.trim());
        }
        setEditingId(null);
    };

    const handleMenuToggle = (e, sessionId) => {
        e.stopPropagation();
        setOpenMenuId(openMenuId === sessionId ? null : sessionId);
    };

    return (
        <aside className="sidebar">
            <button className="new-chat-btn" onClick={createNewSession}>
                <Plus size={18} />
                <span>New Chat</span>
            </button>

            <div className="sessions-list">
                <AnimatePresence initial={false}>
                    {sessions.map((session) => (
                        <motion.div
                            key={session._id}
                            layout
                            initial={{ opacity: 0, x: -20, height: 'auto' }}
                            animate={{ opacity: 1, x: 0, height: 'auto' }}
                            exit={{
                                opacity: 0,
                                x: -20,
                                height: 0,
                                margin: 0,
                                padding: 0,
                                transition: { duration: 0.25, ease: 'easeInOut' }
                            }}
                            className={`session-item group ${currentSessionId === session._id ? 'active' : ''}`}
                            onClick={() => !editingId && setCurrentSession(session._id)}
                        >
                            <MessageSquare size={16} />

                            {editingId === session._id ? (
                                <input
                                    className="rename-input"
                                    value={editValue}
                                    onChange={(e) => setEditValue(e.target.value)}
                                    onBlur={() => handleRenameSave(session._id)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleRenameSave(session._id);
                                        if (e.key === 'Escape') setEditingId(null);
                                    }}
                                    autoFocus
                                    onClick={(e) => e.stopPropagation()}
                                />
                            ) : (
                                <>
                                    <span className="session-title">{session.title}</span>

                                    <button
                                        className="menu-toggle-btn"
                                        onClick={(e) => handleMenuToggle(e, session._id)}
                                    >
                                        <MoreVertical size={16} />
                                    </button>

                                    <AnimatePresence>
                                        {openMenuId === session._id && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                                className="session-menu"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <button onClick={(e) => handleRenameStart(e, session)}>
                                                    <Pencil size={14} />
                                                    <span>Rename</span>
                                                </button>
                                                <button className="delete" onClick={(e) => handleDelete(e, session._id)}>
                                                    <Trash2 size={14} />
                                                    <span>Delete</span>
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <div className="sidebar-footer">
                <div className="user-info">
                    <div className="avatar">U</div>
                    <span>User Settings</span>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
