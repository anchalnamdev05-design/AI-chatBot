from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy, model
from flask_cors import CORS
from datetime import datetime
from dotenv import load_dotenv
import os
from groq import Groq

app = Flask(__name__)
CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///database.db"
db = SQLAlchemy(app)

#  DATABASE  #

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    email = db.Column(db.String(50), unique=True)
    password = db.Column(db.String(100))
    course = db.Column(db.String(100))

class Chat(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_email = db.Column(db.String(50))
    message = db.Column(db.Text)
    response = db.Column(db.Text)
    date = db.Column(db.String(50))

class FAQ(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    category = db.Column(db.String(100))
    question = db.Column(db.Text)
    answer = db.Column(db.Text)

class Admin(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50))
    password = db.Column(db.String(50))

class Unanswered(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    question = db.Column(db.Text)
    date = db.Column(db.String(50))


#  ROUTES  #

@app.route("/")
def home():
    return render_template("index.html")

#  STUDENT  #

@app.route("/api/register", methods=["POST"])
def register():
    data = request.json

    if User.query.filter_by(email=data["email"]).first():
        return jsonify({"status": "error"})

    user = User(
        name=data["name"],
        email=data["email"],
        password=data["password"],
        course=data["course"]
    )

    db.session.add(user)
    db.session.commit()

    return jsonify({"status": "success"})


@app.route("/api/login", methods=["POST"])
def login():
    data = request.json

    user = User.query.filter_by(
        email=data["email"],
        password=data["password"]
    ).first()

    if user:
        return jsonify({
            "status": "success",
            "name": user.name,
            "email": user.email,
            "course": user.course
        })

    return jsonify({"status": "error"})


@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.json
    msg = data.get("message", "")
    email = data.get("email", "")

    # If response is provided, store it as-is (AI response)
    response = data.get("response", None)
    
    # If no response, generate one using bot_reply
    if not response:
        response = bot_reply(msg)

    chat = Chat(
        user_email=email,
        message=msg,
        response=response,
        date=str(datetime.now())
    )

    db.session.add(chat)
    db.session.commit()

    return jsonify({"status": "success", "reply": response})

@app.route("/api/chat-ai", methods=["POST"])
def chat_ai():
    data = request.json
    messages = data.get("messages", [])
    system_prompt = data.get("system", "You are a helpful assistant for MediCaps University.")

    if not messages:
        return jsonify({"status": "error", "reply": "No message"}), 400

    try:
        client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": system_prompt},  # ← uses system prompt from frontend
                *messages
            ]
        )

        reply = response.choices[0].message.content
        return jsonify({"status": "success", "reply": reply})

    except Exception as e:
        return jsonify({"status": "error", "reply": str(e)}), 500
    
# ---------- ADMIN ---------- #

@app.route("/api/admin/login", methods=["POST"])
def admin_login():
    data = request.json

    admin = Admin.query.filter_by(
        username=data["username"],
        password=data["password"]
    ).first()

    if admin:
        return jsonify({"status": "success"})
    return jsonify({"status": "error"})


@app.route("/api/admin/students")
def get_students():
    users = User.query.all()
    return jsonify([
        {"name": u.name, "email": u.email, "course": u.course}
        for u in users
    ])


@app.route("/api/admin/chats")
def get_chats():
    chats = Chat.query.all()
    return jsonify([
        {
            "email": c.user_email,
            "message": c.message,
            "response": c.response,
            "date": c.date
        } for c in chats
    ])


@app.route("/api/admin/add-faq", methods=["POST"])
def add_faq():
    data = request.json

    faq = FAQ(
        category=data["category"],
        question=data["question"],
        answer=data["answer"]
    )

    db.session.add(faq)
    db.session.commit()

    return jsonify({"status": "success"})


@app.route("/api/admin/faqs")
def get_faqs():
    faqs = FAQ.query.all()
    return jsonify([
        {
            "id": f.id,
            "category": f.category,
            "question": f.question,
            "answer": f.answer
        } for f in faqs
    ])

@app.route("/api/admin/unanswered")
def get_unanswered():
    data = Unanswered.query.all()

    return jsonify([
        {"id": q.id, "question": q.question, "date": q.date}
        for q in data
    ])

@app.route("/api/admin/answer-question", methods=["POST"])
def answer_question():
    data = request.json

    # Add to FAQ
    faq = FAQ(
        category=data["category"],
        question=data["question"],
        answer=data["answer"]
    )
    db.session.add(faq)

    # Remove from unanswered
    q = Unanswered.query.get(data["id"])
    if q:
        db.session.delete(q)

    db.session.commit()

    return jsonify({"status": "success"})

#  BOT  #

def bot_reply(msg):
    msg = msg.lower()
    faqs = FAQ.query.all()

    for faq in faqs:
        if any(word in msg for word in faq.question.lower().split()):
            return faq.answer

    #  If no answer found → store question
    new_q = Unanswered(
        question=msg,
        date=str(datetime.now())
    )
    db.session.add(new_q)
    db.session.commit()

    return "Sorry, I don’t have this information yet. Admin will update it soon."


#  INIT  #

if __name__ == "__main__":
    with app.app_context():
        db.create_all()

        # Create default admin
        if not Admin.query.first():
            admin = Admin(username="admin", password="admin@123")
            db.session.add(admin)
            db.session.commit()

    app.run(debug=True)