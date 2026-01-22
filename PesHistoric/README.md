# React + Vite

# ⚽ eFootball Match Tracker Web App

## 📌 Project Overview

The **eFootball Match Tracker** is a web application that allows players to **save, track, and analyze their eFootball matches** played with friends.

After finishing a match in **eFootball Mobile**, users can upload a **screenshot of the final match statistics screen**. The system will automatically extract match data (score & statistics) and store it under the user’s account.

This platform focuses on **friendly matches**, long‑term performance tracking, and simple competitive history between friends.

---

## 🎯 Main Goals

* Allow users to **create an account using email authentication**
* Save match results securely per user
* Extract match statistics **automatically from screenshots**
* Track historical performance against friends
* Provide clean and simple statistics dashboards

---

## 👥 Target Users

* eFootball Mobile players
* Friends who play regularly and want to keep match history
* Casual competitive players (not esports‑focused)

---

## 🔐 Authentication

* Email & password authentication
* Features:

  * Sign up
  * Login
  * Forgot password / reset
  * Email verification (optional but recommended)

Each user has a private match history.

---

## 🏗️ Core Features

### 1️⃣ Match Creation

Users can create a new match entry by:

* Selecting **Opponent (friend name or email)**
* Uploading **screenshot of the match statistics screen**
* Confirming extracted data

---

### 2️⃣ Screenshot Data Extraction (AI / OCR)

From the uploaded screenshot, the system should extract:

**Match Info**

* Player A name
* Player B name
* Final Score
* Match date

**Statistics (for both players)**

* Ball possession (%)
* Shots on target
* Total shots
* Completed passes
* Fouls (optional)
* Corners (optional)

⚠️ Important:

* The UI must allow **manual correction** if extraction is inaccurate
* The original screenshot should be stored for reference

---

### 3️⃣ Match Storage

Each match should store:

* Match ID
* User ID (owner)
* Opponent name
* Score
* Extracted statistics (JSON format)
* Screenshot URL
* Created at

---

### 4️⃣ Match History

Users can:

* View all past matches
* Filter by opponent
* Sort by date or score
* Click a match to see full statistics

---

### 5️⃣ Statistics Dashboard

Provide visual stats such as:

* Total matches played
* Wins / Draws / Losses
* Goals scored / conceded
* Average possession
* Shot accuracy

(Optional charts if time allows)

---

## 🧠 AI / OCR Requirements

The system should:

* Accept image uploads (PNG / JPG)
* Use OCR or Vision AI to detect text
* Support common eFootball Mobile UI layouts
* Be modular (easy to improve later)

Accuracy is important but **manual validation is mandatory**.

---

## 🧱 Suggested Tech Stack (Flexible)

### Frontend

* React / Next.js
* Tailwind CSS
* Simple & mobile‑first UI

### Backend

* Node.js (Express / Nest) or Django
* REST API

### Database

* PostgreSQL or MongoDB

### Storage

* Cloud image storage (S3‑like)

### AI / OCR

* Vision API (OpenAI / Google / Tesseract — choice open)

---

## 📦 API Expectations (High Level)

* `POST /auth/register`
* `POST /auth/login`
* `POST /matches` (upload screenshot)
* `GET /matches`
* `GET /matches/:id`
* `PUT /matches/:id` (edit extracted stats)

---

## 🔒 Security & Privacy

* User data isolated per account
* Screenshots private by default
* Secure image upload validation

---

## 🚀 Phase Plan

### Phase 1 (MVP)

* Auth system
* Match upload
* OCR extraction
* Match history list

### Phase 2

* Statistics dashboard
* Better extraction accuracy
* UI polish

### Phase 3 (Future)

* Friend system
* Shared match confirmation
* Leaderboards

---

## 📎 Notes for Antigravity Team

* Focus on **clean architecture**
* OCR must be **replaceable/improvable**
* UX should assume non‑technical users
* Mobile experience is priority

---

## 🏁 Success Criteria

* User can save a match in under **30 seconds**
* Extracted stats are editable
* Match history is reliable and clear

---

**Owner:** Ayoub Rahmoun
**Project Type:** Personal / Sports Utility
**Platform:** Web (Mobile‑First)
