# setup.py - Setup and Initialization Script
import os
import sys
import subprocess
from pathlib import Path

def run_command(command, description):
    """Run a shell command and handle errors"""
    print(f"\n🔧 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} completed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed: {e.stderr}")
        return False

def check_python_version():
    """Check if Python version is compatible"""
    if sys.version_info < (3, 8):
        print("❌ Python 3.8 or higher is required")
        sys.exit(1)
    print(f"✅ Python {sys.version.split()[0]} is compatible")

def create_directory_structure():
    """Create the project directory structure"""
    directories = [
        'app/api',
        'app/models',
        'app/services',
        'app/schemas',
        'app/utils',
        'app/templates',
        'migrations',
        'tests',
        'uploads'
    ]
    
    for directory in directories:
        Path(directory).mkdir(parents=True, exist_ok=True)
        
        # Create __init__.py files for Python packages
        if directory.startswith('app/'):
            init_file = Path(directory) / '__init__.py'
            if not init_file.exists():
                init_file.touch()
    
    print("✅ Directory structure created")

def setup_virtual_environment():
    """Set up Python virtual environment"""
    if not Path('venv').exists():
        return run_command('python -m venv venv', 'Creating virtual environment')
    else:
        print("✅ Virtual environment already exists")
        return True

def install_dependencies():
    """Install Python dependencies"""
    # Determine the correct pip command based on OS
    pip_cmd = 'venv/bin/pip' if os.name != 'nt' else 'venv\\Scripts\\pip'
    
    commands = [
        f'{pip_cmd} install --upgrade pip',
        f'{pip_cmd} install -r requirements.txt'
    ]
    
    for cmd in commands:
        if not run_command(cmd, f'Running: {cmd}'):
            return False
    return True

def setup_database():
    """Initialize database and migrations"""
    # Determine the correct python command based on OS
    python_cmd = 'venv/bin/python' if os.name != 'nt' else 'venv\\Scripts\\python'
    
    commands = [
        f'{python_cmd} -c "from app import create_app, db; app = create_app(); app.app_context().push(); db.create_all(); print(\'Database tables created\')"',
    ]
    
    for cmd in commands:
        if not run_command(cmd, f'Setting up database'):
            return False
    return True

def create_env_file():
    """Create .env file if it doesn't exist"""
    env_file = Path('.env')
    if not env_file.exists():
        env_template = """# Memoras Backend Environment Variables
FLASK_APP=run.py
FLASK_ENV=development
SECRET_KEY=dev-secret-key-change-in-production
JWT_SECRET_KEY=jwt-secret-change-in-production

# Database (SQLite for development)
DATABASE_URL=sqlite:///memoras.db

# File uploads
UPLOAD_FOLDER=uploads
MAX_CONTENT_LENGTH=16777216

# Frontend URL for CORS
FRONTEND_URL=http://localhost:5173

# Email (optional - configure for production)
# MAIL_SERVER=smtp.gmail.com
# MAIL_PORT=587
# MAIL_USERNAME=your-email@gmail.com
# MAIL_PASSWORD=your-app-password
"""
        env_file.write_text(env_template)
        print("✅ Created .env file with default settings")
    else:
        print("✅ .env file already exists")

def main():
    """Main setup function"""
    print("🚀 Setting up Memoras Flask Backend...")
    
    # Check Python version
    check_python_version()
    
    # Create directory structure
    create_directory_structure()
    
    # Create .env file
    create_env_file()
    
    # Set up virtual environment
    if not setup_virtual_environment():
        print("❌ Failed to set up virtual environment")
        return
    
    # Install dependencies
    if not install_dependencies():
        print("❌ Failed to install dependencies")
        return
    
    # Set up database
    if not setup_database():
        print("❌ Failed to set up database")
        return
    
    print("\n🎉 Setup completed successfully!")
    print("\nNext steps:")
    print("1. Activate virtual environment:")
    if os.name != 'nt':
        print("   source venv/bin/activate")
    else:
        print("   venv\\Scripts\\activate")
    
    print("2. Start the development server:")
    print("   python run.py")
    
    print("3. The API will be available at: http://localhost:5000")
    print("4. Health check endpoint: http://localhost:5000/health")
    
    print("\n📝 Don't forget to:")
    print("- Update the .env file with your actual configuration")
    print("- Set up PostgreSQL for production")
    print("- Configure email settings for notifications")

if __name__ == '__main__':
    main()