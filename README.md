# 🩸 BloodUnite: Real-Time Blood Donation Hub

BloodUnite is a full-stack, enterprise-grade MERN application designed to bridge the gap between blood emergencies and willing donors in real-time. 

Built with a focus on modern UX and secure data flow, this platform replaces outdated bulletin boards with an interactive, state-driven "Live Board" and a robust donor commitment flow.

## ✨ Core Features
* **Real-Time Emergency Board:** Donors can view critical, urgent, and normal blood requests globally.
* **Interactive Donor Flow (The "Uber" Model):** Multi-step commitment modal requiring ETA, phone contact, and health confirmation. Statuses dynamically shift from *Pending* -> *Accepted (Hero on the way)* -> *Fulfilled*.
* **Secure Authentication:** Complete JWT (JSON Web Token) integration with bcrypt password hashing to protect donor and patient data.
* **Global State Management:** Powered by Redux to maintain UI synchronicity across complex component trees.
* **Premium UI/UX:** Built using modern Glassmorphism design principles, vector icons (`react-icons`), and asynchronous status notifications (`react-toastify`).

## 🛠️ Tech Stack
* **Frontend:** React.js, Vite, Redux, Axios, React Router
* **Backend:** Node.js, Express.js
* **Database:** MongoDB Atlas, Mongoose
* **Security:** JSON Web Tokens (JWT), bcryptjs

## 🚀 Quick Start (Local Development)

**1. Clone the repository:**
```bash
git clone [https://github.com/Hemnixx/bloodbank.git](https://github.com/Hemnixx/bloodbank.git)
cd bloodbank
2. Setup the Backend:

Bash
cd backend
npm install
# Create a .env file and add your MONGO_URI and JWT_SECRET
node server.js
3. Setup the Frontend:

Bash
cd frontend
npm install
npm run dev
Engineered by Neeraj
