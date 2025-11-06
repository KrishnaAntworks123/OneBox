# Onebox - Email Management System

A full-stack application for managing, categorizing, and searching emails with Elasticsearch integration.

## Project Structure

```
├── Backend/       # Express.js API server
├── Frontend/      # React + Vite UI
└── README.md
```

## Prerequisites

- Node.js (v16 or higher)
- Elasticsearch (v8+)
- npm or yarn

## Installation

### Backend Setup

```bash
cd Backend
npm install
```

### Frontend Setup

```bash
cd Frontend
npm install
```

## Environment Configuration

### Backend .env

Create a `.env` file in the `Backend/` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Elasticsearch Configuration
ELASTICSEARCH_HOST=http://localhost:9200
ELASTICSEARCH_USER=elastic
ELASTICSEARCH_PASSWORD=your_password

# Email Configuration
IMAP_USER=your_email@gmail.com
IMAP_PASSWORD=your_app_password
IMAP_HOST=imap.gmail.com
IMAP_PORT=993

# Notification Services
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
WEBHOOK_URL=http://localhost:3000/webhooks
```

### Frontend .env

Create a `.env` file in the `Frontend/` directory:

```env
VITE_API_URL=http://localhost:5000
```

## Running the Application

### Development Mode

**Backend:**

For Fetching and Storing All Emails

```bash
cd Backend
npm run dev
```

For Running API's

```bash
cd Backend
npm run dev:api
```

**Frontend:**

```bash
cd Frontend
npm run dev
```

### Production Build

**Backend:**

```bash
cd Backend
npm run build
npm start
```

**Frontend:**

```bash
cd Frontend
npm run build
npm run preview
```

## Features

- Email management and retrieval
- Elasticsearch-powered search
- Email categorization
- Slack notifications
- Webhook support
- Email indexing

## API Routes

- `GET /emails` - Fetch emails
- `POST /emails/search` - Search emails
- `POST /webhooks` - Webhook endpoint

## Technology Stack

- **Backend:** Express.js, TypeScript, Elasticsearch, Imapflow
- **Frontend:** React, TypeScript, Vite, Tailwind CSS
- **Database:** Elasticsearch
