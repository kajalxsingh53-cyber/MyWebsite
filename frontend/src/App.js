import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "@/context/AuthContext";
import { SettingsProvider } from "@/context/SettingsContext";
import PublicLayout from "@/components/PublicLayout";
import ProtectedRoute from "@/components/ProtectedRoute";

import Home from "@/pages/Home";
import About from "@/pages/About";
import Fleet from "@/pages/Fleet";
import Tours from "@/pages/Tours";
import Destinations from "@/pages/Destinations";
import Booking from "@/pages/Booking";
import BookingConfirmation from "@/pages/BookingConfirmation";
import Contact from "@/pages/Contact";
import Reviews from "@/pages/Reviews";
import Gallery from "@/pages/Gallery";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";

import AdminLogin from "@/pages/admin/AdminLogin";
import AdminLayout from "@/pages/admin/AdminLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminBookings from "@/pages/admin/AdminBookings";
import AdminVehicles from "@/pages/admin/AdminVehicles";
import AdminTours from "@/pages/admin/AdminTours";
import AdminDestinations from "@/pages/admin/AdminDestinations";
import AdminReviews from "@/pages/admin/AdminReviews";
import AdminGallery from "@/pages/admin/AdminGallery";
import AdminCustomers from "@/pages/admin/AdminCustomers";
import AdminSettings from "@/pages/admin/AdminSettings";

function withLayout(el) { return <PublicLayout>{el}</PublicLayout>; }

export default function App() {
    return (
        <AuthProvider>
            <SettingsProvider>
                <BrowserRouter>
                    <Toaster position="top-right" richColors />
                    <Routes>
                        <Route path="/" element={withLayout(<Home />)} />
                        <Route path="/about" element={withLayout(<About />)} />
                        <Route path="/fleet" element={withLayout(<Fleet />)} />
                        <Route path="/tours" element={withLayout(<Tours />)} />
                        <Route path="/destinations" element={withLayout(<Destinations />)} />
                        <Route path="/booking" element={withLayout(<Booking />)} />
                        <Route path="/booking/confirmation/:bookingId" element={withLayout(<BookingConfirmation />)} />
                        <Route path="/contact" element={withLayout(<Contact />)} />
                        <Route path="/reviews" element={withLayout(<Reviews />)} />
                        <Route path="/gallery" element={withLayout(<Gallery />)} />
                        <Route path="/privacy" element={withLayout(<Privacy />)} />
                        <Route path="/terms" element={withLayout(<Terms />)} />

                        <Route path="/admin/login" element={<AdminLogin />} />
                        <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
                            <Route index element={<AdminDashboard />} />
                            <Route path="bookings" element={<AdminBookings />} />
                            <Route path="vehicles" element={<AdminVehicles />} />
                            <Route path="tours" element={<AdminTours />} />
                            <Route path="destinations" element={<AdminDestinations />} />
                            <Route path="reviews" element={<AdminReviews />} />
                            <Route path="gallery" element={<AdminGallery />} />
                            <Route path="customers" element={<AdminCustomers />} />
                            <Route path="settings" element={<AdminSettings />} />
                        </Route>
                    </Routes>
                </BrowserRouter>
            </SettingsProvider>
        </AuthProvider>
    );
}
