# 🤖 Virtual Assistant — Backend API

[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-5.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini%20AI-API-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![JWT](https://img.shields.io/badge/JWT-Authentication-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-Media%20Uploads-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)](https://cloudinary.com/)

The core RESTful backend service for the **Virtual Assistant** platform. It handles secure user authentication, assistant profile customization, avatar asset storage via Cloudinary, and intelligent query interpretation powered by **Google's Gemini Generative AI**.

---

## 🌟 Key Features

- **🧠 Google Gemini Generative AI Integration**: Interprets natural language voice/text commands and translates them into structured JSON actions (intent classification, spoken vocal answers, and actionable target URLs).
- **🔒 Secure Authentication**: Robust user signup and signin workflow featuring `bcrypt` password encryption (12 salt rounds), input schema validation via `Joi`, and session management using HTTP-only JWT cookies.
- **🎨 Custom Assistant Configuration**: Personalize assistant name, voice preference (`girl` or `boy`), and avatar image (supports image URL selection or custom image uploads via `multer` + `cloudinary`).
- **💬 Chat & Command History**: Automatically logs user commands and interactions against their MongoDB user profile.
- **⚡ Express 5 Architecture**: Built with modern ES Modules (`import`/`export`), clean routing separation, controller layers, and authentication middleware.
- **🩺 Health Check Endpoint**: Lightweight `/health` route designed to support uptime monitoring and keep free-tier cloud instances (e.g. Render) awake.

---

## 🛠️ Tech Stack

| Component | Technology |
|---|---|
| **Runtime** | [Node.js](https://nodejs.org/) (ES Modules) |
| **Framework** | [Express.js v5](https://expressjs.com/) |
| **Database** | [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/) |
| **AI Engine** | [Google Gemini API](https://ai.google.dev/) via Axios |
| **Authentication** | [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) & [bcrypt](https://github.com/kelektiv/node.bcrypt.js) |
| **Validation** | [Joi](https://joi.dev/) |
| **File Storage** | [Cloudinary](https://cloudinary.com/) via [Multer](https://github.com/expressjs/multer) |
| **CORS & Cookies** | `cors` with credentials & `cookie-parser` |

---

## 📁 Repository Structure

```
Virtual-Assistant-Backend/
├── config/
│   └── connection.js         # MongoDB connection setup
├── controllers/
│   ├── authController.js     # User registration, login, and logout
│   └── userController.js     # User profile, assistant customization & Gemini ask handler
├── middlewares/
│   ├── isLoggedIn.js         # JWT cookie validation middleware
│   └── multer.js             # Temporary disk storage for image uploads
├── models/
│   └── user.model.js         # Mongoose User schema & model definition
├── routes/
│   ├── authRouter.js         # /api/v1/auth routes
│   └── userRouter.js         # /api/v1/user routes
├── utils/
│   ├── cloudinary.js         # Cloudinary SDK wrapper & file cleanup utility
│   └── generateToken.js      # JWT token signer utility
├── gemini.js                 # Gemini prompt template & structured JSON output parser
├── index.js                  # Application entry point, middleware, and server listener
├── package.json
└── .env.example
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root of the backend directory and configure the following variables:

| Variable | Description | Example Value |
|---|---|---|
| `PORT` | Port for the Express server to listen on | `5000` |
| `Frontend_URL` | Allowed origin for CORS requests (Vite dev server or production URL) | `http://localhost:5173` |
| `MONGO_DB_URI` | MongoDB connection connection string (without trailing database name) | `mongodb+srv://<user>:<password>@cluster0.mongodb.net` |
| `GEMINI_API_URL` | Gemini API generation endpoint | `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent` |
| `GEMINI_API_KEY` | Google AI Studio API key | `AIzaSy...` |
| `JWT_SECRET_KEY` | Secret string for signing JSON Web Tokens | `your_super_secret_jwt_key_here` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud identifier | `your_cloud_name` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `your_cloudinary_key` |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | `your_cloudinary_secret` |

---

## 🚀 Setup & Installation

### Prerequisites
Make sure you have installed:
- [Node.js](https://nodejs.org/) (v18.x or later)
- [npm](https://www.npmjs.com/) (bundled with Node.js)
- A running [MongoDB](https://www.mongodb.com/) instance or a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster
- A [Google AI Studio API Key](https://aistudio.google.com/) for Gemini
- A free [Cloudinary](https://cloudinary.com/) account for image uploads

### Step-by-Step Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/AmoCreates/Virtual-Assistant-Backend.git
   cd Virtual-Assistant-Backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   Open `.env` in your text editor and fill in your MongoDB URI, Gemini API credentials, Cloudinary keys, and JWT secret.

4. **Start the server:**

   - **Development mode (with auto-restart):**
     ```bash
     npm run dev
     ```
     *(or `node --watch index.js`)*

   - **Production mode:**
     ```bash
     npm start
     ```
     *(or `node index.js`)*

5. **Verify server is running:**
   Visit `http://localhost:5000/health` in your browser or run:
   ```bash
   curl http://localhost:5000/health
   ```
   Expected response: `OK`

---

## 📡 API Reference

### Base URL: `/api/v1`

### 1. Authentication Endpoints (`/api/v1/auth`)

#### `POST /signup`
Register a new user account.
- **Request Body:**
  ```json
  {
    "username": "johndoe",
    "email": "john@example.com",
    "password": "secretpassword"
  }
  ```
- **Response (`201 Created`):**
  Sets HTTP-only `token` cookie and returns user document.

#### `POST /signin`
Authenticate an existing user.
- **Request Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "secretpassword"
  }
  ```
- **Response (`202 Accepted`):**
  Sets HTTP-only `token` cookie and returns `{ "message": "user successfully logged in" }`.

#### `GET /logout`
Clear the user's session cookie.
- **Response (`200 OK`):**
  Clears the `token` cookie and returns `{ "message": "log out successfully" }`.

---

### 2. User & Assistant Endpoints (`/api/v1/user`)
> ⚠️ **Note:** All endpoints below require a valid authentication cookie (`isLoggedIn` middleware).

#### `GET /current`
Fetch current authenticated user data and assistant configuration.
- **Response (`200 OK`):**
  ```json
  {
    "_id": "67...abc",
    "username": "johndoe",
    "email": "john@example.com",
    "assistantName": "Nova",
    "assistantImg": "https://res.cloudinary.com/.../image.png",
    "voicePreference": "girl",
    "chatHistory": ["What's the weather like?", "Play some lo-fi beats"]
  }
  ```

#### `POST /update`
Update assistant persona, voice, and avatar.
- **Content-Type:** `multipart/form-data`
- **Fields:**
  - `assistantName` *(string)*: Name for your assistant (e.g., `"Sia"`, `"Nova"`, `"Jarvis"`)
  - `voicePreference` *(string)*: `"girl"` or `"boy"`
  - `imageUrl` *(string, optional)*: URL of a selected preset avatar
  - `assistantImg` *(file, optional)*: Image file to upload directly to Cloudinary
- **Response (`200 OK`):** Updated user object.

#### `POST /ask`
Submit a voice/text query to the assistant.
- **Request Body:**
  ```json
  {
    "command": "play shape of you on youtube"
  }
  ```
- **Response (`200 OK`):**
  ```json
  {
    "response": "Playing Shape of You on YouTube.",
    "type": "play_music",
    "userInput": "play shape of you on youtube",
    "aiResponse": {
      "type": "play_music",
      "userInput": "play shape of you on youtube",
      "response": "Playing Shape of You on YouTube.",
      "url": "https://www.youtube.com/results?search_query=shape+of+you"
    }
  }
  ```

---

### 3. Utility Endpoints

- **`GET /health`**: Returns `200 OK` (`"OK"`). Used for keep-alive pings (Cron-job / UptimeRobot).
- **`GET /?prompt=your_query`**: Test route to directly verify Gemini API connectivity.

---

## 🤖 Gemini AI Intent Types

The assistant formats Gemini responses into structured actions consumed by the frontend:

| Intent `type` | Description | Client Action |
|---|---|---|
| `general` | Conversational questions, advice, general queries | Spoken TTS answer |
| `web_search` | Web queries requiring Google search | Opens Google search in new tab |
| `youtube_search` | Video searches | Opens YouTube search results |
| `youtube_open` | Open YouTube homepage | Opens `youtube.com` |
| `play_music` | Music playback queries | Opens targeted YouTube music link |
| `wikipedia_search` | Knowledge queries | Opens relevant Wikipedia article |
| `news_search` | Current events and news | Opens Google News results |
| `weather_forecast` | Weather conditions | Opens Google Weather results |
| `instagram_open` | Social media shortcut | Opens `instagram.com` |
| `twitter_open` | Social media shortcut | Opens `twitter.com` |
| `facebook_open` | Social media shortcut | Opens `facebook.com` |
| `time` / `date` | Clock and calendar inquiries | Spoken time/date reply |

---

## 🌐 Deployment (Render / Railway / VPS)

1. Set all environment variables in your hosting provider's dashboard.
2. Ensure `Frontend_URL` matches your deployed frontend domain (e.g. `https://your-frontend.vercel.app`) without trailing slashes.
3. Because cookies use `sameSite: 'none'` and `secure: true`, both frontend and backend **must** be served over HTTPS in production.
4. Set up a free ping monitor (e.g., [Cron-Job.org](https://cron-job.org/) or [UptimeRobot](https://uptimerobot.com/)) hitting `https://your-backend.onrender.com/health` every 10–14 minutes to prevent free instances from spinning down.

---

## 📄 License

This project is licensed under the ISC License.
