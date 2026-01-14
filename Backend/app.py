from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import mysql.connector
import os

app = Flask(
    __name__,
    static_folder="../frontend/build",
    static_url_path="/"
)
CORS(app)

# ---------------- MYSQL CONNECTION ----------------
def get_db():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="Skvenkat@2005",   # move to env later
        database="task_manager"
    )

# ---------------- DB SETUP ----------------
def init_db():
    conn = get_db()
    cur = conn.cursor()

    cur.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE,
        password VARCHAR(50),
        role VARCHAR(30)
    )
    """)

    cur.execute("""
    CREATE TABLE IF NOT EXISTS tasks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(100),
        description TEXT,
        assigned_by VARCHAR(50),
        assigned_to VARCHAR(50),
        email VARCHAR(100),
        start_date DATE,
        end_date DATE,
        status VARCHAR(20)
    )
    """)

    conn.commit()
    conn.close()

init_db()

# ---------------- SEED USERS ----------------
USERS = [
    ("ceo", "ceo123", "CEO"),
    ("pm", "pm123", "PROJECT_MANAGER"),
    ("lead", "lead123", "TEAM_LEAD"),
    ("hr", "hr123", "HR"),
    ("member1", "mem123", "TEAM_MEMBER"),
    ("member2", "mem123", "TEAM_MEMBER")
]

def seed_users():
    conn = get_db()
    cur = conn.cursor()
    for u in USERS:
        try:
            cur.execute(
                "INSERT INTO users (username, password, role) VALUES (%s, %s, %s)",
                u
            )
        except:
            pass
    conn.commit()
    conn.close()

seed_users()

# ---------------- LOGIN API ----------------
@app.route("/api/login", methods=["POST"])
def login():
    data = request.json
    conn = get_db()
    cur = conn.cursor(dictionary=True)

    cur.execute(
        "SELECT username, role FROM users WHERE username=%s AND password=%s",
        (data["username"], data["password"])
    )

    user = cur.fetchone()
    conn.close()

    if user:
        return jsonify(user)
    return jsonify({"error": "Invalid credentials"}), 401

# ---------------- GET TASKS ----------------
@app.route("/api/tasks", methods=["GET"])
def get_tasks():
    username = request.args.get("username")
    role = request.args.get("role")

    conn = get_db()
    cur = conn.cursor(dictionary=True)

    # My Tasks page will pass role=MY_TASKS
    if role == "MY_TASKS":
        cur.execute(
            "SELECT * FROM tasks WHERE assigned_to=%s",
            (username,)
        )
    else:
        # Dashboard → show all tasks for everyone
        cur.execute("SELECT * FROM tasks")

    tasks = cur.fetchall()
    conn.close()

    return jsonify(tasks)


# ---------------- ASSIGN TASK ----------------
@app.route("/api/tasks", methods=["POST"])
def add_task():
    data = request.json
    role = data["role"]
    assigned_to = data["assigned_to"]

    allowed = False

    # CEO can assign to everyone
    if role == "CEO":
        allowed = True

    # Project Manager can assign to HR, Team Lead, Team Member
    elif role == "PROJECT_MANAGER" and assigned_to in ["hr", "lead", "member1", "member2"]:
        allowed = True

    # HR can assign to Team Lead and Team Member
    elif role == "HR" and assigned_to in ["lead", "member1", "member2"]:
        allowed = True

    # Team Lead can assign only to Team Members
    elif role == "TEAM_LEAD" and assigned_to in ["member1", "member2"]:
        allowed = True

    if not allowed:
        return jsonify({"error": "Not allowed"}), 403

    conn = get_db()
    cur = conn.cursor()

    cur.execute("""
        INSERT INTO tasks
        (title, description, assigned_by, assigned_to, email, start_date, end_date, status)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
    """, (
        data["title"],
        data.get("description"),
        data["assigned_by"],
        assigned_to,
        data.get("email"),
        data["start_date"],
        data["end_date"],
        "Pending"
    ))

    conn.commit()
    conn.close()

    return jsonify({"message": "Task added successfully"})


# ---------------- UPDATE STATUS ----------------
@app.route("/api/tasks/status", methods=["PUT"])
def update_status():
    data = request.json
    conn = get_db()
    cur = conn.cursor(dictionary=True)

    # Get old task info
    cur.execute("SELECT * FROM tasks WHERE id=%s", (data["id"],))
    task = cur.fetchone()

    # Update task status
    cur.execute(
        "UPDATE tasks SET status=%s WHERE id=%s",
        (data["status"], data["id"])
    )

    # Insert into history
    cur.execute("""
        INSERT INTO task_history
        (task_id, title, assigned_by, assigned_to, old_status, new_status, changed_by)
        VALUES (%s,%s,%s,%s,%s,%s,%s)
    """, (
        task["id"],
        task["title"],
        task["assigned_by"],
        task["assigned_to"],
        task["status"],
        data["status"],
        data["changed_by"]
    ))

    conn.commit()
    conn.close()

    return jsonify({"message": "Status updated"})


@app.route("/api/history", methods=["GET"])
def get_history():
    role = request.args.get("role")

    conn = get_db()
    cur = conn.cursor(dictionary=True)

    # CEO / PM → full history
    if role in ["CEO", "PROJECT_MANAGER"]:
        cur.execute("SELECT * FROM task_history ORDER BY changed_at DESC")
    else:
        cur.execute("SELECT * FROM task_history ORDER BY changed_at DESC")

    history = cur.fetchall()
    conn.close()

    return jsonify(history)


# ---------------- SERVE REACT (WEBVIEW) ----------------
@app.route("/")
@app.route("/<path:path>")
def serve_react(path="index.html"):
    if os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, "index.html")

# ---------------- RUN ----------------
if __name__ == "__main__":
    app.run(debug=True)
