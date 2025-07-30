# Memoras Flask Backend

A Flask-based backend API for the Memoras memorial program builder application.

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- pip (Python package manager)
- PostgreSQL (optional, SQLite used by default for development)

### Setup Instructions

1. **Clone and setup the project:**
```bash
git clone <your-repo-url>
cd memoras-backend

# Run the automated setup script
python setup.py
```

2. **Manual setup (alternative):**
```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Initialize database
python run.py
```

3. **Start the development server:**
```bash
python run.py
```

The API will be available at `http://localhost:5000`

## 📋 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/guest-session` - Create guest session
- `GET /api/auth/me` - Get current user info
- `POST /api/auth/logout` - User logout

### Memorials
- `POST /api/memorials/` - Create new memorial
- `GET /api/memorials/` - List user's memorials
- `GET /api/memorials/<id>` - Get memorial details
- `PUT /api/memorials/<id>` - Update memorial
- `DELETE /api/memorials/<id>` - Delete memorial
- `POST /api/memorials/<id>/steps/<step>` - Mark step completed

### Obituaries
- `POST /api/obituaries/<memorial_id>/obituary` - Save obituary
- `GET /api/obituaries/<memorial_id>/obituary` - Get obituary
- `PUT /api/obituaries/<memorial_id>/obituary` - Update obituary
- `DELETE /api/obituaries/<memorial_id>/obituary` - Delete obituary

### Other Endpoints
- `GET /health` - Health check
- Photos, Speeches, PDF Generation (to be implemented)

## 🏗 Project Structure

```
memoras-backend/
├── app/
│   ├── __init__.py              # Flask app factory
│   ├── models/                  # Database models
│   │   ├── user.py
│   │   ├── memorial.py
│   │   ├── program.py
│   │   └── ...
│   ├── api/                     # API endpoints
│   │   ├── auth.py
│   │   ├── memorials.py
│   │   ├── obituaries.py
│   │   └── ...
│   ├── services/                # Business logic
│   ├── schemas/                 # Validation schemas
│   ├── utils/                   # Utilities
│   └── templates/               # PDF templates
├── migrations/                  # Database migrations
├── tests/                       # Test files
├── uploads/                     # File uploads
├── config.py                    # Configuration
├── run.py                       # Application entry point
├── requirements.txt             # Dependencies
└── .env                         # Environment variables
```

## 🔧 Configuration

Key environment variables in `.env`:

```bash
FLASK_ENV=development
SECRET_KEY=your-secret-key
JWT_SECRET_KEY=your-jwt-secret
DATABASE_URL=sqlite:///memoras.db
FRONTEND_URL=http://localhost:5173
```

## 🧪 Testing

Run the test script to verify your setup:

```bash
# Start the backend first
python run.py

# In another terminal, run tests
python test_setup.py
```

## 📝 Frontend Integration

Update your React frontend to use the backend:

```javascript
// frontend/src/services/api.js
const API_BASE_URL = 'http://localhost:5000/api';

// Create guest session
const createGuestSession = async () => {
  const response = await fetch(`${API_BASE_URL}/auth/guest-session`, {
    method: 'POST'
  });
  return response.json();
};

// Create memorial
const createMemorial = async (guestSession) => {
  const response = await fetch(`${API_BASE_URL}/memorials/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      guest_session: guestSession,
      title: 'Memorial Program'
    })
  });
  return response.json();
};

// Save obituary data
const saveObituaryData = async (memorialId, data, guestSession) => {
  const response = await fetch(`${API_BASE_URL}/obituaries/${memorialId}/obituary`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Guest-Session': guestSession
    },
    body: JSON.stringify(data)
  });
  return response.json();
};
```

## 🚦 Database Models

### Memorial
- Tracks overall memorial progress
- Supports both authenticated users and guest sessions
- Manages step completion and status

### Obituary
- Stores life story, dates, family information
- Connected to memorial via foreign key
- Supports different tones (traditional, celebratory, etc.)

### User
- Authentication and profile management
- Can own multiple memorials
- Optional for guest users

## 🔐 Authentication

The API supports two modes:
1. **Authenticated users**: Register/login with JWT tokens
2. **Guest sessions**: Anonymous users with session-based access

## 📦 Deployment

### Development
```bash
python run.py
```

### Production with Gunicorn
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 run:app
```

### Docker (optional)
```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 5000
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "run:app"]
```

## 🔄 Next Steps

1. **Implement remaining endpoints:**
   - Photo upload and management
   - Speech assignments
   - PDF generation
   - Acknowledgements, Body viewing, Repass location, Burial location

2. **Add advanced features:**
   - Email notifications
   - File storage (AWS S3)
   - Rate limiting
   - Caching

3. **Production deployment:**
   - Set up PostgreSQL database
   - Configure environment variables
   - Set up reverse proxy (nginx)
   - SSL certificates

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use:**
   ```bash
   # Kill process using port 5000
   lsof -ti:5000 | xargs kill -9
   ```

2. **Database errors:**
   ```bash
   # Reset database
   rm -f memoras.db
   python run.py
   ```

3. **Module import errors:**
   ```bash
   # Ensure virtual environment is activated
   source venv/bin/activate
   pip install -r requirements.txt
   ```

## 📞 Support

If you encounter issues:
1. Check the logs in the terminal
2. Verify all dependencies are installed
3. Ensure the virtual environment is activated
4. Check the `.env` file configuration

Happy coding! 🎉