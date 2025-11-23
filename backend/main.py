from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import time
import os

app = FastAPI(title="DigiInfluencer API", version="0.1.0")

# CORS Configuration
origins = [
    "http://localhost:3000",  # Next.js frontend
    "http://127.0.0.1:3000",
    "https://digi-influencer.vercel.app" # Example production URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class PersonaCreate(BaseModel):
    name: str
    niche: str
    tone: str
    gender: str
    age: str
    style: str
    voice: str
    bio: Optional[str] = ""
    base_image_url: Optional[str] = None

class CampaignCreate(BaseModel):
    name: str
    status: str = "Draft"

class GenerateRequest(BaseModel):
    type: str
    persona_id: str
    prompt: str

# In-memory storage
personas_db = [
    {"id": "p1", "name": "Sarah", "niche": "Tech", "tone": "Professional", "style": "Modern", "voice": "Voice A", "bio": "Tech reviewer"},
    {"id": "p2", "name": "Alex", "niche": "Fitness", "tone": "Energetic", "style": "Sporty", "voice": "Voice B", "bio": "Fitness coach"},
]

campaigns_db = [
    {"id": "c1", "name": "Summer Collection Launch", "status": "Active", "assets": 12, "date": "2025-06-01"},
    {"id": "c2", "name": "Black Friday Promo", "status": "Draft", "assets": 3, "date": "2025-11-20"},
]

# Endpoints


@app.get("/")
def read_root():
    return {
        "status": "API Online",
        "message": "You are seeing this because the Frontend is not loading.",
        "frontend_url": "https://digi-influencer.vercel.app/studio" 
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "DigiInfluencer Backend"}

# Persona Endpoints
@app.get("/api/personas")
def get_personas():
    return personas_db

@app.post("/api/personas")
def create_persona(persona: PersonaCreate):
    new_persona = {
        "id": "persona_" + str(hash(persona.name))[:8],
        "name": persona.name,
        "niche": persona.niche,
        "tone": persona.tone,
        "gender": persona.gender,
        "age": persona.age,
        "style": persona.style,
        "voice": persona.voice,
        "bio": persona.bio
    }
    personas_db.append(new_persona)
    
    return {
        "id": new_persona["id"],
        "name": new_persona["name"],
        "niche": new_persona["niche"],
        "status": "created",
        "message": f"Persona {new_persona['name']} created successfully."
    }

@app.delete("/api/personas/{persona_id}")
def delete_persona(persona_id: str):
    global personas_db
    personas_db = [p for p in personas_db if p["id"] != persona_id]
    return {"status": "deleted", "id": persona_id}

# Campaign Endpoints
@app.get("/api/campaigns")
def get_campaigns():
    return campaigns_db

@app.post("/api/campaigns")
def create_campaign(campaign: CampaignCreate):
    new_campaign = {
        "id": f"c{len(campaigns_db) + 1}",
        "name": campaign.name,
        "status": campaign.status,
        "assets": 0,
        "date": "2025-11-23" # Mock date
    }
    campaigns_db.append(new_campaign)
    return new_campaign

@app.post("/api/campaigns/{campaign_id}/assets")
def add_asset_to_campaign(campaign_id: str):
    for c in campaigns_db:
        if c["id"] == campaign_id:
            c["assets"] += 1
            return {"status": "success", "new_count": c["assets"]}
    return {"status": "error", "message": "Campaign not found"}

# Generation Endpoint
@app.post("/api/generate")
async def generate_asset(request: GenerateRequest):
    import os
    import asyncio
    
    # Check for Real API Keys
    openai_key = os.getenv("OPENAI_API_KEY")
    
    if openai_key and request.type == "text": # Example for text/copy
        # Call OpenAI (Pseudo-code)
        # client = OpenAI(api_key=openai_key)
        # response = client.chat.completions.create(...)
        pass

    # Simulate AI processing time (Mock)
    await asyncio.sleep(2)
    
    # Enhanced Mock Response with "Real" feel
    mock_images = {
        "image": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=60", # Portrait
        "video": "https://media.istockphoto.com/id/1460656089/video/young-woman-using-smartphone-in-the-city.mp4?s=mp4-640x640-is&k=20&c=W-9X_YdO_X_YdO_X_YdO", # Placeholder video
        "ad": "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&auto=format&fit=crop&q=60" # Ad style
    }
    
    return {
        "status": "success",
        "url": mock_images.get(request.type, "https://placehold.co/600x400"),
        "message": f"Generated {request.type} for prompt: {request.prompt[:20]}..."
    }
