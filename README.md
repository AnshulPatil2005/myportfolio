

---

````markdown
# 🤖 AI PR Reviewer Bot

An **AI-powered Pull Request reviewer** that analyzes GitHub PRs, highlights potential risks, and suggests improvements.  
Built with **FastAPI (backend)**, **React (frontend)**, and **LLM agents** connected to the GitHub REST API.

---

## ✨ Features
- 🔍 **Automated Review** – Analyzes code changes in GitHub PRs.
- ⚠️ **Risk Detection** – Flags security, performance, and maintainability issues.
- 💡 **Improvement Suggestions** – Provides actionable recommendations.
- 🎨 **Modern UI** – Clean React-based frontend for PR review visualization.
- ⚡ **Fast & Scalable** – Backend powered by FastAPI with async requests.
- 🔗 **Seamless GitHub Integration** – Fetches PRs and commits via REST API.

---

## 🛠️ Tech Stack
- **Frontend**: React, TailwindCSS  
- **Backend**: FastAPI, Python  
- **AI/ML**: Large Language Model (LLM agents)  
- **Database (optional)**: PostgreSQL / SQLite  
- **APIs**: GitHub REST API  

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/AnshulPatil2005/AI-PR-Reviewer.git
cd AI-PR-Reviewer
````

### 2. Backend Setup (FastAPI)

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend will start at `http://127.0.0.1:8000`.

### 3. Frontend Setup (React)

```bash
cd frontend
npm install
npm run dev
```

Frontend will start at `http://localhost:5173` (Vite default).

---

## ⚙️ Configuration

* Create a `.env` file in the backend folder with:

```env
GITHUB_TOKEN=your_personal_access_token
OPENAI_API_KEY=your_openai_key   # or other LLM key
```

---

## 📖 Usage

1. Open the frontend in browser.
2. Connect to your GitHub account using the token.
3. Select a repository & PR.
4. Get automated **review feedback, risk analysis, and suggestions** instantly.

---

## 📸 Demo

*(Add screenshots or a short GIF here for better visibility)*

---

## 🧩 Project Structure

```
AI-PR-Reviewer/
│── backend/          # FastAPI backend
│   ├── main.py
│   ├── services/
│   └── requirements.txt
│
│── frontend/         # React frontend
│   ├── src/
│   ├── package.json
│   └── vite.config.js
│
│── README.md
```

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repo
2. Create a new branch (`feature/your-feature`)
3. Commit changes
4. Open a Pull Request

---

## 📜 License

MIT License © 2025 [Anshul Patil](https://github.com/AnshulPatil2005)

---

```

---

