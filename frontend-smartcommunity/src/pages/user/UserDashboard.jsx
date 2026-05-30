import React, { useState, useEffect } from 'react';

const UserDashboard = () => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const [activeMenu, setActiveMenu] = useState('dashboard');
    
    // ==================== THEME ENGINE STATE ====================
    const [darkMode, setDarkMode] = useState(false);

    // ==================== STATE MANAGEMENT DATA (CRUD) ====================
    // Data Setoran Sampah Warga — load dari localStorage, fallback ke data default
    const defaultSetoran = [
        { id: 1, tanggal: '2026-05-18', jenis: 'Botol Plastik Bekas', berat: 45.2, pendapatan: 226000, provinsi: 'DKI JAKARTA', kabupaten: 'KOTA ADMINISTRASI JAKARTA SELATAN', kecamatan: 'CILANDAK', kelurahan: 'CILANDAK BARAT', rt: '03', rw: '02', status: 'Pending' },
        { id: 2, tanggal: '2026-05-14', jenis: 'Kardus Box Kemasan', berat: 120.0, pendapatan: 420000, provinsi: 'JAWA BARAT', kabupaten: 'KABUPATEN BANDUNG', kecamatan: 'BOJONGSOANG', kelurahan: 'BOJONGSOANG', rt: '01', rw: '04', status: 'Pending' },
        { id: 3, tanggal: '2026-05-10', jenis: 'Kaleng Alumunium Soda', berat: 23.5, pendapatan: 282000, provinsi: 'JAWA TENGAH', kabupaten: 'KOTA SEMARANG', kecamatan: 'PEDURUNGAN', kelurahan: 'PEDURUNGAN KIDUL', rt: '05', rw: '01', status: 'Pending' },
    ];
    const [riwayatSetoran, setRiwayatSetoran] = useState(() => {
        const saved = localStorage.getItem('riwayatSetoran');
        if (saved) {
            try { return JSON.parse(saved); } catch(e) {}
        }
        // Simpan data default ke localStorage agar admin langsung bisa melihat
        localStorage.setItem('riwayatSetoran', JSON.stringify(defaultSetoran));
        return defaultSetoran;
    });

    // Form State Setoran Sampah
    const [inputJenis, setInputJenis] = useState('');
    const [inputBerat, setInputBerat] = useState('');
    const [inputNominal, setInputNominal] = useState(0);
    const [isEditingSetoran, setIsEditingSetoran] = useState(false);
    const [editSetoranId, setEditSetoranId] = useState(null);

    // State untuk Struk Nota Digital Pop-Up Modal
    const [showModalStruk, setShowModalStruk] = useState(false);
    const [selectedStruk, setSelectedStruk] = useState(null);

    // Data Pengaduan Warga — load dari localStorage, fallback ke data default
    const defaultAduan = [
        { id: 1, provinsi: 'JAWA BARAT', kabupaten: 'KABUPATEN BANDUNG', kecamatan: 'BOJONGSOANG', kelurahan: 'BOJONGSOANG', rt: '03', rw: '04', perihal: 'Saluran air tersumbat botol plastik liar, butuh armada angkut tambahan.', status: 'Pending' }
    ];
    const [riwayatAduan, setRiwayatAduan] = useState(() => {
        const saved = localStorage.getItem('riwayatAduan');
        if (saved) {
            try { return JSON.parse(saved); } catch(e) {}
        }
        localStorage.setItem('riwayatAduan', JSON.stringify(defaultAduan));
        return defaultAduan;
    });
    
    // Form State Pengaduan
    const [inputAduanPerihal, setInputAduanPerihal] = useState('');
    const [isEditingAduan, setIsEditingAduan] = useState(false);
    const [editAduanId, setEditAduanId] = useState(null);

    // ==================== API WILAYAH INDONESIA ENGINE ====================
    const [provinces, setProvinces] = useState([]);
    const [regencies, setRegencies] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [villages, setVillages] = useState([]);

    // State penampung pilihan wilayah global (dipakai bergantian oleh form yang aktif)
    const [selectedProv, setSelectedProv] = useState('');
    const [selectedKab, setSelectedKab] = useState('');
    const [selectedKec, setSelectedKec] = useState('');
    const [selectedKel, setSelectedKel] = useState('');
    const [selectedRt, setSelectedRt] = useState('');
    const [selectedRw, setSelectedRw] = useState('');

    // 3. Peta Lokasi Search State
    const [searchQuery, setSearchQuery] = useState('Indonesia');
    const [mapUrl, setMapUrl] = useState('https://maps.google.com/maps?q=bank%20sampah%20Indonesia&t=&z=5&ie=UTF8&iwloc=&output=embed');

    // 4. State Poin & Voucher Reward
    const [points, setPoints] = useState(420); 
    const [rewards, setRewards] = useState([
        { id: 1, nama: 'Voucher Token Listrik Rp 20.000', butuhPoin: 200, stok: 5, ikon: '⚡' },
        { id: 2, nama: 'Voucher Pulsa All Operator Rp 10.000', butuhPoin: 100, stok: 12, ikon: '📱' },
        { id: 3, nama: 'Kupon Paket Sembako Gratis RW', butuhPoin: 350, stok: 2, ikon: '🛍️' },
    ]);

    // Peringkat Sektor Kolektif Utama
    const leaderboardRW = [
        { peringkat: 1, rw: 'RW 01 (Kampung Hijau Asri)', berat: '452.4 Kg', poin: '9.040 Pts', badge: '🥇' },
        { peringkat: 2, rw: 'RW 04 (Sektor Bakti Mandiri)', berat: '389.1 Kg', poin: '7.782 Pts', badge: '🥈' },
        { peringkat: 3, rw: 'RW 02 (Indah Lestari)', berat: '210.5 Kg', poin: '4.210 Pts', badge: '🥉' },
    ];

    const handleLogout = () => {
        // Hanya hapus session user, data setoran & aduan tetap disimpan untuk admin
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    // Reset Dropdown Regional Bertingkat
    const resetRegionalDropdowns = () => {
        setSelectedProv(''); setSelectedKab(''); setSelectedKec(''); setSelectedKel('');
        setSelectedRt(''); setSelectedRw('');
        setRegencies([]); setDistricts([]); setVillages([]);
    };

    // ==================== SIDE EFFECTS: SYNC DATA KE LOCALSTORAGE UNTUK ADMIN ====================
    useEffect(() => {
        localStorage.setItem('riwayatSetoran', JSON.stringify(riwayatSetoran));
    }, [riwayatSetoran]);

    useEffect(() => {
        localStorage.setItem('riwayatAduan', JSON.stringify(riwayatAduan));
    }, [riwayatAduan]);

    // ==================== SIDE EFFECTS: DATA WILAYAH ASLI INDONESIA ====================
    useEffect(() => {
        fetch('https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json')
            .then(res => res.json())
            .then(data => setProvinces(data))
            .catch(err => console.error("Gagal memuat data provinsi asli", err));
    }, []);

    const handleSelectProvinsi = (provId, provName) => {
        setSelectedProv(provName);
        setSelectedKab(''); setSelectedKec(''); setSelectedKel('');
        setRegencies([]); setDistricts([]); setVillages([]);
        if(provId) {
            fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${provId}.json`)
                .then(res => res.json())
                .then(data => setRegencies(data));
        }
    };

    const handleSelectKabupaten = (kabId, kabName) => {
        setSelectedKab(kabName);
        setSelectedKec(''); setSelectedKel('');
        setDistricts([]); setVillages([]);
        if(kabId) {
            fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/districts/${kabId}.json`)
                .then(res => res.json())
                .then(data => setDistricts(data));
        }
    };

    const handleSelectKecamatan = (kecId, kecName) => {
        setSelectedKec(kecName);
        setSelectedKel('');
        setVillages([]);
        if(kecId) {
            fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/villages/${kecId}.json`)
                .then(res => res.json())
                .then(data => setVillages(data));
        }
    };

    // ==================== LOGIKA SEARCH MAPS ====================
    const handleSearchMap = (e) => {
        e.preventDefault();
        if (searchQuery.trim() !== '') {
            const formattedQuery = encodeURIComponent(`bank sampah ${searchQuery}`);
            const newUrl = `https://maps.google.com/maps?q=${formattedQuery}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
            setMapUrl(newUrl);
        }
    };

    // ==================== KALKULASI HARGA SAMPAH OTOMATIS ====================
    const calculateAutomatedPrice = (teksKategori, nilaiBerat) => {
        const beratFloat = parseFloat(nilaiBerat);
        if (!teksKategori || isNaN(beratFloat) || beratFloat <= 0) {
            setInputNominal(0);
            return;
        }

        const kategoriLower = teksKategori.toLowerCase();
        let hargaPerKg = 4000;

        if (kategoriLower.includes('plastik')) {
            hargaPerKg = 5000;
        } else if (kategoriLower.includes('kertas') || kategoriLower.includes('kardus')) {
            hargaPerKg = 3500;
        } else if (kategoriLower.includes('logam') || kategoriLower.includes('besi') || kategoriLower.includes('kaleng')) {
            hargaPerKg = 12000;
        } else if (kategoriLower.includes('kaca') || kategoriLower.includes('botol')) {
            hargaPerKg = 2500;
        }

        setInputNominal(beratFloat * hargaPerKg);
    };

    const handleJenisTxtChange = (teks) => {
        setInputJenis(teks);
        calculateAutomatedPrice(teks, inputBerat);
    };

    const handleBeratTxtChange = (berat) => {
        setInputBerat(berat);
        calculateAutomatedPrice(inputJenis, berat);
    };

    // ==================== OPERASI CRUD SAMPAH + INTEGRASI LEADERBOARD ====================
    const handleSaveSetoran = (e) => {
        e.preventDefault();
        if (isEditingSetoran) {
            const updated = riwayatSetoran.map(item => 
                item.id === editSetoranId 
                    ? { ...item, jenis: inputJenis, berat: parseFloat(inputBerat), pendapatan: inputNominal, provinsi: selectedProv, kabupaten: selectedKab, kecamatan: selectedKec, kelurahan: selectedKel, rt: selectedRt, rw: selectedRw } 
                    : item
            );
            setRiwayatSetoran(updated);
            localStorage.setItem('riwayatSetoran', JSON.stringify(updated));
            setIsEditingSetoran(false); setEditSetoranId(null);
        } else {
            const dataBaru = {
                id: Date.now(),
                tanggal: new Date().toISOString().split('T')[0],
                jenis: inputJenis, 
                berat: parseFloat(inputBerat), 
                pendapatan: inputNominal,
                provinsi: selectedProv, kabupaten: selectedKab, kecamatan: selectedKec, kelurahan: selectedKel,
                rt: selectedRt, rw: selectedRw,
                status: 'Pending'
            };
            const updated = [dataBaru, ...riwayatSetoran];
            setRiwayatSetoran(updated);
            localStorage.setItem('riwayatSetoran', JSON.stringify(updated));
            setPoints(points + Math.floor(parseFloat(inputBerat) * 2));
        }
        setInputJenis(''); setInputBerat(''); setInputNominal(0);
        resetRegionalDropdowns();
    };

    const handleEditSetoran = (item) => {
        setIsEditingSetoran(true); setEditSetoranId(item.id);
        setInputJenis(item.jenis); setInputBerat(item.berat); setInputNominal(item.pendapatan);
        setSelectedProv(item.provinsi); setSelectedKab(item.kabupaten);
        setSelectedKec(item.kecamatan); setSelectedKel(item.kelurahan);
        setSelectedRt(item.rt); setSelectedRw(item.rw);
        setActiveMenu('riwayat');
    };

    const handleDeleteSetoran = (id) => {
        if (window.confirm('Hapus log transaksi setoran ini?')) {
            const updated = riwayatSetoran.filter(item => item.id !== id);
            setRiwayatSetoran(updated);
            localStorage.setItem('riwayatSetoran', JSON.stringify(updated));
        }
    };

    const handleTriggerStruk = (item) => {
        setSelectedStruk(item);
        setShowModalStruk(true);
    };

    // ==================== OPERASI CRUD PENGADUAN + REGIONAL 100% KOMPLIT ====================
    const handleSaveAduan = (e) => {
        e.preventDefault();
        let updated;
        if (isEditingAduan) {
            updated = riwayatAduan.map(item => 
                item.id === editAduanId 
                    ? { ...item, provinsi: selectedProv, kabupaten: selectedKab, kecamatan: selectedKec, kelurahan: selectedKel, rt: selectedRt, rw: selectedRw, perihal: inputAduanPerihal } 
                    : item
            );
            setIsEditingAduan(false); setEditAduanId(null);
        } else {
            const aduanBaru = {
                id: Date.now(),
                provinsi: selectedProv,
                kabupaten: selectedKab,
                kecamatan: selectedKec,
                kelurahan: selectedKel,
                rt: selectedRt,
                rw: selectedRw,
                perihal: inputAduanPerihal,
                status: 'Pending'
            };
            updated = [aduanBaru, ...riwayatAduan];
        }
        setRiwayatAduan(updated);
        localStorage.setItem('riwayatAduan', JSON.stringify(updated));
        setInputAduanPerihal('');
        resetRegionalDropdowns();
    };

    const handleEditAduan = (item) => {
        setIsEditingAduan(true); setEditAduanId(item.id);
        setSelectedProv(item.provinsi); setSelectedKab(item.kabupaten);
        setSelectedKec(item.kecamatan); setSelectedKel(item.kelurahan);
        setSelectedRt(item.rt); setSelectedRw(item.rw);
        setInputAduanPerihal(item.perihal);
    };

    const handleDeleteAduan = (id) => {
        if (window.confirm('Hapus lembar aduan wilayah ini?')) {
            const updated = riwayatAduan.filter(item => item.id !== id);
            setRiwayatAduan(updated);
            localStorage.setItem('riwayatAduan', JSON.stringify(updated));
        }
    };

    // ==================== REAL-TIME LEADERBOARD WILAYAH AGREGASI ====================
    const hitungLeaderboardWilayahRealtime = () => {
        const petaWilayah = {};
        riwayatSetoran.forEach(item => {
            const key = `${item.kelurahan || 'Sektor'} (RT ${item.rt || '00'}/RW ${item.rw || '00'})`;
            if (!petaWilayah[key]) {
                petaWilayah[key] = {
                    namaSektor: key,
                    subSektor: `${item.kecamatan || 'Kecamatan'}, ${item.kabupaten || 'Kota'}`,
                    totalBerat: 0
                };
            }
            petaWilayah[key].totalBerat += item.berat;
        });

        return Object.values(petaWilayah)
            .sort((a, b) => b.totalBerat - a.totalBerat)
            .map((item, index) => {
                const badge = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '✨';
                return {
                    peringkat: index + 1, badge: badge, wilayah: item.namaSektor,
                    deskripsi: item.subSektor, massa: `${item.totalBerat.toFixed(1)} Kg`
                };
            });
    };

    const leaderboardDinamis = hitungLeaderboardWilayahRealtime();

    // REWARD POIN HANDLING
    const handleClaimReward = (reward) => {
        if (points >= reward.butuhPoin && reward.stok > 0) {
            setPoints(points - reward.butuhPoin);
            setRewards(rewards.map(r => r.id === reward.id ? { ...r, stok: r.stok - 1 } : r));
            alert(`🎉 PENUKARAN VOUCHER HADIAH SUKSES 🎉\n\nKode Unik Anda: SC-${Math.floor(Math.random() * 90000) + 10000}`);
        } else {
            alert('Saldo poin tidak mencukupi atau kuota habis!');
        }
    };

    const totalSaldo = riwayatSetoran.reduce((acc, curr) => acc + curr.pendapatan, 0);
    const totalBerat = riwayatSetoran.reduce((acc, curr) => acc + curr.berat, 0);
    const carbonReduced = totalBerat * 2.5; 
    const treesSaved = (carbonReduced / 20).toFixed(2);

    // CONFIGURATION STYLE ENGINE
    const theme = {
        bg: darkMode ? '#0b0f19' : '#f8fafc',
        cardBg: darkMode ? '#131c2e' : '#ffffff',
        textMain: darkMode ? '#f8fafc' : '#0f172a',
        textSub: darkMode ? '#94a3b8' : '#64748b',
        border: darkMode ? 'rgba(255,255,255,0.05)' : '#e2e8f0',
        sidebarBg: darkMode ? '#090d16' : '#0f2e1b',
        tableRowHover: darkMode ? '#1e293b' : '#f8fafc',
    };

    

    // JALUR FORM REGIONAL REUSABLE COMPONENT (Mencegah Redudansi Kode)
    const renderDropdownRegional = () => (
        <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '700', color: theme.textMain }}>Provinsi Real:</label>
                    <select onChange={(e) => { const idx = e.target.selectedIndex; handleSelectProvinsi(e.target.value, e.target.options[idx].text); }} style={{ width: '100%', padding: '12px', border: `1px solid ${darkMode ? '#334155' : '#cbd5e1'}`, backgroundColor: theme.bg, color: theme.textMain, borderRadius: '8px', outline: 'none' }} required>
                        <option value="">-- Pilih Provinsi Asli --</option>
                        {provinces.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '700', color: theme.textMain }}>Kota / Kabupaten Real:</label>
                    <select disabled={regencies.length === 0} onChange={(e) => { const idx = e.target.selectedIndex; handleSelectKabupaten(e.target.value, e.target.options[idx].text); }} style={{ width: '100%', padding: '12px', border: `1px solid ${darkMode ? '#334155' : '#cbd5e1'}`, backgroundColor: theme.bg, color: theme.textMain, borderRadius: '8px', outline: 'none' }} required>
                        <option value="">-- Pilih Kota / Kabupaten --</option>
                        {regencies.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                    </select>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '700', color: theme.textMain }}>Kecamatan Real:</label>
                    <select disabled={districts.length === 0} onChange={(e) => { const idx = e.target.selectedIndex; handleSelectKecamatan(e.target.value, e.target.options[idx].text); }} style={{ width: '100%', padding: '12px', border: `1px solid ${darkMode ? '#334155' : '#cbd5e1'}`, backgroundColor: theme.bg, color: theme.textMain, borderRadius: '8px', outline: 'none' }} required>
                        <option value="">-- Pilih Kecamatan --</option>
                        {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '700', color: theme.textMain }}>Kelurahan / Desa Real:</label>
                    <select disabled={villages.length === 0} onChange={(e) => setSelectedKel(e.target.value)} value={selectedKel} style={{ width: '100%', padding: '12px', border: `1px solid ${darkMode ? '#334155' : '#cbd5e1'}`, backgroundColor: theme.bg, color: theme.textMain, borderRadius: '8px', outline: 'none' }} required>
                        <option value="">-- Pilih Kelurahan / Desa --</option>
                        {villages.map(v => <option key={v.id} value={v.name}>{v.name}</option>)}
                    </select>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '20px', maxWidth: '300px' }}>
                <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '700', color: theme.textMain }}>No. RT:</label>
                    <input type="text" value={selectedRt} onChange={(e) => setSelectedRt(e.target.value)} placeholder="02" required style={{ width: '100%', padding: '12px', border: `1px solid ${darkMode ? '#334155' : '#cbd5e1'}`, backgroundColor: theme.bg, color: theme.textMain, borderRadius: '8px', outline: 'none' }} />
                </div>
                <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '700', color: theme.textMain }}>No. RW:</label>
                    <input type="text" value={selectedRw} onChange={(e) => setSelectedRw(e.target.value)} placeholder="05" required style={{ width: '100%', padding: '12px', border: `1px solid ${darkMode ? '#334155' : '#cbd5e1'}`, backgroundColor: theme.bg, color: theme.textMain, borderRadius: '8px', outline: 'none' }} />
                </div>
            </div>
        </>
    );

    return (
        <div style={{ margin: 0, padding: 0, fontFamily: "'Inter', system-ui, sans-serif", backgroundColor: theme.bg, color: theme.textMain, minHeight: '100vh', display: 'flex', transition: 'all 0.3s ease' }}>
            
            {/* SIDEBAR NAVIGATION */}
            <aside style={{ width: '290px', backgroundColor: theme.sidebarBg, color: '#94a3b8', display: 'flex', flexDirection: 'column', boxShadow: '5px 0 25px rgba(0,0,0,0.1)', position: 'fixed', top: 0, bottom: 0, left: 0, zIndex: 100, transition: 'all 0.3s ease' }}>
                <div style={{ padding: '35px 28px', display: 'flex', alignItems: 'center', gap: '14px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <div style={{ background: 'linear-gradient(135deg, #22c55e 0%, #15803d 100%)', padding: '10px', borderRadius: '12px', color: 'white', fontWeight: 'bold', fontSize: '22px' }}>🌱</div>
                    <div>
                        <h3 style={{ margin: 0, color: 'white', fontWeight: '800', fontSize: '18px' }}>SmartCommunity</h3>
                        <span style={{ fontSize: '11px', color: '#4ade80', fontWeight: '700' }}>Portal Warga v3.5</span>
                    </div>
                </div>

                <div style={{ padding: '30px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {[
                        { id: 'dashboard', label: 'Dashboard Overview', icon: '📊' },
                        { id: 'riwayat', label: 'Setor Bank Sampah', icon: '⚖️' },
                        { id: 'maps', label: 'Peta Lokasi Mitra', icon: '🗺️' },
                        { id: 'reward', label: 'Tukar Poin Reward', icon: '🎁' },
                        { id: 'jadwal', label: 'Jadwal Armada RW', icon: '🗓️' },
                        { id: 'edukasi', label: 'Katalog Pintar Pilah', icon: '📘' },
                        { id: 'pengaduan', label: 'Ajukan Pengaduan', icon: '📢' },
                    ].map((menu) => (
                        <button key={menu.id} onClick={() => { setActiveMenu(menu.id); resetRegionalDropdowns(); }} style={{ display: 'flex', alignItems: 'center', gap: '14px', width: '100%', padding: '14px 20px', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', textAlign: 'left', backgroundColor: activeMenu === menu.id ? '#16a34a' : 'transparent', color: activeMenu === menu.id ? 'white' : '#94a3b8', transition: 'all 0.2s' }}>
                            <span style={{ fontSize: '18px' }}>{menu.icon}</span> {menu.label}
                        </button>
                    ))}
                </div>

                <div style={{ padding: '24px', borderTop: '1px solid rgba(255,255,255,0.04)', backgroundColor: 'rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ width: '44px', height: '44px', background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800' }}>
                        {storedUser?.name ? storedUser.name.charAt(0) : 'W'}
                    </div>
                    <div style={{ overflow: 'hidden', flex: 1 }}>
                        <p style={{ margin: 0, color: 'white', fontSize: '14px', fontWeight: '700', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{storedUser?.name || 'Warga Mandiri'}</p>
                        <span style={{ fontSize: '11px', color: '#4ade80' }}>Sektor Warga Mandiri</span>
                    </div>
                </div>
            </aside>

            {/* MAIN CONTAINER */}
            <main style={{ flex: 1, marginLeft: '290px', padding: '45px', boxSizing: 'border-box' }}>
                
                {/* NAVBAR TOP BAR */}
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', backgroundColor: theme.cardBg, padding: '24px 35px', borderRadius: '20px', border: `1px solid ${theme.border}`, boxShadow: '0 4px 18px rgba(0,0,0,0.01)' }}>
                    <div>
                        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '800', color: theme.textMain }}>
                            {activeMenu === 'dashboard' && 'Dashboard Overview'}
                            {activeMenu === 'riwayat' && 'Pusat Manajemen Log & Wilayah'}
                            {activeMenu === 'maps' && 'Peta Satelit Interaktif'}
                            {activeMenu === 'reward' && 'E-Voucher Rewards Hub'}
                            {activeMenu === 'jadwal' && 'Kalender Operasional RW'}
                            {activeMenu === 'edukasi' && 'Katalog Pemilahan Pintar'}
                            {activeMenu === 'pengaduan' && 'Layanan Pusat Laporan Real Indonesia'}
                        </h1>
                        <p style={{ margin: '4px 0 0 0', color: theme.textSub, fontSize: '13px' }}>Manajemen Sinkronisasi Data Setoran, Aduan & Peringkat Wilayah Se-Indonesia</p>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <button onClick={() => setDarkMode(!darkMode)} style={{ padding: '10px 16px', backgroundColor: darkMode ? '#1e293b' : '#f1f5f9', color: darkMode ? '#eab308' : '#475569', border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>
                            {darkMode ? '☀️ Mode Terang' : '🌙 Mode Gelap'}
                        </button>
                        <button onClick={handleLogout} style={{ padding: '12px 24px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '12px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}>Keluar</button>
                    </div>
                </header>

                {/* SCREEN 1: DASHBOARD */}
                {activeMenu === 'dashboard' && (
                    <>
                        <div style={{ background: 'linear-gradient(135deg, #15803d 0%, #052e16 100%)', padding: '40px', borderRadius: '24px', color: 'white', marginBottom: '40px', boxShadow: '0 10px 25px rgba(21,128,61,0.15)' }}>
                            <h2 style={{ margin: 0, fontSize: '28px', fontWeight: '800' }}>Selamat Datang Kembali, {storedUser?.name || 'Warga'}! 👋</h2>
                            <p style={{ margin: '8px 0 0 0', opacity: 0.85 }}>Sistem rekapitulasi data kebersihan terintegrasi. Pantau ekosistem lingkungan Anda disini.</p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '28px', marginBottom: '40px' }}>
                            <div style={{ backgroundColor: theme.cardBg, padding: '30px', borderRadius: '20px', border: `1px solid ${theme.border}`, display: 'flex', alignItems: 'center', gap: '24px' }}>
                                <div style={{ fontSize: '36px', backgroundColor: darkMode ? '#12251a' : '#f0fdf4', padding: '16px', borderRadius: '16px' }}>💰</div>
                                <div><span style={{ color: theme.textSub, fontSize: '13px' }}>Buku Kas Tabungan</span><h2 style={{ margin: '6px 0 0 0', color: '#16a34a', fontWeight: '800', fontSize: '28px' }}>Rp {totalSaldo.toLocaleString('id-ID')}</h2></div>
                            </div>
                            <div style={{ backgroundColor: theme.cardBg, padding: '30px', borderRadius: '20px', border: `1px solid ${theme.border}`, display: 'flex', alignItems: 'center', gap: '24px' }}>
                                <div style={{ fontSize: '36px', backgroundColor: darkMode ? '#0f2038' : '#eff6ff', padding: '16px', borderRadius: '16px' }}>⚖️</div>
                                <div><span style={{ color: theme.textSub, fontSize: '13px' }}>Massa Timbangan Anda</span><h2 style={{ margin: '6px 0 0 0', color: '#2563eb', fontWeight: '800', fontSize: '28px' }}>{totalBerat.toFixed(1)} Kg</h2></div>
                            </div>
                            <div style={{ backgroundColor: theme.cardBg, padding: '30px', borderRadius: '20px', border: `1px solid ${theme.border}`, display: 'flex', alignItems: 'center', gap: '24px' }}>
                                <div style={{ fontSize: '36px', backgroundColor: darkMode ? '#2d230a' : '#fefce8', padding: '16px', borderRadius: '16px' }}>🏆</div>
                                <div><span style={{ color: theme.textSub, fontSize: '13px' }}>Poin Kontribusi</span><h2 style={{ margin: '6px 0 0 0', color: '#ca8a04', fontWeight: '800', fontSize: '28px' }}>{points} Pts</h2></div>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                            <div style={{ backgroundColor: theme.cardBg, padding: '35px', borderRadius: '24px', border: `1px solid ${theme.border}` }}>
                                <h3 style={{ margin: '0 0 20px 0', color: theme.textMain }}>📊 Kalkulator Dampak Ekologi (Eco-Impact)</h3>
                                <div style={{ backgroundColor: darkMode ? '#12251a' : '#f0fdf4', padding: '18px', borderRadius: '14px', marginBottom: '14px', border: darkMode ? '1px solid #16a34a' : '1px solid #bbf7d0' }}>
                                    <h5 style={{ margin: 0, color: theme.textMain }}>Reduksi Emisi Gas CO₂</h5><h2 style={{ margin: '4px 0 0 0', color: '#16a34a', fontWeight: '900' }}>{carbonReduced.toFixed(1)} Kg</h2>
                                </div>
                                <div style={{ backgroundColor: darkMode ? '#0f2038' : '#eff6ff', padding: '18px', borderRadius: '14px', border: darkMode ? '1px solid #2563eb' : '1px solid #bfdbfe' }}>
                                    <h5 style={{ margin: 0, color: theme.textMain }}>Simulasi Pohon Hidup Diselamatkan</h5><h2 style={{ margin: '4px 0 0 0', color: '#2563eb', fontWeight: '900' }}>{treesSaved} Pohon</h2>
                                </div>
                            </div>

                            <div style={{ backgroundColor: theme.cardBg, padding: '35px', borderRadius: '24px', border: `1px solid ${theme.border}` }}>
                                <h3 style={{ margin: '0 0 4px 0', color: theme.textMain }}>🏆 Peringkat Sektor Wilayah Ter-Hijau Real-Time</h3>
                                <p style={{ margin: '0 0 20px 0', color: theme.textSub, fontSize: '12px' }}>*Leaderboard ter-update otomatis seketika dari akumulasi form berat setoran sampah warga.</p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {leaderboardDinamis.map((item, i) => (
                                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', backgroundColor: darkMode ? '#1a2436' : '#f8fafc', borderRadius: '12px', border: `1px solid ${theme.border}` }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                                <span style={{ fontSize: '18px', fontWeight: '900' }}>{item.badge}</span>
                                                <div>
                                                    <span style={{ fontSize: '14px', fontWeight: '700', color: theme.textMain, display: 'block' }}>{item.wilayah}</span>
                                                    <span style={{ fontSize: '11px', color: theme.textSub }}>{item.deskripsi}</span>
                                                </div>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <span style={{ fontSize: '14px', fontWeight: '800', color: '#16a34a', display: 'block' }}>{item.massa}</span>
                                                <span style={{ fontSize: '11px', color: theme.textSub }}>{item.poin}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* SCREEN 2: SETOR BANK SAMPAH */}
                {activeMenu === 'riwayat' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                        <div style={{ backgroundColor: theme.cardBg, padding: '35px', borderRadius: '24px', border: `1px solid ${theme.border}` }}>
                            <h3 style={{ color: theme.textMain, marginBottom: '20px' }}>{isEditingSetoran ? '📝 Edit Berkas Setoran Timbangan' : '➕ Input Pembukuan Setoran & Validasi Wilayah'}</h3>
                            <form onSubmit={handleSaveSetoran} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                                    <div style={{ flex: 2, minWidth: '260px' }}>
                                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', color: theme.textMain }}>Kategori Material (Ketik Bebas):</label>
                                        <input type="text" value={inputJenis} onChange={(e) => handleJenisTxtChange(e.target.value)} placeholder="Contoh: Plastik HDPE, Kardus Box..." required style={{ width: '100%', padding: '14px', border: `2px solid ${darkMode ? '#334155' : '#cbd5e1'}`, backgroundColor: theme.bg, color: theme.textMain, borderRadius: '12px', outline: 'none' }} />
                                    </div>
                                    <div style={{ width: '150px' }}>
                                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', color: theme.textMain }}>Berat (Kg):</label>
                                        <input type="number" step="0.1" value={inputBerat} onChange={(e) => handleBeratTxtChange(e.target.value)} placeholder="0.0" required style={{ width: '100%', padding: '14px', border: `2px solid ${darkMode ? '#334155' : '#cbd5e1'}`, backgroundColor: theme.bg, color: theme.textMain, borderRadius: '12px', outline: 'none' }} />
                                    </div>
                                    <div style={{ width: '220px' }}>
                                        <label style={{ display: 'block', marginBottom: '8px', color: '#16a34a', fontWeight: '700' }}>Nominal Rupiah Cair:</label>
                                        <div style={{ padding: '14px', border: '2px solid #22c55e', backgroundColor: darkMode ? '#12251a' : '#f0fdf4', color: '#16a34a', fontWeight: '800', borderRadius: '12px' }}>Rp {inputNominal.toLocaleString('id-ID')}</div>
                                    </div>
                                </div>

                                {/* Pemanggilan Form Peta Regional Bertingkat */}
                                {renderDropdownRegional()}

                                <button type="submit" style={{ padding: '16px', backgroundColor: '#16a34a', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: '15px', cursor: 'pointer' }}>
                                    Submit Timbangan & Kalkulasi Real-Time
                                </button>
                            </form>
                        </div>

                        {/* TABEL LOG */}
                        <div style={{ backgroundColor: theme.cardBg, padding: '35px', borderRadius: '24px', border: `1px solid ${theme.border}` }}>
                            <h3 style={{ color: theme.textMain, marginBottom: '24px' }}>Log Arsip Rekapitulasi Timbangan Warga</h3>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ backgroundColor: darkMode ? '#1e293b' : '#f8fafc', borderBottom: `2px solid ${theme.border}`, color: theme.textMain }}>
                                        <th style={{ padding: '18px' }}>Tanggal</th><th style={{ padding: '18px' }}>Kategori</th><th style={{ padding: '18px' }}>Sektor Wilayah Real</th><th style={{ padding: '18px' }}>Berat Bersih</th><th style={{ padding: '18px' }}>Nilai Cair</th><th style={{ padding: '18px', textAlign: 'center' }}>Operasi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {riwayatSetoran.map((item) => (
                                        <tr key={item.id} style={{ borderBottom: `1px solid ${theme.border}`, color: theme.textMain }} onMouseOver={(e)=>e.currentTarget.style.backgroundColor=theme.tableRowHover} onMouseOut={(e)=>e.currentTarget.style.backgroundColor='transparent'}>
                                            <td style={{ padding: '18px', color: theme.textSub }}>{item.tanggal}</td>
                                            <td style={{ padding: '18px', fontWeight: 'bold' }}>{item.jenis}</td>
                                            <td style={{ padding: '18px', fontSize: '13px' }}>
                                                <span style={{ fontWeight: '600', display: 'block' }}>{item.kelurahan} (RT {item.rt}/RW {item.rw})</span>
                                                <span style={{ color: theme.textSub, fontSize: '11px' }}>{item.kecamatan}, {item.kabupaten}</span>
                                            </td>
                                            <td style={{ padding: '18px' }}>{item.berat} Kg</td>
                                            <td style={{ padding: '18px', color: '#16a34a', fontWeight: 'bold' }}>Rp {item.pendapatan.toLocaleString('id-ID')}</td>
                                            <td style={{ padding: '18px', display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                                <button onClick={() => handleTriggerStruk(item)} style={{ padding: '6px 12px', backgroundColor: '#e0f2fe', color: '#0369a1', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>🧾 Struk</button>
                                                <button onClick={() => handleEditSetoran(item)} style={{ padding: '6px 12px', backgroundColor: '#fef3c7', color: '#d97706', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Ubah</button>
                                                <button onClick={() => handleDeleteSetoran(item.id)} style={{ padding: '6px 12px', backgroundColor: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Hapus</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* SCREEN 3: MAPS */}
                {activeMenu === 'maps' && (
                    <div style={{ backgroundColor: theme.cardBg, padding: '35px', borderRadius: '24px', border: `1px solid ${theme.border}` }}>
                        <form onSubmit={handleSearchMap} style={{ display: 'flex', gap: '14px', marginBottom: '28px' }}>
                            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Ketik wilayah penelusuran peta..." style={{ flex: 1, padding: '14px', border: `2px solid ${darkMode ? '#334155' : '#cbd5e1'}`, backgroundColor: theme.bg, color: theme.textMain, borderRadius: '12px', outline: 'none' }} />
                            <button type="submit" style={{ padding: '14px 28px', backgroundColor: '#16a34a', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700' }}>Cari Peta</button>
                        </form>
                        <iframe title="Maps" src={mapUrl} width="100%" height="520px" style={{ border: 0, borderRadius: '16px', filter: darkMode ? 'invert(90%) hue-rotate(180deg)' : 'none' }}></iframe>
                    </div>
                )}

                {/* SCREEN 4: REWARD */}
                {activeMenu === 'reward' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '28px' }}>
                        {rewards.map(r => (
                            <div key={r.id} style={{ backgroundColor: theme.cardBg, padding: '35px', borderRadius: '24px', border: `1px solid ${theme.border}`, textAlign: 'center' }}>
                                <div style={{ fontSize: '48px' }}>{r.ikon}</div><h4 style={{ color: theme.textMain }}>{r.nama}</h4><p style={{ color: '#16a34a', fontWeight: 'bold', fontSize: '20px' }}>{r.butuhPoin} Pts</p>
                                <button onClick={() => handleClaimReward(r)} style={{ width: '100%', padding: '12px', backgroundColor: '#16a34a', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>Klaim Hadiah</button>
                            </div>
                        ))}
                    </div>
                )}

                {/* SCREEN 5 & 6 */}
                {activeMenu === 'jadwal' && <div style={{ backgroundColor: theme.cardBg, padding: '35px', borderRadius: '24px', border: `1px solid ${theme.border}`, color: theme.textMain }}><h3>🗓 JADWAL OPERASIONAL TRUK RW</h3><p style={{ color: theme.textSub }}>Senin 07.00 WIB: Sampah Basah Organik Dapur</p><p style={{ color: theme.textSub }}>Rabu 09.30 WIB: Klaster Penjemputan Timbangan Depot Pusat</p></div>}
                {activeMenu === 'edukasi' && <div style={{ backgroundColor: theme.cardBg, padding: '35px', borderRadius: '24px', border: `1px solid ${theme.border}`, color: theme.textMain }}><h3>📘 CATALOG PINTAR KLASIFIKASI</h3><p style={{ color: '#16a34a' }}><b>Bernilai Ekonomis:</b> Plastik Kemasan PET, Kardus Box Cokelat, Besi Tua, Alumunium Kaleng</p><p style={{ color: '#ef4444' }}><b>Residu B3 Ditolak:</b> Jarum Suntik Medis, Masker Bekas, Neon Pijar, Wadah Styrofoam</p></div>}

                {/* ==================== SCREEN 7: AJUKAN PENGADUAN (KOMPLIT LOKASI ASLI INDONESIA) ==================== */}
                {activeMenu === 'pengaduan' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '35px', alignItems: 'flex-start' }}>
                        <div style={{ backgroundColor: theme.cardBg, padding: '35px', borderRadius: '24px', border: `1px solid ${theme.border}`, boxShadow: '0 4px 10px rgba(0,0,0,0.005)' }}>
                            <h3 style={{ margin: '0 0 20px 0', color: theme.textMain, fontWeight: '800' }}>
                                {isEditingAduan ? '📝 Koreksi Berkas Pengaduan Sektor' : '📢 Form Aduan Wilayah Real Indonesia 100%'}
                            </h3>
                            <form onSubmit={handleSaveAduan} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                
                                {/* Pemanggilan Form Dropdown Bertingkat Reusable */}
                                {renderDropdownRegional()}

                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', color: theme.textMain }}>Rincian Laporan Kendala:</label>
                                    <textarea rows="4" value={inputAduanPerihal} onChange={(e) => setInputAduanPerihal(e.target.value)} placeholder="Ceritakan penumpukan limbah liar atau penyumbatan gorong-gorong secara mendalam..." required style={{ width: '100%', padding: '12px', border: `1px solid ${darkMode ? '#334155' : '#cbd5e1'}`, backgroundColor: theme.bg, color: theme.textMain, borderRadius: '8px', resize: 'none', outline: 'none' }}></textarea>
                                </div>
                                <button type="submit" style={{ padding: '14px', backgroundColor: '#16a34a', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}>
                                    {isEditingAduan ? 'Simpan Pembaruan Aduan' : 'Kirim Laporan Resmi'}
                                </button>
                            </form>
                        </div>

                        {/* ARSIP DOKUMEN ADUAN */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <h3 style={{ margin: 0, color: theme.textMain, fontWeight: '800' }}>Arsip Pengaduan Berkas Terkirim</h3>
                            {riwayatAduan.map(a => (
                                <div key={a.id} style={{ backgroundColor: theme.cardBg, padding: '24px', borderRadius: '16px', border: `1px solid ${theme.border}` }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                                        <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '700' }}>DOC-ID #{a.id.toString().slice(-5)}</span>
                                        <span style={{ backgroundColor: '#ffedd5', color: '#c2410c', padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '700' }}>{a.status}</span>
                                    </div>
                                    <div style={{ fontSize: '13px', color: theme.textMain, display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '12px', backgroundColor: darkMode ? '#1e293b' : '#f8fafc', padding: '12px', borderRadius: '8px', border: `1px solid ${theme.border}` }}>
                                        <p style={{ margin: 0 }}><b>Wilayah Real:</b> {a.kelurahan} (RT {a.rt} / RW {a.rw})</p>
                                        <p style={{ margin: 0 }}><b>Kec/Kab:</b> {a.kecamatan}, {a.kabupaten}</p>
                                        <p style={{ margin: 0, color: theme.textSub }}><b>Provinsi:</b> {a.provinsi}</p>
                                    </div>
                                    <p style={{ margin: 0, fontSize: '13px', color: theme.textSub, fontStyle: 'italic' }}>"{a.perihal}"</p>
                                    <div style={{ display: 'flex', gap: '10px', borderTop: `1px solid ${theme.border}`, paddingTop: '16px', marginTop: '14px' }}>
                                        <button onClick={() => handleEditAduan(a)} style={{ padding: '6px 14px', backgroundColor: '#fef3c7', color: '#d97706', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: '700' }}>Ubah</button>
                                        <button onClick={() => handleDeleteAduan(a.id)} style={{ padding: '6px 14px', backgroundColor: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: '700' }}>Hapus</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* FOOTER */}
                <footer style={{ marginTop: '80px', borderTop: `1px solid ${theme.border}`, padding: '24px 0', textAlign: 'center', color: '#94a3b8', fontSize: '13px', fontWeight: '500' }}>
                    <p style={{ margin: 0 }}>Proyek Aplikasi UTS Praktikum Sistem Informasi Manajemen Kelurahan — Selesai Sempurna</p>
                    <p style={{ margin: '4px 0 0 0', fontWeight: '700', color: '#16a34a' }}>Secure System Architecture Connected to Laragon Core Daemon Node</p>
                </footer>

            </main>

            {/* MODAL STRUK */}
            {showModalStruk && selectedStruk && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15,23,42,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ backgroundColor: 'white', padding: '35px', borderRadius: '24px', width: '380px', fontFamily: "'Courier New', Courier, monospace", color: '#000', border: '2px dashed #000' }}>
                        <div style={{ textAlign: 'center', marginBottom: '20px', borderBottom: '2px dashed #000', paddingBottom: '15px' }}>
                            <h3 style={{ margin: 0, fontWeight: '900' }}>BANK SAMPAH DIGITAL</h3>
                            <p style={{ margin: 0, fontSize: '12px' }}>STRUK ID: #STK-{selectedStruk.id.toString().slice(-6)}</p>
                        </div>
                        <div style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Tanggal:</span> <span>{selectedStruk.tanggal}</span></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Wilayah Sektor:</span> <span>{selectedStruk.kelurahan}</span></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>RT / RW:</span> <span>RT {selectedStruk.rt} / RW {selectedStruk.rw}</span></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Kategori:</span> <span style={{ fontWeight: 'bold' }}>{selectedStruk.jenis}</span></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Berat Bersih:</span> <span style={{ fontWeight: 'bold' }}>{selectedStruk.berat} Kg</span></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px dashed #000', paddingTop: '10px', fontSize: '15px', fontWeight: 'bold' }}><span>TOTAL CAIR:</span> <span>Rp {selectedStruk.pendapatan.toLocaleString('id-ID')}</span></div>
                        </div>
                        <button onClick={() => setShowModalStruk(false)} style={{ width: '100%', padding: '12px', backgroundColor: '#000', color: 'white', border: 'none', borderRadius: '12px', fontFamily: 'sans-serif', fontWeight: '700' }}>Tutup Salinan Nota</button>
                    </div>
                </div>
            )}

        </div>
    );
};

export default UserDashboard;