from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import bcrypt
import jwt

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Config
JWT_SECRET = os.environ.get('JWT_SECRET', 'restfulmind-secret-key-change-in-production')
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 24

# Create the main app
app = FastAPI(title="RestfulMind API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

security = HTTPBearer()

# ============ MODELS ============

class UserBase(BaseModel):
    email: EmailStr
    name: str

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(UserBase):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    role: str = "admin"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict

class CategoryBase(BaseModel):
    name: str
    slug: str
    description: str
    image_url: Optional[str] = None
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None

class Category(CategoryBase):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ArticleBase(BaseModel):
    title: str
    slug: str
    excerpt: str
    content: str
    category_id: str
    featured_image: Optional[str] = None
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    is_featured: bool = False
    is_published: bool = True
    reading_time: int = 5
    whats_new: Optional[str] = None

class ArticleCreate(ArticleBase):
    pass

class ArticleUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    excerpt: Optional[str] = None
    content: Optional[str] = None
    category_id: Optional[str] = None
    featured_image: Optional[str] = None
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    is_featured: Optional[bool] = None
    is_published: Optional[bool] = None
    reading_time: Optional[int] = None
    whats_new: Optional[str] = None

class Article(ArticleBase):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    views: int = 0

class SubscriberBase(BaseModel):
    email: EmailStr
    interests: List[str] = []
    gdpr_consent: bool = True

class SubscriberCreate(SubscriberBase):
    pass

class Subscriber(SubscriberBase):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    subscribed_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    is_active: bool = True

# ============ AUTH HELPERS ============

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRATION_HOURS)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user = await db.users.find_one({"id": payload["sub"]}, {"_id": 0})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

# ============ AUTH ROUTES ============

@api_router.post("/auth/register", response_model=TokenResponse)
async def register(user_data: UserCreate):
    existing = await db.users.find_one({"email": user_data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user = User(email=user_data.email, name=user_data.name)
    user_dict = user.model_dump()
    user_dict['password_hash'] = hash_password(user_data.password)
    user_dict['created_at'] = user_dict['created_at'].isoformat()
    
    await db.users.insert_one(user_dict)
    token = create_token(user.id, user.email)
    
    return TokenResponse(
        access_token=token,
        user={"id": user.id, "email": user.email, "name": user.name, "role": user.role}
    )

@api_router.post("/auth/login", response_model=TokenResponse)
async def login(credentials: UserLogin):
    user = await db.users.find_one({"email": credentials.email}, {"_id": 0})
    if not user or not verify_password(credentials.password, user.get('password_hash', '')):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_token(user['id'], user['email'])
    return TokenResponse(
        access_token=token,
        user={"id": user['id'], "email": user['email'], "name": user['name'], "role": user['role']}
    )

@api_router.get("/auth/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    return {"id": current_user['id'], "email": current_user['email'], "name": current_user['name'], "role": current_user['role']}

# ============ CATEGORY ROUTES ============

@api_router.get("/categories", response_model=List[Category])
async def get_categories():
    categories = await db.categories.find({}, {"_id": 0}).to_list(100)
    for cat in categories:
        if isinstance(cat.get('created_at'), str):
            cat['created_at'] = datetime.fromisoformat(cat['created_at'])
    return categories

@api_router.get("/categories/{slug}")
async def get_category(slug: str):
    category = await db.categories.find_one({"slug": slug}, {"_id": 0})
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    if isinstance(category.get('created_at'), str):
        category['created_at'] = datetime.fromisoformat(category['created_at'])
    return category

@api_router.post("/categories", response_model=Category)
async def create_category(category_data: CategoryBase, current_user: dict = Depends(get_current_user)):
    category = Category(**category_data.model_dump())
    cat_dict = category.model_dump()
    cat_dict['created_at'] = cat_dict['created_at'].isoformat()
    await db.categories.insert_one(cat_dict)
    return category

@api_router.put("/categories/{category_id}", response_model=Category)
async def update_category(category_id: str, category_data: CategoryBase, current_user: dict = Depends(get_current_user)):
    result = await db.categories.update_one(
        {"id": category_id},
        {"$set": category_data.model_dump()}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Category not found")
    category = await db.categories.find_one({"id": category_id}, {"_id": 0})
    return category

@api_router.delete("/categories/{category_id}")
async def delete_category(category_id: str, current_user: dict = Depends(get_current_user)):
    result = await db.categories.delete_one({"id": category_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Category not found")
    return {"message": "Category deleted"}

# ============ ARTICLE ROUTES ============

@api_router.get("/articles", response_model=List[Article])
async def get_articles(
    category: Optional[str] = None,
    featured: Optional[bool] = None,
    limit: int = 50,
    skip: int = 0
):
    query = {"is_published": True}
    if category:
        cat = await db.categories.find_one({"slug": category}, {"_id": 0})
        if cat:
            query["category_id"] = cat['id']
    if featured is not None:
        query["is_featured"] = featured
    
    articles = await db.articles.find(query, {"_id": 0}).sort("created_at", -1).skip(skip).limit(limit).to_list(limit)
    for art in articles:
        if isinstance(art.get('created_at'), str):
            art['created_at'] = datetime.fromisoformat(art['created_at'])
        if isinstance(art.get('updated_at'), str):
            art['updated_at'] = datetime.fromisoformat(art['updated_at'])
    return articles

@api_router.get("/articles/weekly-updates", response_model=List[Article])
async def get_weekly_updates():
    one_week_ago = (datetime.now(timezone.utc) - timedelta(days=7)).isoformat()
    articles = await db.articles.find(
        {"is_published": True, "updated_at": {"$gte": one_week_ago}},
        {"_id": 0}
    ).sort("updated_at", -1).to_list(50)
    for art in articles:
        if isinstance(art.get('created_at'), str):
            art['created_at'] = datetime.fromisoformat(art['created_at'])
        if isinstance(art.get('updated_at'), str):
            art['updated_at'] = datetime.fromisoformat(art['updated_at'])
    return articles

@api_router.get("/articles/all", response_model=List[Article])
async def get_all_articles(current_user: dict = Depends(get_current_user)):
    articles = await db.articles.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    for art in articles:
        if isinstance(art.get('created_at'), str):
            art['created_at'] = datetime.fromisoformat(art['created_at'])
        if isinstance(art.get('updated_at'), str):
            art['updated_at'] = datetime.fromisoformat(art['updated_at'])
    return articles

@api_router.get("/articles/{slug}")
async def get_article(slug: str):
    article = await db.articles.find_one({"slug": slug}, {"_id": 0})
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    
    # Increment views
    await db.articles.update_one({"slug": slug}, {"$inc": {"views": 1}})
    
    if isinstance(article.get('created_at'), str):
        article['created_at'] = datetime.fromisoformat(article['created_at'])
    if isinstance(article.get('updated_at'), str):
        article['updated_at'] = datetime.fromisoformat(article['updated_at'])
    
    # Get category info
    category = await db.categories.find_one({"id": article['category_id']}, {"_id": 0})
    article['category'] = category
    
    return article

@api_router.post("/articles", response_model=Article)
async def create_article(article_data: ArticleCreate, current_user: dict = Depends(get_current_user)):
    article = Article(**article_data.model_dump())
    art_dict = article.model_dump()
    art_dict['created_at'] = art_dict['created_at'].isoformat()
    art_dict['updated_at'] = art_dict['updated_at'].isoformat()
    await db.articles.insert_one(art_dict)
    return article

@api_router.put("/articles/{article_id}", response_model=Article)
async def update_article(article_id: str, article_data: ArticleUpdate, current_user: dict = Depends(get_current_user)):
    update_dict = {k: v for k, v in article_data.model_dump().items() if v is not None}
    update_dict['updated_at'] = datetime.now(timezone.utc).isoformat()
    
    result = await db.articles.update_one(
        {"id": article_id},
        {"$set": update_dict}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Article not found")
    
    article = await db.articles.find_one({"id": article_id}, {"_id": 0})
    if isinstance(article.get('created_at'), str):
        article['created_at'] = datetime.fromisoformat(article['created_at'])
    if isinstance(article.get('updated_at'), str):
        article['updated_at'] = datetime.fromisoformat(article['updated_at'])
    return article

@api_router.delete("/articles/{article_id}")
async def delete_article(article_id: str, current_user: dict = Depends(get_current_user)):
    result = await db.articles.delete_one({"id": article_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Article not found")
    return {"message": "Article deleted"}

# ============ SUBSCRIBER ROUTES ============

@api_router.post("/subscribers", response_model=Subscriber)
async def create_subscriber(subscriber_data: SubscriberCreate):
    existing = await db.subscribers.find_one({"email": subscriber_data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already subscribed")
    
    subscriber = Subscriber(**subscriber_data.model_dump())
    sub_dict = subscriber.model_dump()
    sub_dict['subscribed_at'] = sub_dict['subscribed_at'].isoformat()
    await db.subscribers.insert_one(sub_dict)
    return subscriber

@api_router.get("/subscribers", response_model=List[Subscriber])
async def get_subscribers(
    interest: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    query = {"is_active": True}
    if interest:
        query["interests"] = interest
    
    subscribers = await db.subscribers.find(query, {"_id": 0}).to_list(1000)
    for sub in subscribers:
        if isinstance(sub.get('subscribed_at'), str):
            sub['subscribed_at'] = datetime.fromisoformat(sub['subscribed_at'])
    return subscribers

@api_router.get("/subscribers/stats")
async def get_subscriber_stats(current_user: dict = Depends(get_current_user)):
    total = await db.subscribers.count_documents({"is_active": True})
    
    # Get counts by interest
    pipeline = [
        {"$match": {"is_active": True}},
        {"$unwind": "$interests"},
        {"$group": {"_id": "$interests", "count": {"$sum": 1}}}
    ]
    interest_stats = await db.subscribers.aggregate(pipeline).to_list(100)
    
    return {
        "total": total,
        "by_interest": {stat['_id']: stat['count'] for stat in interest_stats}
    }

@api_router.delete("/subscribers/{subscriber_id}")
async def unsubscribe(subscriber_id: str, current_user: dict = Depends(get_current_user)):
    result = await db.subscribers.update_one(
        {"id": subscriber_id},
        {"$set": {"is_active": False}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Subscriber not found")
    return {"message": "Unsubscribed successfully"}

# ============ STATIC CONTENT ROUTES ============

@api_router.get("/content/{page_type}")
async def get_static_content(page_type: str):
    content = await db.static_content.find_one({"type": page_type}, {"_id": 0})
    if not content:
        # Return default content
        defaults = {
            "privacy": {
                "type": "privacy",
                "title": "Privacy Policy",
                "content": get_default_privacy_policy()
            },
            "terms": {
                "type": "terms",
                "title": "Terms of Service",
                "content": get_default_terms()
            },
            "disclaimer": {
                "type": "disclaimer",
                "title": "Disclaimer",
                "content": get_default_disclaimer()
            }
        }
        return defaults.get(page_type, {"type": page_type, "title": page_type.title(), "content": ""})
    return content

# ============ STATS ROUTES ============

@api_router.get("/stats/dashboard")
async def get_dashboard_stats(current_user: dict = Depends(get_current_user)):
    total_articles = await db.articles.count_documents({})
    published_articles = await db.articles.count_documents({"is_published": True})
    total_subscribers = await db.subscribers.count_documents({"is_active": True})
    total_views = await db.articles.aggregate([{"$group": {"_id": None, "total": {"$sum": "$views"}}}]).to_list(1)
    
    return {
        "total_articles": total_articles,
        "published_articles": published_articles,
        "total_subscribers": total_subscribers,
        "total_views": total_views[0]['total'] if total_views else 0
    }

# ============ HEALTH CHECK ============

@api_router.get("/")
async def root():
    return {"message": "RestfulMind API", "status": "healthy"}

@api_router.get("/health")
async def health():
    return {"status": "healthy"}

# ============ DEFAULT CONTENT FUNCTIONS ============

def get_default_privacy_policy():
    return """
## Introduction
RestfulMind ("we," "our," or "us") respects your privacy and is committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you visit our website.

## Information We Collect
- **Email Address**: When you subscribe to our newsletter
- **Usage Data**: Pages visited, time spent, and general browsing patterns
- **Device Information**: Browser type, operating system, and device identifiers

## How We Use Your Information
- To send you our weekly newsletter (with your consent)
- To improve our website content and user experience
- To analyze website traffic and trends

## Your Rights (GDPR)
Under the General Data Protection Regulation (GDPR), you have the right to:
- Access your personal data
- Rectify inaccurate data
- Request deletion of your data
- Withdraw consent at any time
- Lodge a complaint with a supervisory authority

## Newsletter & Email
By subscribing to our newsletter, you consent to receive weekly emails about sleep, mental health, and productivity. You can unsubscribe at any time by clicking the unsubscribe link in any email.

## Cookies
We use cookies to enhance your browsing experience. These include:
- Essential cookies for site functionality
- Analytics cookies to understand site usage

## Data Retention
We retain your email address until you unsubscribe. Usage data is retained for 26 months.

## Contact Us
For privacy-related inquiries, please contact us through our Contact page.

*Last updated: December 2025*
"""

def get_default_terms():
    return """
## Acceptance of Terms
By accessing RestfulMind, you agree to be bound by these Terms of Service.

## Use of Content
- All content is for informational purposes only
- You may share our content with attribution
- Commercial use requires written permission

## User Conduct
You agree not to:
- Misuse the website or its content
- Attempt to gain unauthorized access
- Use automated systems to access the site

## Intellectual Property
All content, including articles, images, and design, is owned by RestfulMind and protected by copyright laws.

## Disclaimer
The information provided is for general informational purposes only. We are not medical professionals and our content does not constitute medical advice.

## Limitation of Liability
RestfulMind shall not be liable for any indirect, incidental, or consequential damages arising from your use of the website.

## Changes to Terms
We reserve the right to modify these terms at any time. Continued use of the site constitutes acceptance of updated terms.

## Governing Law
These terms are governed by applicable laws and regulations.

*Last updated: December 2025*
"""

def get_default_disclaimer():
    return """
## Medical Disclaimer
**RestfulMind provides general information about sleep, mental health, and productivity for educational purposes only.**

## Not Medical Advice
The content on this website:
- Is NOT intended as a substitute for professional medical advice
- Should NOT be used for diagnosing or treating health problems
- Does NOT create a doctor-patient relationship

## Consult a Professional
Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay in seeking it because of something you have read on this website.

## No Guarantees
While we strive to provide accurate and up-to-date information:
- We make no guarantees about the completeness or accuracy of the content
- Results from following suggestions may vary
- Individual circumstances differ

## Emergency Situations
If you think you may have a medical emergency, call your doctor or emergency services immediately.

## External Links
Links to external websites are provided for convenience. We are not responsible for the content of external sites.

*This disclaimer applies to all content on RestfulMind.*
"""

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
