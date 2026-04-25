# Setup Guide - Database Integration Complete ✅

## Quick Start

### 1. Install Required Packages
```bash
pip install -r requirements.txt
```

### 2. Run the Application
```bash
python app.py
```

You should see:
```
 * Running on http://127.0.0.1:5000
```

### 3. Access the App
- **Student App**: http://localhost:5000
- **Admin Panel**: Press Ctrl+Shift+A on any page or visit http://localhost:5000?admin

---

## Database Information

### Database Type
- **SQLite** (local file-based database)
- **Location**: `instance/database.db` (auto-created)
- **No Setup Required**: Database tables created automatically on first run

### User Credentials (Demo)
**Admin Login:**
- Username: `admin`
- Password: `admin@123`

**Student Accounts:**
- Create via registration form in the student portal

---

## API Endpoints (Now Connected to Database)

### Student Authentication
- `POST /api/register` - Register new student
- `POST /api/login` - Student login

### Chat
- `POST /api/chat` - Save chat message

### Admin Dashboard
- `GET /api/admin/students` - List all students
- `GET /api/admin/chats` - View all chat history
- `GET /api/admin/faqs` - View knowledge base
- `POST /api/admin/add-faq` - Add FAQ
- `POST /api/admin/login` - Admin authentication

---

## Data Storage Changes

###  Now Using Database
- Student Registrations
- Student Logins  
- Chat Messages & History
- Admin FAQs
- Admin Chats

###  Still Using localStorage (Session Only)
- Session Token (`mc_session`)
- College Info (`mc_colinfo`)

---

## Troubleshooting

### Issue: "ModuleNotFoundError: No module named 'flask'"
**Solution**: 
```bash
pip install Flask==2.3.0
pip install Flask-SQLAlchemy==3.0.0
pip install Flask-CORS==4.0.0
```

### Issue: Port 5000 already in use
**Solution**: Change port in app.py
```python
app.run(debug=True, port=5001)  # Change 5000 to 5001
```

### Issue: Database file not created
**Solution**: Delete `instance` folder and restart app.py
```bash
rmdir /s instance
python app.py
```

### Issue: "CORS errors" when testing
**Solution**: CORS is already enabled in app.py with:
```python
CORS(app)
```
No additional configuration needed.

---

## Testing the Integration

### Test 1: Student Registration
1. Open http://localhost:5000
2. Go to Register
3. Fill form and submit
4. Check: Data should appear in admin students list

### Test 2: Chat Functionality
1. Login as student
2. Send a message to AI chatbot
3. Check admin dashboard → Chat History
4. Verify message saved with timestamp

### Test 3: Admin Dashboard
1. Press Ctrl+Shift+A on any page
2. Login with admin@admin@123
3. Verify:
   - Student count displays
   - Chat history shows messages
   - FAQs load from database

---

## Database Migration (If Upgrading)

If you want to switch from SQLite to PostgreSQL:

1. Install PostgreSQL adapter:
```bash
pip install psycopg2-binary
```

2. Update `app.py`:
```python
app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://user:password@localhost/medicaps"
```

3. Restart app - tables created automatically

---

## Next Steps

1. Verify app runs without errors
2.  Test student registration
3.  Test admin login
4.  Send test chat message
5.  Verify data in admin dashboard

---

**Database Integration Complete!** 
All user data is now securely stored in SQLite database instead of localStorage.
