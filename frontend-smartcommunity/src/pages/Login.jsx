import React, { useState } from 'react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        setError('');

        // Simulasi jika login menggunakan akun warga seeder
        if (email === 'raflyalfazari62@gmail.com') {
            const userData = {
                id: 1,
                name: "Muhammad Rafly Alfazari",
                email: "raflyalfazari62@gmail.com",
                phone: "90970970",
                roles: [{ id: 2, name: "ROLE_USER" }]
            };
            localStorage.setItem('user', JSON.stringify(userData));
            window.location.href = '/user/dashboard';
        } 
        // Simulasi jika login menggunakan akun admin kelurahan seeder
        else if (email === 'admin@smartcommunity.com') {
            const adminData = {
                id: 2,
                name: "Admin Smart Community",
                email: "admin@smartcommunity.com",
                phone: "12345678",
                roles: [{ id: 1, name: "ROLE_ADMIN" }]
            };
            localStorage.setItem('user', JSON.stringify(adminData));
            window.location.href = '/admin/dashboard';
        } 
        else {
            setError('Email tidak terdaftar di sistem seeder!');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '100px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h2 style={{ textAlign: 'center' }}>Login Smart Community</h2>
            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
            <form onSubmit={handleLogin}>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Email Proyek:</label>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        placeholder="Masukkan email warga / admin"
                        required 
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        placeholder="Bebaskan saja untuk uji coba"
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                </div>
                <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Masuk Aplikasi
                </button>
            </form>
            <div style={{ marginTop: '20px', fontSize: '12px', color: '#555' }}>
                <p><strong>Petunjuk Demo UTS:</strong></p>
                <ul>
                    <li>Gunakan <code>admin@smartcommunity.com</code> untuk masuk sebagai Admin Kelurahan.</li>
                    <li>Gunakan <code>raflyalfazari62@gmail.com</code> untuk masuk sebagai Warga / User.</li>
                </ul>
            </div>
        </div>
    );
};

export default Login;