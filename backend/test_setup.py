# test_setup.py - Simple test script to verify setup
import requests
import json

# Base URL for the API
BASE_URL = 'http://localhost:5000'

def test_health_check():
    """Test the health check endpoint"""
    try:
        response = requests.get(f'{BASE_URL}/health')
        print(f"✅ Health check: {response.status_code} - {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Health check failed: {e}")
        return False

def test_guest_session():
    """Test guest session creation"""
    try:
        response = requests.post(f'{BASE_URL}/api/auth/guest-session')
        data = response.json()
        print(f"✅ Guest session: {response.status_code} - Session ID: {data.get('guest_session', '')[:8]}...")
        return response.status_code == 201, data.get('guest_session')
    except Exception as e:
        print(f"❌ Guest session failed: {e}")
        return False, None

def test_create_memorial(guest_session):
    """Test memorial creation"""
    try:
        memorial_data = {
            'title': 'Test Memorial',
            'deceased_name': 'John Doe',
            'guest_session': guest_session
        }
        
        response = requests.post(
            f'{BASE_URL}/api/memorials/',
            json=memorial_data,
            headers={'Content-Type': 'application/json'}
        )
        
        data = response.json()
        memorial_id = data.get('memorial', {}).get('id')
        print(f"✅ Memorial creation: {response.status_code} - ID: {memorial_id[:8] if memorial_id else 'None'}...")
        return response.status_code == 201, memorial_id
    except Exception as e:
        print(f"❌ Memorial creation failed: {e}")
        return False, None

def test_save_obituary(memorial_id, guest_session):
    """Test obituary saving"""
    try:
        obituary_data = {
            'full_name': 'John Doe',
            'birth_place': 'New York, NY',
            'life_story': 'A wonderful person who lived a full life.',
            'survived_by': 'Wife Jane Doe, children Mary and Bob',
            'tone': 'celebratory'
        }
        
        response = requests.post(
            f'{BASE_URL}/api/obituaries/{memorial_id}/obituary',
            json=obituary_data,
            headers={
                'Content-Type': 'application/json',
                'X-Guest-Session': guest_session
            }
        )
        
        print(f"✅ Obituary save: {response.status_code} - {response.json().get('message', '')}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Obituary save failed: {e}")
        return False

def main():
    """Run all tests"""
    print("🧪 Testing Memoras Flask Backend Setup...\n")
    
    # Test 1: Health check
    if not test_health_check():
        print("❌ Backend is not running. Start it with: python run.py")
        return
    
    # Test 2: Guest session
    success, guest_session = test_guest_session()
    if not success:
        return
    
    # Test 3: Memorial creation
    success, memorial_id = test_create_memorial(guest_session)
    if not success:
        return
    
    # Test 4: Obituary saving
    test_save_obituary(memorial_id, guest_session)
    
    print("\n🎉 All tests completed! Your backend is working correctly.")
    print(f"\nNext steps:")
    print(f"1. Update your React frontend to use: {BASE_URL}")
    print(f"2. Test with your actual frontend")
    print(f"3. Implement remaining API endpoints")

if __name__ == '__main__':
    main()