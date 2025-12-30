#!/usr/bin/env python3
import requests
import sys
import json
from datetime import datetime

class RestfulMindAPITester:
    def __init__(self, base_url="https://sleepmindboost.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_base = f"{base_url}/api"
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []
        self.admin_credentials = {
            "email": "admin@restfulmind.com",
            "password": "admin123"
        }

    def log_test(self, name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name}")
        else:
            print(f"❌ {name} - {details}")
            self.failed_tests.append({"test": name, "error": details})

    def make_request(self, method, endpoint, data=None, expected_status=200):
        """Make API request with error handling"""
        url = f"{self.api_base}/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        if self.token:
            headers['Authorization'] = f'Bearer {self.token}'

        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=10)

            success = response.status_code == expected_status
            return success, response.json() if response.content else {}, response.status_code

        except requests.exceptions.RequestException as e:
            return False, {"error": str(e)}, 0

    def test_health_check(self):
        """Test API health endpoints"""
        print("\n🔍 Testing Health Endpoints...")
        
        # Test root endpoint
        success, data, status = self.make_request('GET', '')
        self.log_test("Root endpoint (/api/)", success and data.get('message') == 'RestfulMind API')
        
        # Test health endpoint
        success, data, status = self.make_request('GET', 'health')
        self.log_test("Health endpoint (/api/health)", success and data.get('status') == 'healthy')

    def test_admin_login(self):
        """Test admin authentication"""
        print("\n🔍 Testing Admin Authentication...")
        
        success, data, status = self.make_request(
            'POST', 
            'auth/login', 
            self.admin_credentials
        )
        
        if success and 'access_token' in data:
            self.token = data['access_token']
            self.log_test("Admin login", True)
            
            # Test token validation
            success, user_data, status = self.make_request('GET', 'auth/me')
            self.log_test("Token validation (/auth/me)", success and user_data.get('email') == self.admin_credentials['email'])
            
            return True
        else:
            self.log_test("Admin login", False, f"Status: {status}, Data: {data}")
            return False

    def test_categories_api(self):
        """Test categories endpoints"""
        print("\n🔍 Testing Categories API...")
        
        # Get all categories
        success, data, status = self.make_request('GET', 'categories')
        categories_count = len(data) if success else 0
        self.log_test("Get categories", success and categories_count > 0, f"Found {categories_count} categories")
        
        if success and data:
            # Test individual category by slug
            first_category = data[0]
            if 'slug' in first_category:
                success, cat_data, status = self.make_request('GET', f"categories/{first_category['slug']}")
                self.log_test(f"Get category by slug ({first_category['slug']})", success and cat_data.get('id') == first_category['id'])

    def test_articles_api(self):
        """Test articles endpoints"""
        print("\n🔍 Testing Articles API...")
        
        # Get all articles
        success, data, status = self.make_request('GET', 'articles')
        articles_count = len(data) if success else 0
        self.log_test("Get articles", success and articles_count > 0, f"Found {articles_count} articles")
        
        # Get featured articles
        success, featured_data, status = self.make_request('GET', 'articles?featured=true')
        featured_count = len(featured_data) if success else 0
        self.log_test("Get featured articles", success, f"Found {featured_count} featured articles")
        
        # Get weekly updates
        success, weekly_data, status = self.make_request('GET', 'articles/weekly-updates')
        weekly_count = len(weekly_data) if success else 0
        self.log_test("Get weekly updates", success, f"Found {weekly_count} weekly updates")
        
        if success and data:
            # Test individual article by slug
            first_article = data[0]
            if 'slug' in first_article:
                success, art_data, status = self.make_request('GET', f"articles/{first_article['slug']}")
                self.log_test(f"Get article by slug ({first_article['slug']})", success and art_data.get('id') == first_article['id'])

    def test_admin_articles_api(self):
        """Test admin articles endpoints (requires auth)"""
        if not self.token:
            print("\n⚠️  Skipping admin articles tests - no auth token")
            return
            
        print("\n🔍 Testing Admin Articles API...")
        
        # Get all articles (admin view)
        success, data, status = self.make_request('GET', 'articles/all')
        admin_articles_count = len(data) if success else 0
        self.log_test("Get all articles (admin)", success and admin_articles_count > 0, f"Found {admin_articles_count} articles")

    def test_subscribers_api(self):
        """Test subscribers endpoints"""
        print("\n🔍 Testing Subscribers API...")
        
        # Test newsletter subscription
        test_subscriber = {
            "email": f"test_{datetime.now().strftime('%H%M%S')}@example.com",
            "interests": ["sleep-rest", "mental-health"],
            "gdpr_consent": True
        }
        
        success, data, status = self.make_request('POST', 'subscribers', test_subscriber, 200)
        self.log_test("Create subscriber", success, f"Status: {status}")
        
        if not self.token:
            print("⚠️  Skipping admin subscriber tests - no auth token")
            return
            
        # Get subscribers (admin only)
        success, subs_data, status = self.make_request('GET', 'subscribers')
        subs_count = len(subs_data) if success else 0
        self.log_test("Get subscribers (admin)", success, f"Found {subs_count} subscribers")
        
        # Get subscriber stats
        success, stats_data, status = self.make_request('GET', 'subscribers/stats')
        self.log_test("Get subscriber stats", success and 'total' in stats_data)

    def test_static_content_api(self):
        """Test static content endpoints"""
        print("\n🔍 Testing Static Content API...")
        
        pages = ['privacy', 'terms', 'disclaimer']
        for page in pages:
            success, data, status = self.make_request('GET', f'content/{page}')
            self.log_test(f"Get {page} page content", success and data.get('type') == page)

    def test_dashboard_stats(self):
        """Test dashboard stats (admin only)"""
        if not self.token:
            print("\n⚠️  Skipping dashboard stats test - no auth token")
            return
            
        print("\n🔍 Testing Dashboard Stats...")
        
        success, data, status = self.make_request('GET', 'stats/dashboard')
        required_fields = ['total_articles', 'published_articles', 'total_subscribers', 'total_views']
        has_all_fields = all(field in data for field in required_fields) if success else False
        self.log_test("Get dashboard stats", success and has_all_fields, f"Data: {data}")

    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting RestfulMind API Tests...")
        print(f"Testing against: {self.base_url}")
        
        # Run tests in order
        self.test_health_check()
        
        # Login first for authenticated tests
        login_success = self.test_admin_login()
        
        # Public API tests
        self.test_categories_api()
        self.test_articles_api()
        self.test_subscribers_api()
        self.test_static_content_api()
        
        # Admin API tests (if login successful)
        if login_success:
            self.test_admin_articles_api()
            self.test_dashboard_stats()
        
        # Print summary
        print(f"\n📊 Test Results: {self.tests_passed}/{self.tests_run} passed")
        
        if self.failed_tests:
            print("\n❌ Failed Tests:")
            for test in self.failed_tests:
                print(f"  - {test['test']}: {test['error']}")
        
        return self.tests_passed == self.tests_run

def main():
    tester = RestfulMindAPITester()
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())