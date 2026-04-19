# Virtual Workspace System
A Web System incorporating Node.js, Express, PostgreSQL, React, PhaserJs and WebSockets to simulate office environment during remote work

## Status
- Backend: Completed!
- Frontend: In Progress

## Tech Stack
- Frontend: React, PhaserJs, Socket-io-client, Tailwind CSS
- Backend: Node.js, Express, Socket-io
- Database: PostgreSQL
- Security: JSON WEB TOKEN (JWT), bcrypt


## Features
- Real-time Messaging: Instant communication via Socket.io
- Secure Auth: JWT-based authentication
- API Security: Token based Access to API endpoints
- Avatar Movement: Avatar movement tracking and synchronization
- Secure Chat Feature: Chat Message Encryption using Encryption Algorithm
- Task Assignment: Assign Tasks to user in the room by admin and the user themselves

## API Endpoints

### Auth
| Method | Endpoint        | Description      |
|--------|-----------------|------------------|
| POST   |/api/auth/signup | New user SignUp  |
| POST   | /api/auth/login | User logs In     |

### Room
| Method | Endpoint                |          Description           |
|--------|-------------------------|--------------------------------|
| GET    |/api/room/getrooms       | Get all rooms visited by user  |
| POST   | /api/room/cretateroom   |     Users Create room          |
| POST   | /api/room/join          | Users joins the room           |
| GET    | /api/room/members       | Get all members of the room    |



## Installation
1. Clone the repo
2. Install Dependencies
- cd backend && npm install
- cd frontend && npm install
3. Set up .env in backend (DATABASE_URL using SUPABASE, PORT, SECRET)
4. Run the app
- Backend: npm run dev
- Frontend: npm run dev
