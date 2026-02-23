# Uttara AI Chat

A production-quality AI chat application inspired by ChatGPT. Built with a modern full-stack architecture featuring React, Zustand, Express, MongoDB, and Hugging Face AI.

## 🏗️ Project Structure

```
Uttara-Ai/
├── frontend/          # React (Vite) + Zustand frontend
├── backend/           # Node.js (Express) + MongoDB + HF backend
├── package.json       # Root scripts to run both
└── README.md
```

## ✨ Features

- **ChatGPT-Style UI**: Centered chat stream, rounded user bubbles, and professional typography.
- **Persistence**: Chat history saved in MongoDB.
- **Modular Backend**: Clean separation of concerns (Controllers, Routes, Models, Services).
- **AI Integration**: Powered by Hugging Face Inference API.
- **Security**: Rate limiting, security headers (Helmet), and secure environment management.
- **Responsive**: Fully optimized for mobile and desktop.

## 🚀 Getting Started

### Prerequisites

- **Node.js**: Version 18 or higher.
- **MongoDB**: A running instance (local or Atlas).
- **Hugging Face Token**: Get one from [hf.co/settings/tokens](https://huggingface.co/settings/tokens).

### Installation

1. Clone the repository and install root dependencies:
   ```bash
   npm install
   ```

2. Install backend & frontend dependencies:
   ```bash
   npm run install-all
   ```
   *(Note: You can also run `npm install` inside both `backend/` and `frontend/` directories).*

### Configuration

Create a `.env` file in the `backend/` directory:
```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/uttara-ai
HF_TOKEN=your_huggingface_token_here
NODE_ENV=development
```

### Running Locally

From the project root:
```bash
npm run dev
```
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3001

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Zustand, Framer Motion, Lucide React.
- **Backend**: Node.js, Express, Mongoose, Hugging Face SDK.
- **Security**: Helmet, Express-Rate-Limit, Dotenv.
