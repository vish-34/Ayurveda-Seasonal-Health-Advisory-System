Ayurveda Seasonal Health Advisory System
Complete Software Design Document
Project Goal
Build a MERN web application that determines a user's dominant Dosha (Vata/Pitta/Kapha) through an assessment and provides personalized seasonal wellness advice from a pre-built knowledge base.

Tech Stack
Frontend: React (Vite), Tailwind CSS
Backend: Node.js, Express.js
Database: MongoDB Atlas
Auth: JWT + bcrypt
Roles
User: register, assessment, dashboard, articles.
Admin: manage users, edit advisory content, herbs, articles, analytics.
User Flow
Landing -> Register/Login -> Complete Profile -> Dosha Assessment -> Backend calculates scores -> Store profile -> Detect Season -> Fetch advisory where dosha+season match -> Dashboard -> Articles -> Profile.
Registration Fields
Name, Email, Password, Age, Gender, Country, State, City, Occupation, Lifestyle, Diet Type, Sleep Time, Wake Time, Disclaimer Acceptance.
Dashboard
Greeting, Current Season, Dominant Dosha, Today's Diet, Yoga, Herbs, Routine, Precautions, Water Reminder, Weather (optional), Articles.
Dosha Assessment
35-40 MCQs. Each option contributes Vata/Pitta/Kapha points. Highest score becomes dominant dosha. Store all three scores and assessment date.
Recommendation Engine
1. Get user's dominant dosha.
2. Detect current season.
3. Query advisory collection using dosha + season.
4. Group by category (diet, herbs, yoga, routine, precautions).
5. Return personalized response.
Database Collections
users, doshaProfiles, advisories, articles, herbs, seasons, notifications(optional), bookmarks(optional), activityLogs(optional).
Advisory Schema
dosha, season, category, title, content, tags, status. Populate 18 combinations (3 doshas x 6 seasons). Admin edits content instead of creating recommendations manually.
Admin Panel
Dashboard, User Management, Advisory Management, Herb Management, Article Management, Analytics, Settings.
REST APIs
POST /auth/register
POST /auth/login
POST /dosha/assess
GET /dashboard
GET /advisory/current
GET /articles
GET /herbs
Admin CRUD for advisories/articles/herbs.
Folder Structure
client/{pages,components,context,services}
server/{models,controllers,routes,middleware,services,utils}.
Future Enhancements
Weather API, React Native app, AI chatbot, multilingual support, push notifications.
Why Pre-stored Advisories
Only 18 dosha-season combinations are needed. Backend performs lookup instead of generating content dynamically. Easier to maintain, faster, and ideal for a college project.
