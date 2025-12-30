📘 BeyondChats Assignment – Full-Stack AI Content Pipeline

This repository contains my submission for the BeyondChats Full-Time Remote Engineer Assignment.
It demonstrates an end-to-end system that scrapes blog content, processes it with an LLM, and presents both original and AI-enhanced articles via a modern frontend.

🚀 Project Overview

The system is divided into three phases:

Laravel Backend

Scrapes the oldest BeyondChats blog articles

Stores them in a database

Exposes CRUD APIs

NodeJS LLM Worker

Fetches the latest article from Laravel

Searches competitor articles

Uses a Groq-hosted LLM to rewrite the article

Publishes the updated version back to Laravel

React Frontend

Displays original and updated articles

Shows article details and references

Clean, responsive UI

The project is implemented as a monorepo, as requested.

🧱 Tech Stack
Backend

Laravel 12

SQLite (for simplicity & local setup)

Artisan command for scraping

REST APIs

LLM Pipeline

Node.js (ESM)

Groq API (LLM)

Axios + Cheerio (scraping)

Defensive fallbacks for blocked sites

Frontend

React + Vite

Axios

React Router

🗂 Repository Structure
beyondchats-assignment/
│
├── backend-laravel/        # Laravel backend (APIs + DB)
│
├── node-llm-worker/        # NodeJS LLM pipeline (Groq)
│
├── frontend-react/         # React frontend (Vite)
│
├── diagrams/               # Architecture diagrams
│
└── README.md               # This file

🔄 Architecture & Data Flow
High-Level Flow
flowchart LR
    A[BeyondChats Blog Website] --> B[Laravel Scraper Command]
    B --> C[(Database)]
    C --> D[Laravel REST APIs]

    D --> E[NodeJS LLM Worker]
    E --> F[Search Engine Results]
    F --> E
    E --> G[Groq LLM API]
    G --> E
    E --> D

    D --> H[React Frontend]
    H --> I[User Browser]

Explanation

Laravel scrapes and stores original blog articles.

NodeJS worker fetches the latest article via API.

It searches for competitor content and attempts scraping.

If scraping is blocked, it uses fallback reference summaries.

The article is rewritten using Groq LLM.

Updated article is published back to Laravel.

React frontend fetches and displays all articles.

🧠 Key Engineering Decisions & Trade-offs
🔹 Scraping Reliability

Some high-authority blogs (e.g. Intercom, Tidio) block automated scraping.

Implemented browser-like headers

Added graceful fallbacks with reference summaries

Ensured pipeline reliability instead of brittle failures

🔹 LLM Token Limits

Groq enforces strict limits.

Trimmed prompt inputs

Structured prompt carefully

Prevented 400-level API errors

🔹 Simplicity over Over-Engineering

Given the time constraint:

SQLite instead of MySQL/Postgres

Minimal but clean frontend styling

Focus on correctness and data flow

🧪 API Endpoints (Laravel)
GET    /api/articles
GET    /api/articles/latest
GET    /api/articles/{id}
POST   /api/articles

🛠 Local Setup Instructions
1️⃣ Backend (Laravel)
cd backend-laravel
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve


Run scraper:

php artisan scrape:beyondchats

2️⃣ Node LLM Worker
cd node-llm-worker
npm install


Create .env:

LARAVEL_API=http://127.0.0.1:8000/api
GROQ_API_KEY=your_groq_api_key_here


Run pipeline:

node index.js

3️⃣ Frontend (React)
cd frontend-react
npm install
npm run dev


Open:

http://localhost:5173

🌍 Live Demo

👉 Frontend Live Link: ()
👉 Backend: Local / API-based (as required)

✅ Assignment Completion Checklist

 Scraped BeyondChats blogs

 Stored in DB

 CRUD APIs in Laravel

 NodeJS LLM pipeline

 Groq API integration

 Updated article publishing

 React frontend

 Architecture diagram

 Clear README

🙌 Final Notes

This project reflects my approach to:

Building reliable systems under constraints

Making pragmatic trade-offs

Writing clean, maintainable code

Handling real-world failures gracefully

Thank you for the opportunity — I enjoyed working on this assignment.

— Nikhil
