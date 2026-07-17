# 🌿 Prakriti+ | Ayurveda Seasonal Health Advisory System

Prakriti+ is a professional full-stack MERN web application built as an **Indian Knowledge Systems (IKS)** college project. It determines a user's dominant mind-body constitution (**Dosha**: Vata/Pitta/Kapha) through a clinical MCQ assessment and provides dynamically aligned seasonal wellness advice (**Ritucharya**) from an administrative database.

The user interface features a premium, minimalist **emerald-green and white design** utilizing glassmorphic components, fluid transitions, and responsive mobile-first layouts.

---

## 🌟 Key Features

*   **📋 3-Step Registration Wizard:** Captures demographic parameters (location, occupation, lifestyle habits, sleeping cycles) in a clean, user-friendly multi-step form.
*   **📊 10-Question Dosha Prakriti Test:** An intuitive clinical assessment measuring physical traits, sleep patterns, emotional states, and digestion.
*   **🌿 Seasonal Wellness Dashboard:**
    *   **Ritu Weather Card:** Real-time information on the active Sanskrit season (Ritu), element changes, and dosha accumulation thresholds.
    *   **Demo Season Override:** A built-in selector letting students and professors swap the season manually to instantly test all 18 advisory combinations.
    *   **Constitutions Chart:** A visual progress indicator breaking down the user's Vata, Pitta, and Kapha percentages.
    *   **Tabbed Advisories:** Grouped categories (Diet, Herbs, Yoga, Daily Routine, Precautions) tailored to the active Dosha and Season.
*   **💧 Hydration Log:** An interactive widget to log daily water consumption (+/- 250ml) synced to the database.
*   **📚 Herbology & Insights Gallery:** Complete search-and-filter database of Ayurvedic herbs (description, benefits, usage instructions) and educational articles.
*   **🛡️ Administrative Matrix Control:**
    *   Add, edit, or delete items in the herbs and articles directories.
    *   Complete management grid to directly modify recommendations for all 18 combinations (3 doshas × 6 seasons).

---

## 🛠️ Technology Stack

*   **Frontend:** React 18, Vite, Tailwind CSS v4, Lucide Icons, Axios, React Router Dom.
*   **Backend:** Node.js, Express.js, JWT Authentication, Bcrypt Password Encryption, Morgan Logger, CORS.
*   **Database:** MongoDB Atlas (Mongoose ODM).

---

## 📂 Folder Structure

```
iks-project/
├── client/                 # React frontend (Vite)
│   ├── public/             # Static page assets
│   ├── src/
│   │   ├── components/     # Reusable layout elements (Navbar, Footer, WaterTracker)
│   │   ├── context/        # Global Auth & Season states
│   │   ├── pages/          # Pages (Landing, Login, Register, Assessment, Dashboard, Herbs, Articles, Admin)
│   │   ├── services/       # Central Axios configuration (api.js)
│   │   ├── App.jsx         # Routes mapping & protection guards
│   │   └── index.css       # Emerald theme colors & base layer variables
│   ├── package.json
│   └── vite.config.js
└── server/                 # Express REST API
    ├── config/             # DB settings & MongoDB seeding script
    ├── controllers/        # Express route handlers
    ├── middleware/         # Token authorization & admin permissions
    ├── models/             # User, Advisory, Herb, Article Mongoose Schemas
    ├── routes/             # REST routing endpoints
    ├── utils/              # Ritu Season Detector & Dosha Calculators
    ├── package.json
    └── server.js           # Server startup script
```

---

## 🚀 Setup & Installation Instructions

Ensure you have [Node.js](https://nodejs.org/) (v16+) and a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster (or local MongoDB connection) ready.

### 1. Backend Setup & Seeding

1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure the environment variables:
   Create a `.env` file (copied from `.env.example`) and fill in your MongoDB Atlas connection string:
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxx.mongodb.net/ayurveda?retryWrites=true&w=majority
   JWT_SECRET=ayurveda_secret_key_12345
   NODE_ENV=development
   ```
   *(Note: If your database password contains special characters like `@`, make sure it is URL-encoded, e.g. `%40`)*
4. **Seed the database** (this will drop existing records and load the 18-combination advisories, default herbs, and articles):
   ```bash
   npm run seed
   ```
5. Start the API server:
   ```bash
   npm start
   ```
   *(Runs on http://localhost:5000)*

### 2. Frontend Setup

1. Open a new terminal and navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *(Runs on http://localhost:5173)*

---

## 🔑 Seeding Credentials (Test Logins)

Use these accounts to test the application out of the box:

*   **Administrator Account:**
    *   **Email:** `admin@ayurveda.com`
    *   **Password:** `admin123`
*   **Vata-Dominant User Account:**
    *   **Email:** `rahul@gmail.com`
    *   **Password:** `user123`

---

## 📜 Ayurvedic Reference (Ritucharya & Prakriti)

This project implements standard seasonal mappings based on the Ayurvedic calendar:
*   **Shishira** (Late Winter): Jan 16 – Mar 15
*   **Vasanta** (Spring): Mar 16 – May 15
*   **Grishma** (Summer): May 16 – Jul 15
*   **Varsha** (Monsoon): Jul 16 – Sep 15
*   **Sharad** (Autumn): Sep 16 – Nov 15
*   **Hemanta** (Early Winter): Nov 16 – Jan 15

*Disclaimer: The recommendations compiled in this application are derived from classical Ayurvedic texts (e.g. Charaka Samhita) for educational and lifestyle guidance. They do not substitute professional medical diagnosis or treatment.*
