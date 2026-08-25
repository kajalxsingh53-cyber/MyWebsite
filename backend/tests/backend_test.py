"""Backend API tests for Radharani Tours & Travels."""
import os
import re
import pytest
import requests
from dotenv import load_dotenv

load_dotenv("/app/frontend/.env")
BASE_URL = os.environ["REACT_APP_BACKEND_URL"].rstrip("/")
API = f"{BASE_URL}/api"

ADMIN_EMAIL = "admin@radharanitours.com"
ADMIN_PASSWORD = "Radhe@2026"


@pytest.fixture(scope="session")
def token():
    r = requests.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=30)
    assert r.status_code == 200, r.text
    return r.json()["token"]


@pytest.fixture(scope="session")
def auth_headers(token):
    return {"Authorization": f"Bearer {token}"}


# --- Auth ---
class TestAuth:
    def test_login_success(self):
        r = requests.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
        assert r.status_code == 200
        data = r.json()
        assert "token" in data and isinstance(data["token"], str) and len(data["token"]) > 20
        assert data["user"]["email"] == ADMIN_EMAIL

    def test_login_invalid_password(self):
        r = requests.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": "wrong"})
        assert r.status_code == 401

    def test_me_requires_token(self):
        r = requests.get(f"{API}/auth/me")
        assert r.status_code == 401

    def test_me_with_token(self, auth_headers):
        r = requests.get(f"{API}/auth/me", headers=auth_headers)
        assert r.status_code == 200
        assert r.json()["email"] == ADMIN_EMAIL

    def test_me_invalid_token(self):
        r = requests.get(f"{API}/auth/me", headers={"Authorization": "Bearer garbage"})
        assert r.status_code == 401


# --- Settings ---
class TestSettings:
    def test_get_settings_default(self):
        r = requests.get(f"{API}/settings")
        assert r.status_code == 200
        data = r.json()
        assert data["business_name"] == "Radharani Tours & Travels"

    def test_put_settings_requires_auth(self):
        r = requests.put(f"{API}/settings", json={"business_name": "Test"})
        assert r.status_code == 401

    def test_put_settings_with_auth(self, auth_headers):
        # Get current then update phone, then restore
        cur = requests.get(f"{API}/settings").json()
        payload = {**cur, "phone": "+91-9999999999"}
        r = requests.put(f"{API}/settings", json=payload, headers=auth_headers)
        assert r.status_code == 200, r.text
        assert r.json()["phone"] == "+91-9999999999"
        # verify persisted
        r2 = requests.get(f"{API}/settings")
        assert r2.json()["phone"] == "+91-9999999999"
        # restore
        requests.put(f"{API}/settings", json=cur, headers=auth_headers)


# --- Seed data ---
class TestSeed:
    def test_vehicles_seeded(self):
        r = requests.get(f"{API}/vehicles")
        assert r.status_code == 200
        items = r.json()
        assert len(items) >= 3
        names = " ".join(v["name"] for v in items)
        assert "Aura" in names and "Ertiga" in names and "Eeco" in names

    def test_destinations_seeded(self):
        r = requests.get(f"{API}/destinations")
        assert r.status_code == 200
        items = r.json()
        names = {d["name"] for d in items}
        for expected in ["Agra", "Delhi", "Mathura", "Vrindavan"]:
            assert expected in names


# --- Bookings ---
class TestBookings:
    booking_id_pattern = re.compile(r"^RRT-\d{4}-\d{4}$")

    def _payload(self):
        return {
            "full_name": "TEST_Customer",
            "mobile": "9999900001",
            "email": "test@example.com",
            "pickup": "Mathura",
            "destination": "Agra",
            "travel_date": "2026-02-01",
            "pickup_time": "09:00",
            "trip_type": "one-way",
            "passengers": 2,
        }

    def test_create_booking_and_get(self):
        r = requests.post(f"{API}/bookings", json=self._payload())
        assert r.status_code == 200, r.text
        b = r.json()
        assert self.booking_id_pattern.match(b["booking_id"])
        assert b["status"] == "pending"
        # GET by public booking_id
        r2 = requests.get(f"{API}/bookings/{b['booking_id']}")
        assert r2.status_code == 200
        assert r2.json()["full_name"] == "TEST_Customer"

    def test_booking_id_increments(self):
        r1 = requests.post(f"{API}/bookings", json=self._payload())
        r2 = requests.post(f"{API}/bookings", json=self._payload())
        assert r1.status_code == 200 and r2.status_code == 200
        n1 = int(r1.json()["booking_id"].split("-")[-1])
        n2 = int(r2.json()["booking_id"].split("-")[-1])
        assert n2 == n1 + 1

    def test_get_booking_not_found(self):
        r = requests.get(f"{API}/bookings/RRT-1900-0001")
        assert r.status_code == 404

    def test_booking_status_flow(self, auth_headers):
        r = requests.post(f"{API}/bookings", json=self._payload())
        b = r.json()
        internal_id = b["id"]
        for status in ["confirmed", "assigned", "completed"]:
            up = requests.patch(f"{API}/admin/bookings/{internal_id}", json={"status": status}, headers=auth_headers)
            assert up.status_code == 200, up.text
            assert up.json()["status"] == status


# --- Admin CRUD ---
class TestAdminVehicleCRUD:
    def test_crud_flow(self, auth_headers):
        # Create
        create = requests.post(f"{API}/admin/vehicles",
                               json={"name": "TEST_Vehicle", "passenger_capacity": 5},
                               headers=auth_headers)
        assert create.status_code == 200, create.text
        vid = create.json()["id"]
        # Update
        up = requests.put(f"{API}/admin/vehicles/{vid}",
                          json={"name": "TEST_Vehicle_Updated", "passenger_capacity": 6},
                          headers=auth_headers)
        assert up.status_code == 200
        assert up.json()["name"] == "TEST_Vehicle_Updated"
        # Verify in list
        listing = requests.get(f"{API}/admin/vehicles", headers=auth_headers).json()
        assert any(v["id"] == vid and v["name"] == "TEST_Vehicle_Updated" for v in listing)
        # Delete
        d = requests.delete(f"{API}/admin/vehicles/{vid}", headers=auth_headers)
        assert d.status_code == 200

    def test_requires_auth(self):
        r = requests.post(f"{API}/admin/vehicles", json={"name": "X"})
        assert r.status_code == 401


class TestAdminDestinationCRUD:
    def test_crud(self, auth_headers):
        c = requests.post(f"{API}/admin/destinations", json={"name": "TEST_Dest"}, headers=auth_headers)
        assert c.status_code == 200
        did = c.json()["id"]
        u = requests.put(f"{API}/admin/destinations/{did}", json={"name": "TEST_Dest2"}, headers=auth_headers)
        assert u.status_code == 200 and u.json()["name"] == "TEST_Dest2"
        d = requests.delete(f"{API}/admin/destinations/{did}", headers=auth_headers)
        assert d.status_code == 200


class TestAdminTourCRUD:
    def test_crud(self, auth_headers):
        c = requests.post(f"{API}/admin/tours", json={"name": "TEST_Tour", "starting_price": 500}, headers=auth_headers)
        assert c.status_code == 200
        tid = c.json()["id"]
        u = requests.put(f"{API}/admin/tours/{tid}", json={"name": "TEST_Tour2", "starting_price": 700}, headers=auth_headers)
        assert u.status_code == 200 and u.json()["starting_price"] == 700
        requests.delete(f"{API}/admin/tours/{tid}", headers=auth_headers)


class TestAdminGalleryCRUD:
    def test_crud(self, auth_headers):
        c = requests.post(f"{API}/admin/gallery", json={"url": "https://example.com/x.jpg", "category": "Tours"}, headers=auth_headers)
        assert c.status_code == 200
        gid = c.json()["id"]
        d = requests.delete(f"{API}/admin/gallery/{gid}", headers=auth_headers)
        assert d.status_code == 200


# --- Reviews (approved filter) ---
class TestReviews:
    def test_public_only_returns_approved(self, auth_headers):
        # Create unapproved
        r1 = requests.post(f"{API}/admin/reviews",
                           json={"customer_name": "TEST_Unapproved", "review": "x", "approved": False},
                           headers=auth_headers)
        assert r1.status_code == 200
        unapproved_id = r1.json()["id"]
        # Create approved
        r2 = requests.post(f"{API}/admin/reviews",
                           json={"customer_name": "TEST_Approved", "review": "y", "approved": True},
                           headers=auth_headers)
        assert r2.status_code == 200
        approved_id = r2.json()["id"]

        public = requests.get(f"{API}/reviews").json()
        public_ids = [r["id"] for r in public]
        assert approved_id in public_ids
        assert unapproved_id not in public_ids

        admin_all = requests.get(f"{API}/admin/reviews", headers=auth_headers).json()
        admin_ids = [r["id"] for r in admin_all]
        assert approved_id in admin_ids and unapproved_id in admin_ids

        # cleanup
        requests.delete(f"{API}/admin/reviews/{unapproved_id}", headers=auth_headers)
        requests.delete(f"{API}/admin/reviews/{approved_id}", headers=auth_headers)


# --- Contact ---
class TestContact:
    def test_submit_contact(self):
        r = requests.post(f"{API}/contact", json={"name": "TEST_User", "email": "a@b.com", "message": "hello"})
        assert r.status_code == 200
        assert r.json()["ok"] is True


# --- Stats ---
class TestStats:
    def test_stats_requires_auth(self):
        r = requests.get(f"{API}/admin/stats")
        assert r.status_code == 401

    def test_stats_returns_counts(self, auth_headers):
        r = requests.get(f"{API}/admin/stats", headers=auth_headers)
        assert r.status_code == 200
        s = r.json()
        for k in ["total", "pending", "confirmed", "assigned", "completed", "cancelled",
                  "today_bookings", "available_vehicles", "unavailable_vehicles"]:
            assert k in s and isinstance(s[k], int)
