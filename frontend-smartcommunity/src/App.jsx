import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register'; // PERBAIKAN 1: Impor komponen Register baru
import Unauthorized from './pages/Unauthorized';
import UserDashboard from './pages/user/UserDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <Router>
            <Routes>
                {/* Rute Umum yang Tidak Butuh Login */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} /> {/* PERBAIKAN 2: Daftarkan rute register disini */}
                <Route path="/unauthorized" element={<Unauthorized />} />

                {/* Rute Khusus User / Warga Biasa (Admin Juga Boleh Masuk Sini Jika Perlu) */}
                <Route element={<ProtectedRoute allowedRoles={['ROLE_USER', 'ROLE_ADMIN']} />}>
                    <Route path="/user/dashboard" element={<UserDashboard />} />
                </Route>

                {/* Rute Khusus Admin Kelurahan (User Biasa Ditendang Otomatis) */}
                <Route element={<ProtectedRoute allowedRoles={['ROLE_ADMIN']} />}>
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                </Route>

                {/* Jika Mengetik Alamat Sembarangan, Lempar Langsung ke Halaman Login */}
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </Router>
    );
}

export default App;