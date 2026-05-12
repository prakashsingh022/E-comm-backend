# E-commerce Backend

A robust and scalable backend for the E-commerce platform, built with Node.js, Express, and MongoDB.

## Features

- **Authentication**: Secure admin and user authentication using JWT and Bcrypt.
- **Product Management**: CRUD operations for products, categories, and sections.
- **Media Handling**: Integrated with Cloudinary for image and video uploads.
- **Order Management**: Real-time order tracking and management.
- **Analytics**: Business statistics and revenue tracking.
- **Real-time Updates**: Socket.io integration for live notifications and activity logs.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JSON Web Tokens (JWT)
- **Media Storage**: Cloudinary
- **Real-time**: Socket.io

## Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB instance
- Cloudinary account

## Getting Started

1. **Clone the repository**:
   ```bash
   git clone https://github.com/prakashsingh022/E-comm-backend.git
   cd E-comm-backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Variables**:
   Create a `.env` file in the root directory and copy the contents from `.env.example`, then fill in your actual credentials.
   ```bash
   cp .env.example .env
   ```

4. **Run the application**:
   - For production:
     ```bash
     npm start
     ```
   - For development (requires nodemon):
     ```bash
     npm run dev
     ```

## Project Structure

- `controllers/`: Request handlers and business logic.
- `models/`: Mongoose schemas and models.
- `routes/`: API endpoint definitions.
- `middleware/`: Custom middleware (auth, error handling, etc.).
- `config/`: Configuration files (DB, Cloudinary).
- `utils/`: Helper functions.

## License

This project is licensed under the ISC License.
