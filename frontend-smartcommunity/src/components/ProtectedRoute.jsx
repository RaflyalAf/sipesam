import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
    // Mengambil data user yang disimpan di localStorage setelah berhasil login
    const storedUser = JSON.parse(localStorage.getItem('user'));

    // Jika data user tidak ditemukan (belum login), kembalikan ke halaman login
    if (!storedUser) {
        return <Navigate to="/login" replace />;
    }

    // Mengecek apakah ada salah satu role user yang cocok dengan rute yang diizinkan
    const hasAccess = storedUser.roles.some(role => allowedRoles.includes(role.name));

    // Jika memiliki akses, tampilkan komponen anak (halaman asli). 
    // Jika tidak memiliki akses, arahkan ke halaman unauthorized
    return hasAccess ? <Outlet /> : <Navigate to="/unauthorized" replace />;
};

export default ProtectedRoute;