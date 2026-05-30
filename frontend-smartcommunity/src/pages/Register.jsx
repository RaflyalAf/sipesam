import React, { useState } from 'react';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [focusedField, setFocusedField] = useState('');

    const handleRegister = (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (password !== confirmPassword) {
            setError('Konfirmasi password tidak cocok!');
            return;
        }

        // Simpan data pendaftaran secara dinamis agar langsung dikenali oleh Login.jsx
        const newUserPayload = {
            id: Date.now(),
            name: name,
            email: email,
            phone: phone,
            roles: [{ id: 2, name: "ROLE_USER" }] // Mendaftar sebagai Warga biasa
        };

        try {
            // Menulis ke LocalStorage
            localStorage.setItem('registeredUserSim', JSON.stringify(newUserPayload));
            
            setSuccess('Registrasi akun warga berhasil! Mengalihkan ke halaman login...');
            setName(''); setEmail(''); setPhone(''); setPassword(''); setConfirmPassword('');

            setTimeout(() => {
                window.location.href = '/login';
            }, 2000);

        } catch (err) {
            setError('Gagal memproses registrasi ke sistem lokal.');
        }
    };

    const theme = {
        bg: '#f4f6fa',
        cardBg: '#ffffff',
        textMain: '#111827',
        textSub: '#6b7280',
        accent: '#10b981',
        border: 'rgba(0, 0, 0, 0.08)',
        inputBg: '#ffffff',
        errorBg: '#fef2f2',
        errorText: '#ef4444',
        successBg: '#f0fdf4',
        successText: '#15803d',
        linkText: '#10b981'
    };

    return (
        <div style={{ margin: 0, padding: '40px 20px', fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif", backgroundColor: theme.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box' }}>
            <div style={{ width: '100%', maxWidth: '460px', backgroundColor: theme.cardBg, padding: '45px 40px', borderRadius: '28px', border: `1px solid ${theme.border}`, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.02), 0 10px 10px -5px rgba(0, 0, 0, 0.01)', boxSizing: 'border-box' }}>
                
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <div style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', width: '50px', height: '50px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 15px rgba(16,185,129,0.25)', color: '#fff', fontSize: '22px', margin: '0 auto 16px auto' }}>🌱</div>
                    <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '800', color: theme.textMain, letterSpacing: '-0.5px' }}>Daftar Akun Warga</h2>
                    <p style={{ margin: '6px 0 0 0', color: theme.textSub, fontSize: '13px', fontWeight: '500' }}>Bergabunglah dengan ekosistem SmartCommunity kelurahan</p>
                </div>

                {error && (
                    <div style={{ backgroundColor: theme.errorBg, color: theme.errorText, padding: '14px 16px', borderRadius: '12px', fontSize: '13px', fontWeight: '600', textAlign: 'center', marginBottom: '20px', border: `1px solid rgba(239, 68, 68, 0.15)` }}>
                        ⚠️ {error}
                    </div>
                )}

                {success && (
                    <div style={{ backgroundColor: theme.successBg, color: theme.successText, padding: '14px 16px', borderRadius: '12px', fontSize: '13px', fontWeight: '600', textAlign: 'center', marginBottom: '20px', border: `1px solid rgba(16, 185, 129, 0.15)` }}>
                        🎉 {success}
                    </div>
                )}

                <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '700', color: theme.textMain }}>Nama Lengkap:</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} onFocus={() => setFocusedField('name')} onBlur={() => setFocusedField('')} placeholder="Masukkan nama lengkap Anda" required style={{ width: '100%', padding: '12px 14px', border: `1px solid ${focusedField === 'name' ? theme.accent : theme.border}`, backgroundColor: theme.inputBg, color: theme.textMain, borderRadius: '12px', outline: 'none', fontSize: '14px', transition: 'all 0.2s', boxShadow: focusedField === 'name' ? '0 0 0 4px rgba(16, 185, 129, 0.1)' : 'none' }} />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '700', color: theme.textMain }}>Email Warga:</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField('')} placeholder="nama@email.com" required style={{ width: '100%', padding: '12px 14px', border: `1px solid ${focusedField === 'email' ? theme.accent : theme.border}`, backgroundColor: theme.inputBg, color: theme.textMain, borderRadius: '12px', outline: 'none', fontSize: '14px', transition: 'all 0.2s', boxShadow: focusedField === 'email' ? '0 0 0 4px rgba(16, 185, 129, 0.1)' : 'none' }} />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '700', color: theme.textMain }}>Nomor Telepon/HP:</label>
                        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} onFocus={() => setFocusedField('phone')} onBlur={() => setFocusedField('')} placeholder="Contoh: 08123456789" required style={{ width: '100%', padding: '12px 14px', border: `1px solid ${focusedField === 'phone' ? theme.accent : theme.border}`, backgroundColor: theme.inputBg, color: theme.textMain, borderRadius: '12px', outline: 'none', fontSize: '14px', transition: 'all 0.2s', boxShadow: focusedField === 'phone' ? '0 0 0 4px rgba(16, 185, 129, 0.1)' : 'none' }} />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '700', color: theme.textMain }}>Password Baru:</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} onFocus={() => setFocusedField('password')} onBlur={() => setFocusedField('')} placeholder="Buat password baru" required style={{ width: '100%', padding: '12px 14px', border: `1px solid ${focusedField === 'password' ? theme.accent : theme.border}`, backgroundColor: theme.inputBg, color: theme.textMain, borderRadius: '12px', outline: 'none', fontSize: '14px', transition: 'all 0.2s', boxShadow: focusedField === 'password' ? '0 0 0 4px rgba(16, 185, 129, 0.1)' : 'none' }} />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '700', color: theme.textMain }}>Konfirmasi Password:</label>
                        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} onFocus={() => setFocusedField('confirmPassword')} onBlur={() => setFocusedField('')} placeholder="Ulangi password baru Anda" required style={{ width: '100%', padding: '12px 14px', border: `1px solid ${focusedField === 'confirmPassword' ? theme.accent : theme.border}`, backgroundColor: theme.inputBg, color: theme.textMain, borderRadius: '12px', outline: 'none', fontSize: '14px', transition: 'all 0.2s', boxShadow: focusedField === 'confirmPassword' ? '0 0 0 4px rgba(16, 185, 129, 0.1)' : 'none' }} />
                    </div>

                    <button type="submit" style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: '15px', cursor: 'pointer', boxShadow: '0 4px 15px rgba(16,185,129,0.25)', transition: 'opacity 0.2s' }} onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'} onMouseOut={(e) => e.currentTarget.style.opacity = '1'}>Daftar Sekarang</button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '25px', fontSize: '14px', fontWeight: '600', color: theme.textSub }}>
                    Sudah punya akun warga?{' '}
                    <a href="/login" style={{ color: theme.linkText, textDecoration: 'none' }} onMouseOver={(e) => e.currentTarget.style.textDecoration = 'underline'} onMouseOut={(e) => e.currentTarget.style.textDecoration = 'none'}>Masuk disini</a>
                </div>

            </div>
        </div>
    );
};

export default Register;