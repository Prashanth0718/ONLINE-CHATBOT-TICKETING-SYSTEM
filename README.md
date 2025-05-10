# MuseumGo: Online Chatbot Based Ticketing System

## Overview
The Online Chatbot Based Ticketing System is a AI-powered chatbot application designed to automate museum ticketing. It eliminates manual queues, reduces human error, and offers an intuitive experience for both visitors and administrators. The system is built using the MERN stack and integrates payment gateways, analytics support to create a seamless and efficient booking process.

## Architecture Overview
The system architecture is built on the MERN (MongoDB, Express.js, React.js, Node.js) stack, featuring a AI-powered chatbot integrated with a secure payment gateway and real-time analytics to streamline museum ticket booking.

![Architecture Overview](https://github.com/user-attachments/assets/63d13aef-5e12-46fc-883f-01d52d46c0ed)
                                                                                                                                                                                                                                                                                                                                                                                                                    
## Tech Stack
- **Frontend:** React.js, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas  
- **Bot Framework:** Custom NLP logic   
- **Payment Gateway:** Razorpay 
- **Deployment:** Render (Backend), Netlify (Frontend)
- **Dev Tools**: Postman, VS Code, GitHub

## Features
- User Registration and Login
- JWT-based Authentication & Route protection middleware  
- Role-based Access Control (User/Admin)
- User Profile Management with Editable Fields
- Password Reset via Email (using Nodemailer)
- Museum Ticket Booking System Using Chatbot
- Payment Gateway Integration (Rasorpay)
- Admin Dashboard  
- Ticket Cancellation with Refund  
- Daily Ticket Stats  
- Email Notifications (Send booking confirmations, cancellation alerts, and reminders via email)
- QR-Based Entry Validation
- Secure API using Express.js + MongoDB + Mongoose

## Chatbot Flow & Modules
- Step-based modular design (`chatbotSteps/`)  
- Tracks user session & step  
- Handles:
  - Greetings
  - Main menu
  - Museum selection
  - Date & ticket selection
  - Payment
  - Cancellation
  - Refund tracking

## Screenshots

### Home Page
![Home](https://github.com/user-attachments/assets/8090b366-430f-4657-bd8e-70bf4b9c2b91)

### SignUp Page
![SignUp](https://github.com/user-attachments/assets/08e9848b-9f15-4b1b-8d5d-2f5e9258bc16)

### SignIn Page
![SignIn](https://github.com/user-attachments/assets/9fecacef-17e9-485a-a7f4-d9e85e2670d6)

### Plan & Visit Page
![Plan & Visit](https://github.com/user-attachments/assets/bb0daaf0-056a-4657-afc8-ce0fe3fc9eb3)

### Museum Guide Page
![Museum Guide](https://github.com/user-attachments/assets/763e7e0a-6191-4f12-a5aa-8fd5563ab4d1)

### User Profile Management Page
![Profile Settings](https://github.com/user-attachments/assets/d4eea826-166e-4e39-861a-d08c589b4300)

### Chatbot Conversation Interface
![Chatbot Conversation Interface](https://github.com/user-attachments/assets/95df200b-3177-4ac3-b45f-4f4dcd714e8e)

### My Tickets Page
![My Tickets](https://github.com/user-attachments/assets/48d9865b-e39a-404c-b4c2-94d6c6de67dd)

### Contact Page
![Contact](https://github.com/user-attachments/assets/3cc84aa5-6b59-451b-b7ca-bc76a8d8d496)


## Getting Started

### Prerequisites
- **Node.js** (v12 or higher)
- **npm** (Node Package Manager)
- **MongoDB** (Make sure you have a running MongoDB instance)
- (Optional) Verified Email Account (e.g., Gmail SMTP) for sending password reset links

### Installation & Setup

#### 1. Clone the repository:

```bash
git clone https://github.com/your-username/ONLINE-CHATBOT-TICKETING-SYSTEM.git
cd ONLINE-CHATBOT-TICKETING-SYSTEM
```

#### 2. Install server-side (backend) dependencies:

```bash
cd backend
npm install
```

#### 3. Install client-side (frontend) dependencies:

```bash
cd frontend
npm install
```

### 4. Configuration:

Create a `.env` file inside `/backend` with the following keys:

```env
PORT=5000
MONGO_URI=your-mongodb-uri
JWT_SECRET=your-jwt-secret
RAZORPAY_KEY_ID=your-key-id
RAZORPAY_KEY_SECRET=your-key-secret
GEMINI_API_KEY=your-gemini-api-key
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-email-password
CORS_ORIGIN=http://localhost:3000

```
 Replace placeholders with real credentials.

### 5. Run the application:

In two separate terminals:

#### Terminal 1: Start the backend
```bash
cd backend
node index.js
```

#### Terminal 2: Start the frontend
```bash
cd frontend
npm run dev
```

### 6. Run the application:
Open your web browser and navigate to http://localhost:5173 (or your defined frontend port) to access MuseumGo.


## API Endpoints
---

| Method | Endpoint                   | Description                |
|--------|----------------------------|----------------------------|
| POST   | /api/auth/register         | Register new user          |
| POST   | /api/auth/login            | Login user                 |
| POST   | /api/auth/forgot-password  | Send reset link via email  |
| PUT    | /api/auth/reset-password   | Reset password             |
| GET    | /api/users/profile         | Get user profile           |
| PUT    | /api/users/profile         | Update profile             |
| PUT    | /api/users/change-password | Change password            |
and more...
---

## Usage
- Launch frontend and backend servers  
- Open the React app in the browser  
- Chatbot initiates booking conversation  
- Select museum, date, and ticket count  
- Proceed with payment  
- Receive digital ticket via email with booking details  

## Future Enhancements
- Two-Factor Authentication (2FA): Add 2FA during login using OTP via email or phone for enhanced security.
- Progressive Web App (PWA) Support: Make the chatbot-based ticketing system installable and usable offline with service workers.
- Real-Time Chatbot Responses with Socket.io: Upgrade to real-time communication between user and chatbot using WebSockets.
- Voice Input Integration: Add support for voice-to-text interaction with the chatbot, improving accessibility.





## 🤝 Contributing
Pull requests are welcome. Please submit issues or feature requests if you'd like to help improve this project.
