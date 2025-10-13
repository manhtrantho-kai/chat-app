# Server Chat Application

This project is a chat application backend built using the Fiber framework and SQLite as the database. It provides a simple API for managing messages in a chat environment.

## Features

- RESTful API for message management
- SQLite database for persistent storage
- Lightweight and fast using the Fiber framework

## Project Structure

\`\`\`
server
├── cmd
│   └── main.go              # Entry point of the application
├── config
│   └── config.go           # Configuration settings
├── database
│   └── sqlite.go           # SQLite database connection and setup
├── handlers
│   └── message_handler.go   # HTTP request handlers for messages
├── models
│   └── message.go           # Message data model
├── routes
│   └── routes.go            # Application routes
├── go.mod                   # Module definition
├── go.sum                   # Module checksums
└── README.md                # Project documentation
\`\`\`

## Setup Instructions

### 1. Clone the repository

\`\`\`bash
git clone <repository-url>
cd server
\`\`\`

### 2. Install dependencies

Make sure you have Go installed. Then run:

\`\`\`bash
go mod tidy
\`\`\`

### 3. Run the application

To start the server, run:

\`\`\`bash
go run cmd/main.go
\`\`\`

The server will start on `localhost:3000` by default.

## Usage

The API provides endpoints for managing messages. You can use tools like Postman or curl to interact with the API.

### Example Endpoints

- `POST /messages` - Create a new message
- `GET /messages` - Retrieve all messages
- `GET /messages/:id` - Retrieve a specific message by ID

## License

This project is licensed under the MIT License.
