# Indian Cultural Heritage — AI Image Generation Platform

A culturally-grounded AI image generation and knowledge retrieval system. The platform retrieves authentic Indian cultural heritage information (attire, instruments, traditions, architectural details) using vector embeddings and semantic search (FAISS + Sentence Transformers), enriches user prompts with cultural context, and generates culturally accurate imagery.

---

## 🏛️ System Architecture

- **Frontend**: React 19, Vite, Tailwind CSS v4, React Router
- **Backend**: FastAPI, Uvicorn, Pydantic, Python-dotenv
- **Database**: MongoDB (cultural heritage collection)
- **Vector Search**: FAISS (`IndexFlatL2`) + Sentence Transformers (`all-MiniLM-L6-v2`)
- **Image Generation Pipeline**: Cloudflare Workers AI (`@cf/black-forest-labs/flux-1-schnell`)

---

## 📋 Prerequisites

Ensure you have the following installed on your machine:
- **Node.js** (v18 or newer) & **npm**
- **Python** (v3.10 or newer)
- **MongoDB** (running locally on port `27017` or via MongoDB Atlas)

---

## ⚙️ Environment Configuration

Check and configure the environment variables in `backend/.env`:

```env
MONGO_URI=mongodb://localhost:27017
DATABASE_NAME=indian_cultural_heritage
CLOUDFLARE_ACCOUNT_ID=your_cloudflare_account_id
CLOUDFLARE_API_TOKEN=your_cloudflare_api_token
```

---

## 🚀 Quick Start Guide

### 1. Start MongoDB (if not already running)

```bash
# macOS (Homebrew)
brew services start mongodb-community
```

---

### 2. Start the Backend API

Open a terminal and run:

```bash
cd backend

# (Optional) Activate your Python virtual environment if using one:
# python3 -m venv venv && source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# (First-time setup only) Seed database & build FAISS vector index:
# python3 scripts/seed_database.py
# python3 scripts/build_index.py

# Start the FastAPI server with auto-reload
python3 -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

- **Backend API**: [http://127.0.0.1:8000](http://127.0.0.1:8000)
- **API Documentation (Swagger UI)**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **OpenAPI JSON**: [http://127.0.0.1:8000/openapi.json](http://127.0.0.1:8000/openapi.json)

---

### 3. Start the Frontend Application

Open a second terminal and run:

```bash
cd frontend

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```

- **Frontend App**: [http://localhost:5173](http://localhost:5173)
- **Admin Dashboard**: [http://localhost:5173/admin](http://localhost:5173/admin)

---

## 📁 Project Structure

```text
indian-cultural-heritage/
├── frontend/                     # React + Vite Application
│   ├── src/
│   │   ├── admin/                # Admin views & components
│   │   ├── components/           # Navbar, PromptBox, GeneratedImage, HeritageContext
│   │   ├── pages/                # Home, Admin pages
│   │   ├── services/             # API client services
│   │   └── App.jsx               # Routes and app entry
│   └── package.json
│
├── backend/                      # FastAPI Backend
│   ├── app/
│   │   ├── main.py               # FastAPI entry point & CORS configuration
│   │   ├── routes/               # API routes (generation, admin)
│   │   ├── database/             # MongoDB connection setup
│   │   ├── services/             # FAISS retrieval, embeddings, image generation
│   │   └── utils/                # Categories & helpers
│   ├── data/
│   │   └── seed_data.json        # Cultural heritage seed dataset
│   ├── scripts/
│   │   ├── seed_database.py      # Seed MongoDB with initial dataset
│   │   └── build_index.py        # Build FAISS vector index from MongoDB records
│   ├── vector_store/
│   │   ├── index.faiss           # Generated FAISS vector index
│   │   └── metadata.json         # Index metadata mapping
│   ├── generated_images/         # Output directory for generated images
│   ├── requirements.txt          # Python dependencies
│   └── .env                      # Environment variables
│
└── README.md                     # Project documentation
```

---

## 🛠️ Useful Scripts & Testing

Inside the `backend/` directory:

- **Seed Database**:
  ```bash
  python3 scripts/seed_database.py
  ```
- **Rebuild Vector Index**:
  ```bash
  python3 scripts/build_index.py
  ```
- **Test Semantic Search / Retrieval**:
  ```bash
  python3 scripts/test_retrieval.py
  python3 scripts/test_search.py
  ```
- **Test Image Generation Pipeline**:
  ```bash
  python3 scripts/test_image_generation.py
  ```
