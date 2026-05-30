import React from 'react';

const Unauthorized = () => {
    const handleBack = () => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser && storedUser.roles.some(role => role.name === 'ROLE_ADMIN')) {
            window.location.href = '/admin/dashboard';
        } else {
            window.location.href = '/user/dashboard';
        }
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '100px', fontFamily: 'sans-serif' }}>
            <h1 style={{ color: '#dc3545', fontSize: '48px', marginBottom: '10px' }}>403 - Akses Ditolak</h1>
            <h3 style={{ color: '#333' }}>Anda Tidak Memiliki Izin Hak Akses</h3>
            <p style={{ color: '#666', marginBottom: '20px' }}>Halaman ini dilindungi ketat dan hanya boleh dibuka oleh Admin Kelurahan.</p>
            <button 
                onClick={handleBack} 
                style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
                Kembali ke Dashboard Anda
            </button>
        </div>
    );
};

export default Unauthorized;