from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

import os
import logging
import uuid
import bcrypt
import jwt
from datetime import datetime, timezone, timedelta
from typing import List, Optional, Literal

from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, EmailStr

# --- Config ---
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

JWT_SECRET = os.environ['JWT_SECRET']
JWT_ALGO = "HS256"
ACCESS_TOKEN_MINUTES = 60 * 12  # 12h admin session

app = FastAPI(title="Radharani Tours & Travels API")
api = APIRouter(prefix="/api")

# --- Auth helpers ---
def hash_password(pw: str) -> str:
    return bcrypt.hashpw(pw.encode(), bcrypt.gensalt()).decode()

def verify_password(pw: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(pw.encode(), hashed.encode())
    except Exception:
        return False

def create_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_MINUTES),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGO)

async def get_admin(request: Request) -> dict:
    auth = request.headers.get("Authorization", "")
    token = auth[7:] if auth.startswith("Bearer ") else None
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGO])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Session expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = await db.users.find_one({"id": payload["sub"]}, {"_id": 0, "password_hash": 0})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user

# --- Models ---
def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()

class LoginIn(BaseModel):
    email: EmailStr
    password: str

class Vehicle(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    image: str = ""
    registration_number: str = ""
    passenger_capacity: int = 4
    luggage_capacity: str = "2 bags"
    ac: bool = True
    description: str = ""
    status: Literal["available", "booked", "unavailable", "maintenance"] = "available"
    active: bool = True
    created_at: str = Field(default_factory=now_iso)

class VehicleIn(BaseModel):
    name: str
    image: Optional[str] = ""
    registration_number: Optional[str] = ""
    passenger_capacity: Optional[int] = 4
    luggage_capacity: Optional[str] = "2 bags"
    ac: Optional[bool] = True
    description: Optional[str] = ""
    status: Optional[str] = "available"
    active: Optional[bool] = True

class Destination(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: str = ""
    image: str = ""
    places: List[str] = []
    active: bool = True
    created_at: str = Field(default_factory=now_iso)

class DestinationIn(BaseModel):
    name: str
    description: Optional[str] = ""
    image: Optional[str] = ""
    places: Optional[List[str]] = []
    active: Optional[bool] = True

class TourPackage(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    destination: str = ""
    duration: str = "1 Day"
    starting_price: float = 0
    description: str = ""
    places_covered: List[str] = []
    image: str = ""
    active: bool = True
    created_at: str = Field(default_factory=now_iso)

class TourPackageIn(BaseModel):
    name: str
    destination: Optional[str] = ""
    duration: Optional[str] = "1 Day"
    starting_price: Optional[float] = 0
    description: Optional[str] = ""
    places_covered: Optional[List[str]] = []
    image: Optional[str] = ""
    active: Optional[bool] = True

class RoomType(BaseModel):
    name: str = "Standard Room"
    price_per_night: float = 0
    capacity: int = 2
    amenities: List[str] = []

class Hotel(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    location: str = ""
    address: str = ""
    image: str = ""
    gallery: List[str] = []
    description: str = ""
    highlights: List[str] = []
    amenities: List[str] = []
    room_types: List[RoomType] = []
    nearby_attractions: List[str] = []
    starting_price: float = 0
    rating: float = 4.5
    check_in: str = "12:00 PM"
    check_out: str = "11:00 AM"
    active: bool = True
    created_at: str = Field(default_factory=now_iso)

class HotelIn(BaseModel):
    name: str
    location: Optional[str] = ""
    address: Optional[str] = ""
    image: Optional[str] = ""
    gallery: Optional[List[str]] = []
    description: Optional[str] = ""
    highlights: Optional[List[str]] = []
    amenities: Optional[List[str]] = []
    room_types: Optional[List[RoomType]] = []
    nearby_attractions: Optional[List[str]] = []
    starting_price: Optional[float] = 0
    rating: Optional[float] = 4.5
    check_in: Optional[str] = "12:00 PM"
    check_out: Optional[str] = "11:00 AM"
    active: Optional[bool] = True


class Review(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    customer_name: str
    review: str
    rating: int = 5
    approved: bool = False
    location: str = ""
    created_at: str = Field(default_factory=now_iso)

class ReviewIn(BaseModel):
    customer_name: str
    review: str
    rating: Optional[int] = 5
    approved: Optional[bool] = False
    location: Optional[str] = ""

class BookingIn(BaseModel):
    full_name: str
    mobile: str
    email: Optional[str] = ""
    pickup: str
    destination: str
    travel_date: str
    pickup_time: str
    trip_type: str
    passengers: int = 1
    vehicle_id: Optional[str] = ""
    vehicle_name: Optional[str] = ""
    return_date: Optional[str] = ""
    return_time: Optional[str] = ""
    special_requirements: Optional[str] = ""

class BookingStatusIn(BaseModel):
    status: Literal["pending", "confirmed", "assigned", "completed", "cancelled"]
    vehicle_id: Optional[str] = None
    vehicle_name: Optional[str] = None
    admin_notes: Optional[str] = None

class GalleryImage(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    url: str
    category: str = "Tours"
    caption: str = ""
    created_at: str = Field(default_factory=now_iso)

class GalleryIn(BaseModel):
    url: str
    category: Optional[str] = "Tours"
    caption: Optional[str] = ""

class ContactMessageIn(BaseModel):
    name: str
    email: Optional[str] = ""
    phone: Optional[str] = ""
    message: str

class Settings(BaseModel):
    business_name: str = "Radharani Tours & Travels"
    tagline: str = "Your Journey, Our Responsibility"
    hero_description: str = "Comfortable, reliable and convenient taxi and tour services for Mathura, Vrindavan, Agra, Delhi and outstation destinations."
    about_text: str = "Radharani Tours & Travels provides convenient taxi and tour services for customers traveling around Mathura, Vrindavan, Agra, Delhi and other destinations."
    phone: str = "+91-XXXXXXXXXX"
    whatsapp: str = "+91-XXXXXXXXXX"
    email: str = "contact@radharanitours.com"
    address: str = "Mathura, Uttar Pradesh, India"
    business_hours: str = "24 x 7 Available"
    service_area: str = "Mathura, Vrindavan, Agra, Delhi & Outstation"
    instagram: str = ""
    facebook: str = ""
    youtube: str = ""
    google_maps_embed: str = ""
    logo_url: str = ""

# --- Booking ID generator ---
async def generate_booking_id() -> str:
    year = datetime.now(timezone.utc).year
    counter_doc = await db.counters.find_one_and_update(
        {"_id": f"booking_{year}"},
        {"$inc": {"seq": 1}},
        upsert=True,
        return_document=True,
    )
    seq = counter_doc["seq"] if counter_doc else 1
    return f"RRT-{year}-{seq:04d}"

# --- Public endpoints ---
@api.get("/")
async def root():
    return {"message": "Radharani Tours & Travels API"}

@api.get("/settings")
async def get_settings():
    doc = await db.settings.find_one({"_id": "main"}, {"_id": 0})
    return doc or Settings().model_dump()

@api.put("/settings")
async def update_settings(data: Settings, admin: dict = Depends(get_admin)):
    doc = data.model_dump()
    await db.settings.update_one({"_id": "main"}, {"$set": doc}, upsert=True)
    return doc

# Vehicles
@api.get("/vehicles")
async def list_vehicles():
    items = await db.vehicles.find({"active": True}, {"_id": 0}).to_list(200)
    return items

@api.get("/admin/vehicles")
async def admin_list_vehicles(admin: dict = Depends(get_admin)):
    return await db.vehicles.find({}, {"_id": 0}).to_list(500)

@api.post("/admin/vehicles")
async def create_vehicle(data: VehicleIn, admin: dict = Depends(get_admin)):
    v = Vehicle(**data.model_dump())
    await db.vehicles.insert_one(v.model_dump())
    return v.model_dump()

@api.put("/admin/vehicles/{vid}")
async def update_vehicle(vid: str, data: VehicleIn, admin: dict = Depends(get_admin)):
    await db.vehicles.update_one({"id": vid}, {"$set": data.model_dump()})
    doc = await db.vehicles.find_one({"id": vid}, {"_id": 0})
    if not doc:
        raise HTTPException(404, "Vehicle not found")
    return doc

@api.delete("/admin/vehicles/{vid}")
async def delete_vehicle(vid: str, admin: dict = Depends(get_admin)):
    await db.vehicles.delete_one({"id": vid})
    return {"ok": True}

# Destinations
@api.get("/destinations")
async def list_destinations():
    return await db.destinations.find({"active": True}, {"_id": 0}).to_list(200)

@api.get("/admin/destinations")
async def admin_list_destinations(admin: dict = Depends(get_admin)):
    return await db.destinations.find({}, {"_id": 0}).to_list(500)

@api.post("/admin/destinations")
async def create_destination(data: DestinationIn, admin: dict = Depends(get_admin)):
    d = Destination(**data.model_dump())
    await db.destinations.insert_one(d.model_dump())
    return d.model_dump()

@api.put("/admin/destinations/{did}")
async def update_destination(did: str, data: DestinationIn, admin: dict = Depends(get_admin)):
    await db.destinations.update_one({"id": did}, {"$set": data.model_dump()})
    doc = await db.destinations.find_one({"id": did}, {"_id": 0})
    if not doc:
        raise HTTPException(404, "Destination not found")
    return doc

@api.delete("/admin/destinations/{did}")
async def delete_destination(did: str, admin: dict = Depends(get_admin)):
    await db.destinations.delete_one({"id": did})
    return {"ok": True}

# Tour Packages
@api.get("/tours")
async def list_tours():
    return await db.tours.find({"active": True}, {"_id": 0}).to_list(200)

@api.get("/admin/tours")
async def admin_list_tours(admin: dict = Depends(get_admin)):
    return await db.tours.find({}, {"_id": 0}).to_list(500)

@api.post("/admin/tours")
async def create_tour(data: TourPackageIn, admin: dict = Depends(get_admin)):
    t = TourPackage(**data.model_dump())
    await db.tours.insert_one(t.model_dump())
    return t.model_dump()

@api.put("/admin/tours/{tid}")
async def update_tour(tid: str, data: TourPackageIn, admin: dict = Depends(get_admin)):
    await db.tours.update_one({"id": tid}, {"$set": data.model_dump()})
    doc = await db.tours.find_one({"id": tid}, {"_id": 0})
    if not doc:
        raise HTTPException(404, "Tour not found")
    return doc

@api.delete("/admin/tours/{tid}")
async def delete_tour(tid: str, admin: dict = Depends(get_admin)):
    await db.tours.delete_one({"id": tid})
    return {"ok": True}

# Hotels
@api.get("/hotels")
async def list_hotels():
    return await db.hotels.find({"active": True}, {"_id": 0}).sort("created_at", -1).to_list(200)

@api.get("/hotels/{hid}")
async def get_hotel(hid: str):
    doc = await db.hotels.find_one({"id": hid, "active": True}, {"_id": 0})
    if not doc:
        raise HTTPException(404, "Hotel not found")
    return doc

@api.get("/admin/hotels")
async def admin_list_hotels(admin: dict = Depends(get_admin)):
    return await db.hotels.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)

@api.post("/admin/hotels")
async def create_hotel(data: HotelIn, admin: dict = Depends(get_admin)):
    h = Hotel(**data.model_dump())
    await db.hotels.insert_one(h.model_dump())
    return h.model_dump()

@api.put("/admin/hotels/{hid}")
async def update_hotel(hid: str, data: HotelIn, admin: dict = Depends(get_admin)):
    await db.hotels.update_one({"id": hid}, {"$set": data.model_dump()})
    doc = await db.hotels.find_one({"id": hid}, {"_id": 0})
    if not doc:
        raise HTTPException(404, "Hotel not found")
    return doc

@api.delete("/admin/hotels/{hid}")
async def delete_hotel(hid: str, admin: dict = Depends(get_admin)):
    await db.hotels.delete_one({"id": hid})
    return {"ok": True}

# Reviews
@api.get("/reviews")
async def list_reviews():
    return await db.reviews.find({"approved": True}, {"_id": 0}).sort("created_at", -1).to_list(100)

@api.get("/admin/reviews")
async def admin_list_reviews(admin: dict = Depends(get_admin)):
    return await db.reviews.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)

@api.post("/admin/reviews")
async def create_review(data: ReviewIn, admin: dict = Depends(get_admin)):
    r = Review(**data.model_dump())
    await db.reviews.insert_one(r.model_dump())
    return r.model_dump()

@api.put("/admin/reviews/{rid}")
async def update_review(rid: str, data: ReviewIn, admin: dict = Depends(get_admin)):
    await db.reviews.update_one({"id": rid}, {"$set": data.model_dump()})
    doc = await db.reviews.find_one({"id": rid}, {"_id": 0})
    if not doc:
        raise HTTPException(404, "Review not found")
    return doc

@api.delete("/admin/reviews/{rid}")
async def delete_review(rid: str, admin: dict = Depends(get_admin)):
    await db.reviews.delete_one({"id": rid})
    return {"ok": True}

# Gallery
@api.get("/gallery")
async def list_gallery(category: Optional[str] = None):
    q = {"category": category} if category else {}
    return await db.gallery.find(q, {"_id": 0}).sort("created_at", -1).to_list(500)

@api.post("/admin/gallery")
async def create_gallery(data: GalleryIn, admin: dict = Depends(get_admin)):
    g = GalleryImage(**data.model_dump())
    await db.gallery.insert_one(g.model_dump())
    return g.model_dump()

@api.delete("/admin/gallery/{gid}")
async def delete_gallery(gid: str, admin: dict = Depends(get_admin)):
    await db.gallery.delete_one({"id": gid})
    return {"ok": True}

# Bookings
@api.post("/bookings")
async def create_booking(data: BookingIn):
    booking_id = await generate_booking_id()
    # persist customer
    customer = await db.customers.find_one({"mobile": data.mobile}, {"_id": 0})
    if not customer:
        customer = {
            "id": str(uuid.uuid4()),
            "name": data.full_name,
            "mobile": data.mobile,
            "email": data.email or "",
            "created_at": now_iso(),
        }
        await db.customers.insert_one(customer)
    booking = {
        "id": str(uuid.uuid4()),
        "booking_id": booking_id,
        "customer_id": customer["id"],
        "full_name": data.full_name,
        "mobile": data.mobile,
        "email": data.email or "",
        "pickup": data.pickup,
        "destination": data.destination,
        "travel_date": data.travel_date,
        "pickup_time": data.pickup_time,
        "trip_type": data.trip_type,
        "passengers": data.passengers,
        "vehicle_id": data.vehicle_id or "",
        "vehicle_name": data.vehicle_name or "",
        "return_date": data.return_date or "",
        "return_time": data.return_time or "",
        "special_requirements": data.special_requirements or "",
        "status": "pending",
        "admin_notes": "",
        "created_at": now_iso(),
        "updated_at": now_iso(),
    }
    await db.bookings.insert_one(booking)
    booking.pop("_id", None)
    return booking

@api.get("/bookings/{booking_id}")
async def get_booking_by_id(booking_id: str):
    doc = await db.bookings.find_one({"booking_id": booking_id}, {"_id": 0})
    if not doc:
        raise HTTPException(404, "Booking not found")
    return doc

@api.get("/admin/bookings")
async def admin_list_bookings(admin: dict = Depends(get_admin)):
    return await db.bookings.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)

@api.get("/admin/bookings/{bid}")
async def admin_get_booking(bid: str, admin: dict = Depends(get_admin)):
    doc = await db.bookings.find_one({"id": bid}, {"_id": 0})
    if not doc:
        raise HTTPException(404, "Booking not found")
    return doc

@api.patch("/admin/bookings/{bid}")
async def admin_update_booking(bid: str, data: BookingStatusIn, admin: dict = Depends(get_admin)):
    update = {"status": data.status, "updated_at": now_iso()}
    if data.vehicle_id is not None:
        update["vehicle_id"] = data.vehicle_id
    if data.vehicle_name is not None:
        update["vehicle_name"] = data.vehicle_name
    if data.admin_notes is not None:
        update["admin_notes"] = data.admin_notes
    await db.bookings.update_one({"id": bid}, {"$set": update})
    doc = await db.bookings.find_one({"id": bid}, {"_id": 0})
    if not doc:
        raise HTTPException(404, "Booking not found")
    return doc

@api.delete("/admin/bookings/{bid}")
async def admin_delete_booking(bid: str, admin: dict = Depends(get_admin)):
    await db.bookings.delete_one({"id": bid})
    return {"ok": True}

# Customers
@api.get("/admin/customers")
async def admin_list_customers(admin: dict = Depends(get_admin)):
    return await db.customers.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)

# Contact
@api.post("/contact")
async def submit_contact(data: ContactMessageIn):
    doc = {
        "id": str(uuid.uuid4()),
        **data.model_dump(),
        "created_at": now_iso(),
    }
    await db.contact_messages.insert_one(doc)
    doc.pop("_id", None)
    return {"ok": True, "id": doc["id"]}

@api.get("/admin/contact")
async def admin_list_contact(admin: dict = Depends(get_admin)):
    return await db.contact_messages.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)

# Stats
@api.get("/admin/stats")
async def admin_stats(admin: dict = Depends(get_admin)):
    today = datetime.now(timezone.utc).date().isoformat()
    total = await db.bookings.count_documents({})
    pending = await db.bookings.count_documents({"status": "pending"})
    confirmed = await db.bookings.count_documents({"status": "confirmed"})
    assigned = await db.bookings.count_documents({"status": "assigned"})
    completed = await db.bookings.count_documents({"status": "completed"})
    cancelled = await db.bookings.count_documents({"status": "cancelled"})
    today_bookings = await db.bookings.count_documents({"travel_date": today})
    available_vehicles = await db.vehicles.count_documents({"status": "available", "active": True})
    unavailable_vehicles = await db.vehicles.count_documents({"status": {"$ne": "available"}, "active": True})
    return {
        "total": total, "pending": pending, "confirmed": confirmed, "assigned": assigned,
        "completed": completed, "cancelled": cancelled, "today_bookings": today_bookings,
        "available_vehicles": available_vehicles, "unavailable_vehicles": unavailable_vehicles,
    }

# Auth
@api.post("/auth/login")
async def login(data: LoginIn):
    email = data.email.lower()
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(data.password, user["password_hash"]):
        raise HTTPException(401, "Invalid email or password")
    token = create_token(user["id"], email)
    return {"token": token, "user": {"id": user["id"], "email": user["email"], "name": user.get("name", "Admin")}}

@api.get("/auth/me")
async def me(admin: dict = Depends(get_admin)):
    return admin

app.include_router(api)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# --- Seed on startup ---
INITIAL_VEHICLES = [
    {"name": "Hyundai Aura", "image": "https://images.unsplash.com/photo-1623869675781-80aa31012a5a",
     "passenger_capacity": 4, "luggage_capacity": "2 large bags", "ac": True,
     "description": "Comfortable sedan ideal for airport transfers, city rides and short outstation trips."},
    {"name": "Maruti Suzuki Ertiga", "image": "https://images.unsplash.com/photo-1758223725156-ee49cc327a46",
     "passenger_capacity": 6, "luggage_capacity": "4 large bags", "ac": True,
     "description": "Spacious 7-seater MPV — perfect for family trips, tours and group travel."},
    {"name": "Maruti Suzuki Eeco", "image": "https://images.pexels.com/photos/15549900/pexels-photo-15549900.jpeg",
     "passenger_capacity": 7, "luggage_capacity": "5 bags", "ac": True,
     "description": "Economical van suitable for group city tours and temple visits."},
]

INITIAL_DESTINATIONS = [
    {"name": "Agra", "description": "Home to the majestic Taj Mahal, one of the Seven Wonders of the World.",
     "image": "https://images.unsplash.com/photo-1587135941948-670b381f08ce",
     "places": ["Taj Mahal", "Agra Fort", "Mehtab Bagh", "Fatehpur Sikri"]},
    {"name": "Delhi", "description": "The vibrant capital of India — a blend of Mughal heritage and modern life.",
     "image": "https://images.pexels.com/photos/4143959/pexels-photo-4143959.jpeg",
     "places": ["India Gate", "Red Fort", "Qutub Minar", "Airport & Railway Transfers"]},
    {"name": "Mathura", "description": "The birthplace of Lord Krishna — a spiritual and historical gem.",
     "image": "https://images.pexels.com/photos/35466438/pexels-photo-35466438.jpeg",
     "places": ["Krishna Janmabhoomi", "Dwarkadhish Temple", "Vishram Ghat", "Govardhan"]},
    {"name": "Vrindavan", "description": "The divine town where Lord Krishna spent his childhood.",
     "image": "https://images.unsplash.com/photo-1780681426329-bdf2961265d5",
     "places": ["Banke Bihari Temple", "Prem Mandir", "ISKCON Temple", "Nidhivan"]},
]

async def seed():
    # Indexes
    await db.users.create_index("email", unique=True)
    await db.bookings.create_index("booking_id", unique=True)
    await db.vehicles.create_index("id", unique=True)

    # Admin user
    admin_email = os.environ.get("ADMIN_EMAIL", "admin@radharanitours.com").lower()
    admin_password = os.environ.get("ADMIN_PASSWORD", "Radhe@2026")
    existing = await db.users.find_one({"email": admin_email})
    if not existing:
        await db.users.insert_one({
            "id": str(uuid.uuid4()),
            "email": admin_email,
            "password_hash": hash_password(admin_password),
            "name": "Admin",
            "role": "admin",
            "created_at": now_iso(),
        })
        logger.info(f"Seeded admin user: {admin_email}")
    elif not verify_password(admin_password, existing["password_hash"]):
        await db.users.update_one(
            {"email": admin_email},
            {"$set": {"password_hash": hash_password(admin_password)}},
        )
        logger.info(f"Updated admin password: {admin_email}")

    # Settings
    if not await db.settings.find_one({"_id": "main"}):
        s = Settings().model_dump()
        s["_id"] = "main"
        await db.settings.insert_one(s)

    # Vehicles
    if await db.vehicles.count_documents({}) == 0:
        for v in INITIAL_VEHICLES:
            veh = Vehicle(**v).model_dump()
            await db.vehicles.insert_one(veh)

    # Destinations
    if await db.destinations.count_documents({}) == 0:
        for d in INITIAL_DESTINATIONS:
            dest = Destination(**d).model_dump()
            await db.destinations.insert_one(dest)

@app.on_event("startup")
async def startup_event():
    await seed()

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
