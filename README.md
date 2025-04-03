# code-hinter

**code-hinter** is an experimental project developed at École Centrale de Lyon. It consists of:
- A **backend** (in Python/Flask)
- A **frontend** (in Node.js/Next.js)

This README will walk you through the prerequisites, installation, and usage for both parts of the project.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
   - [Backend Setup](#backend-setup)
   - [Frontend Setup](#frontend-setup)
3. [Running the Project](#running-the-project)
4. [Optional: Running the Backend Remotely](#optional-running-the-backend-remotely)
   - [Testing the API](#testing-the-api)

---

## Prerequisites

Make sure you have the following installed on your system:

- **Python 3** (along with `pip`)
- **Node.js** (along with `npm`)

---

## Installation

### Backend Setup

1. **Navigate to the `backend` folder:**

   ```bash
   cd backend
   ```

2. **Create and activate a virtual environment:**

   **Linux/macOS:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

   **Windows (using Git Bash):**
   ```bash
   python -m venv venv
   source ./venv/Scripts/activate
   ```

3. **Install the required Python packages:**

   ```bash
   pip install --upgrade pip
   pip install -r requirements.txt
   ```

4. **Run the Flask API locally (on port 5000 by default):**

   ```bash
   python main.py
   ```

### Frontend Setup

1. **Navigate to the frontend folder** (e.g., `client-next`):
   
   ```bash
   cd client-next
   ```

2. **Install Node.js packages:**

   ```bash
   npm install
   ```

3. **Start the frontend application:**

   ```bash
   npm start
   ```
   
   By default, the frontend will run at [http://localhost:3000](http://localhost:3000).

---

## Running the Project

Once you have set up both the **backend** and **frontend**:

1. **Start the backend** in its virtual environment:
   ```bash
   cd backend
   source venv/bin/activate
   python main.py
   ```
2. **Start the frontend**:
   ```bash
   cd client-next
   npm start
   ```

- The backend API will be running on [http://127.0.0.1:5000](http://127.0.0.1:5000) (or whichever port you specified).
- The frontend will be accessible at [http://localhost:3000](http://localhost:3000).

---

## Optional: Running the Backend Remotely

If you want to run the backend in the background or on a remote server, you can use the following approach (Linux/macOS commands shown):

1. **Kill any existing instance** of the Flask application:
   ```bash
   pkill -f "python main.py" || true
   ```
2. **Start the Flask API** on a specific port (e.g., 5000), logging output to `output.log`:
   ```bash
   nohup python main.py --port 5000 > output.log 2>&1 &
   ```

### Testing the API

You can test the running API using `curl`. Below are some sample endpoints:

1. **Check if the API is running**:
   ```bash
   curl http://127.0.0.1:5000/api/test/
   ```
2. **Evaluate code**:
   ```bash
   curl -X POST http://127.0.0.1:5000/api/evaluate_code \
        -H "Content-Type: application/json" \
        -d '{"exercise_id": 1, "student_id": 123, "code": "print([x for x in range(10)])"}'
   ```
3. **Compare code**:
   ```bash
   curl -X POST http://127.0.0.1:5000/api/compare_code \
        -H "Content-Type: application/json" \
        -d '{"exercise_id": 1, "student_id": 123, "code": "print([i for i in range(10)])"}'
   ```
4. **Complete code**:
   ```bash
   curl -X POST http://127.0.0.1:5000/api/complete_code \
        -H "Content-Type: application/json" \
        -d '{"code": "for i in range(10):"}'
   ```

---

**Enjoy exploring code-hinter!** If you have any questions or need further assistance, feel free to reach out or open an issue.