# n8n Clone - Visual Workflow Automation Platform

A modern, open-source workflow automation platform built with React Flow, Next.js, and Node.js. This project provides a visual interface for creating automated workflows with support for multiple integrations including Telegram, Gmail, and AI agents.

## 🚀 Features

- **Visual Workflow Editor**: Drag-and-drop interface powered by React Flow for creating complex workflows
- **Multiple Node Types**: Support for various automation nodes including:
  - **Manual Trigger**: Start workflows manually
  - **Telegram**: Send messages via Telegram Bot API
  - **Gmail**: Send emails using Resend API
  - **WhatsApp**: Send messages via WhatsApp API (planned)
  - **AI Agent**: Integrate with AI models (OpenAI, Gemini, Claude)
- **Credential Management**: Secure storage and management of API keys and credentials
- **Real-time Execution**: Execute workflows with real-time feedback
- **Modern Tech Stack**: Built with Next.js 15, React 19, TypeScript, and Tailwind CSS
- **Database Integration**: PostgreSQL with Prisma ORM for data persistence

## 🏗️ Architecture

This project consists of two main parts:

- **Frontend (`/web`)**: Next.js application with React Flow for the visual editor
- **Backend (`/server`)**: Express.js API server with Prisma ORM and PostgreSQL

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Bun](https://bun.sh/) (for backend)
- [Docker](https://www.docker.com/) and Docker Compose
- [PostgreSQL](https://www.postgresql.org/) (or use Docker)

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd n8n-clone
```

### 2. Database Setup

Start the PostgreSQL database using Docker Compose:

```bash
cd server
docker-compose up -d
```

This will start a PostgreSQL container with the following default credentials:

- **Database**: `mydb`
- **Username**: `myuser`
- **Password**: `mysecretpassword`
- **Port**: `5432`

### 3. Backend Setup

```bash
cd server

# Install dependencies
bun install

# Set up environment variables
cp .env.example .env
# Edit .env with your database URL and API keys

# Run database migrations
bunx prisma migrate dev

# Generate Prisma client
bunx prisma generate

# Start the backend server
bun run index.ts
```

The backend will be available at `http://localhost:8000`

### 4. Frontend Setup

```bash
cd web

# Install dependencies
npm install
# or
bun install

# Start the development server
npm run dev
# or
bun dev
```

The frontend will be available at `http://localhost:3000`

## 🔧 Environment Variables

Create a `.env` file in the `server` directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://myuser:mysecretpassword@localhost:5432/mydb"

# API Keys (optional)
RESEND_API_KEY="your_resend_api_key_here"
```

## 📖 Usage

### Creating Your First Workflow

1. **Open the Application**: Navigate to `http://localhost:3000`
2. **Create New Workflow**: Click the "New Workflow" button
3. **Add Nodes**:
   - Start with a **Manual Trigger** node
   - Add action nodes like **Telegram** or **Gmail**
   - Connect nodes by dragging from one node's output to another's input
4. **Configure Nodes**: Click on any node to configure its settings
5. **Set Credentials**: Configure API keys and credentials for your integrations
6. **Save Workflow**: Click the save button to persist your workflow
7. **Execute**: Click the execute button to run your workflow

### Supported Integrations

#### Telegram

- **Setup**: Create a bot using [@BotFather](https://t.me/botfather) on Telegram
- **Configuration**: Add your bot token in the credentials section
- **Usage**: Configure chat ID and message content

#### Gmail

- **Setup**: Get a Resend API key from [resend.com](https://resend.com)
- **Configuration**: Add your Resend API key in the credentials section
- **Usage**: Configure recipient email, subject, and body

#### AI Agent

- **Setup**: Currently supports OpenAI, Gemini, and Claude models
- **Usage**: Enter your prompt and select the desired AI model

## 🗂️ Project Structure

```
n8n-clone/
├── web/                    # Next.js frontend application
│   ├── app/               # Next.js app directory
│   ├── components/        # React components
│   │   ├── nodes/        # Node-specific components
│   │   └── ui/           # Reusable UI components
│   ├── lib/              # Utility functions and types
│   ├── store/            # Zustand state management
│   └── helper/           # Helper functions
├── server/               # Express.js backend
│   ├── execution/        # Workflow execution logic
│   ├── prisma/          # Database schema and migrations
│   ├── routes/          # API routes
│   └── validations/     # Request validation schemas
└── README.md
```

## 🔌 API Endpoints

### Workflows

- `GET /workflow/:id` - Get workflow data
- `POST /workflow/save` - Save workflow
- `POST /workflow/execute/:id` - Execute workflow

### Credentials

- `POST /credentials/new` - Save credentials
- `GET /credentials?workflowid=:id` - Get workflow credentials

## 🛠️ Development

### Adding New Node Types

1. **Define Node Configuration** in `web/lib/nodes.ts`
2. **Create Node Component** in `web/components/nodes/`
3. **Add Execution Logic** in `server/execution/functions/functions.ts`
4. **Update Node Types** in the workflow editor

### Database Schema

The project uses Prisma with PostgreSQL. Key models:

- **WorkFlows**: Stores workflow definitions with nodes and edges
- **Credentials**: Stores encrypted credentials for each workflow

## 🙏 Acknowledgments

- [n8n](https://n8n.io/) for inspiration
- [React Flow](https://reactflow.dev/) for the visual workflow editor
- [Next.js](https://nextjs.org/) for the frontend framework
- [Prisma](https://prisma.io/) for database management

---

**Happy Automating! 🚀**
