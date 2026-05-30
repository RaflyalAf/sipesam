import React, { useState, useEffect } from 'react';

const UserDashboard = () => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const [activeMenu, setActiveMenu] = useState('dashboard');
    
    // ==================== THEME ENGINE STATE ====================
    const [darkMode, setDarkMode] = useState(false);

    // ==================== STATE MANAGEMENT DATA (CRUD) ====================
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
        localStorage.setItem('riwayatSetoran', JSON.stringify(defaultSetoran));
        return defaultSetoran;
    });

    const [inputJenis, setInputJenis] = useState('');
    const [inputBerat, setInputBerat] = useState('');
    const [inputNominal, setInputNominal] = useState(0);
    const [isEditingSetoran, setIsEditingSetoran] = useState(false);
    const [editSetoranId, setEditSetoranId] = useState(null);

    const [showModalStruk, setShowModalStruk] = useState(false);
    const [selectedStruk, setSelectedStruk] = useState(null);

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
    
    const [inputAduanPerihal, setInputAduanPerihal] = useState('');
    const [isEditingAduan, setIsEditingAduan] = useState(false);
    const [editAduanId, setEditAduanId] = useState(null);

    const [jadwalArmada, setJadwalArmada] = useState([]);

    // ==================== API WILAYAH INDONESIA ENGINE ====================
    const [provinces, setProvinces] = useState([]);
    const [regencies, setRegencies] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [villages, setVillages] = useState([]);

    const [selectedProv, setSelectedProv] = useState('');
    const [selectedKab, setSelectedKab] = useState('');
    const [selectedKec, setSelectedKec] = useState('');
    const [selectedKel, setSelectedKel] = useState('');
    const [selectedRt, setSelectedRt] = useState('');
    const [selectedRw, setSelectedRw] = useState('');

    const [searchQuery, setSearchQuery] = useState('Indonesia');
    const [mapUrl, setMapUrl] = useState('https://maps.google.com/maps?q=bank%20sampah%20Indonesia&t=&z=5&ie=UTF8&iwloc=&output=embed');

    const [points, setPoints] = useState(420); 
    const [rewards, setRewards] = useState([
        { id: 1, nama: 'Voucher Token Listrik Rp 20.000', butuhPoin: 200, stok: 5, ikon: '⚡', gradasi: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)' },
        { id: 2, nama: 'Voucher Pulsa All Operator Rp 10.000', butuhPoin: 100, stok: 12, ikon: '📱', gradasi: 'linear-gradient(135deg, #60a5fa 0%, #2563eb 100%)' },
        { id: 3, nama: 'Kupon Paket Sembako Gratis RW', butuhPoin: 350, stok: 2, ikon: '🛍️', gradasi: 'linear-gradient(135deg, #f472b6 0%, #db2777 100%)' },
    ]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    const resetRegionalDropdowns = () => {
        setSelectedProv(''); setSelectedKab(''); setSelectedKec(''); setSelectedKel('');
        setSelectedRt(''); setSelectedRw('');
        setRegencies([]); setDistricts([]); setVillages([]);
    };

    // ==================== SIDE EFFECTS: SYNC DATA LOCALSTORAGE ====================
    useEffect(() => {
        localStorage.setItem('riwayatSetoran', JSON.stringify(riwayatSetoran));
    }, [riwayatSetoran]);

    useEffect(() => {
        localStorage.setItem('riwayatAduan', JSON.stringify(riwayatAduan));
    }, [riwayatAduan]);

    useEffect(() => {
        const syncData = () => {
            setRiwayatSetoran(JSON.parse(localStorage.getItem('riwayatSetoran') || '[]'));
            setRiwayatAduan(JSON.parse(localStorage.getItem('riwayatAduan') || '[]'));
            setJadwalArmada(JSON.parse(localStorage.getItem('jadwalArmada') || '[]'));
        };
        syncData();
        const interval = setInterval(syncData, 1000);
        return () => clearInterval(interval);
    }, []);

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

    const handleSearchMap = (e) => {
        e.preventDefault();
        if (searchQuery.trim() !== '') {
            const formattedQuery = encodeURIComponent(`bank sampah ${searchQuery}`);
            const newUrl = `https://maps.google.com/maps?q=${formattedQuery}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
            setMapUrl(newUrl);
        }
    };

    const calculateAutomatedPrice = (teksKategori, nilaiBerat) => {
        const beratFloat = parseFloat(nilaiBerat);
        if (!teksKategori || isNaN(beratFloat) || beratFloat <= 0) {
            setInputNominal(0);
            return;
        }
        const kategoriLower = teksKategori.toLowerCase();
        let hargaPerKg = 4000;
        if (kategoriLower.includes('plastik')) hargaPerKg = 5000;
        else if (kategoriLower.includes('kertas') || kategoriLower.includes('kardus')) hargaPerKg = 3500;
        else if (kategoriLower.includes('logam') || kategoriLower.includes('besi') || kategoriLower.includes('kaleng')) hargaPerKg = 12000;
        else if (kategoriLower.includes('kaca') || kategoriLower.includes('botol')) hargaPerKg = 2500;
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

    // ==================== WOW THEME ARCHITECTURE (FIXED) ====================
    const theme = {
        bg: darkMode ? '#090d16' : '#f4f6fa',
        cardBg: darkMode ? '#111827' : '#ffffff',
        textMain: darkMode ? '#f9fafb' : '#111827',
        textSub: darkMode ? '#9ca3af' : '#6b7280',
        border: darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
        sidebarBg: darkMode ? '#05070c' : '#0a251c',
        tableHeader: darkMode ? '#1f2937' : '#f3f4f6',
        inputBg: darkMode ? '#1f2937' : '#fff'
    };

    const renderDropdownRegional = () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '700', color: theme.textMain, letterSpacing: '0.3px' }}>Provinsi Utama</label>
                    <select onChange={(e) => { const idx = e.target.selectedIndex; handleSelectProvinsi(e.target.value, e.target.options[idx].text); }} style={{ width: '100%', padding: '14px', border: `1px solid ${theme.border}`, backgroundColor: theme.inputBg, color: theme.textMain, borderRadius: '12px', outline: 'none', transition: '0.2s', fontSize: '14px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }} required>
                        <option value="">-- Pilih Provinsi --</option>
                        {provinces.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '700', color: theme.textMain, letterSpacing: '0.3px' }}>Kota / Kabupaten</label>
                    <select disabled={regencies.length === 0} onChange={(e) => { const idx = e.target.selectedIndex; handleSelectKabupaten(e.target.value, e.target.options[idx].text); }} style={{ width: '100%', padding: '14px', border: `1px solid ${theme.border}`, backgroundColor: theme.inputBg, color: theme.textMain, borderRadius: '12px', outline: 'none', transition: '0.2s', fontSize: '14px' }} required>
                        <option value="">-- Pilih Kota / Kabupaten --</option>
                        {regencies.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                    </select>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '700', color: theme.textMain, letterSpacing: '0.3px' }}>Kecamatan Sektor</label>
                    <select disabled={districts.length === 0} onChange={(e) => { const idx = e.target.selectedIndex; handleSelectKecamatan(e.target.value, e.target.options[idx].text); }} style={{ width: '100%', padding: '14px', border: `1px solid ${theme.border}`, backgroundColor: theme.inputBg, color: theme.textMain, borderRadius: '12px', outline: 'none', transition: '0.2s', fontSize: '14px' }} required>
                        <option value="">-- Pilih Kecamatan --</option>
                        {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '700', color: theme.textMain, letterSpacing: '0.3px' }}>Kelurahan / Kelompok Desa</label>
                    <select disabled={villages.length === 0} onChange={(e) => setSelectedKel(e.target.value)} value={selectedKel} style={{ width: '100%', padding: '14px', border: `1px solid ${theme.border}`, backgroundColor: theme.inputBg, color: theme.textMain, borderRadius: '12px', outline: 'none', transition: '0.2s', fontSize: '14px' }} required>
                        <option value="">-- Pilih Kelurahan / Desa --</option>
                        {villages.map(v => <option key={v.id} value={v.name}>{v.name}</option>)}
                    </select>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '25px', maxWidth: '340px' }}>
                <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '700', color: theme.textMain }}>No. RT</label>
                    <input type="text" value={selectedRt} onChange={(e) => setSelectedRt(e.target.value)} placeholder="e.g. 03" required style={{ width: '100%', padding: '14px', border: `1px solid ${theme.border}`, backgroundColor: theme.inputBg, color: theme.textMain, borderRadius: '12px', outline: 'none', fontSize: '14px' }} />
                </div>
                <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '700', color: theme.textMain }}>No. RW</label>
                    <input type="text" value={selectedRw} onChange={(e) => setSelectedRw(e.target.value)} placeholder="e.g. 09" required style={{ width: '100%', padding: '14px', border: `1px solid ${theme.border}`, backgroundColor: theme.inputBg, color: theme.textMain, borderRadius: '12px', outline: 'none', fontSize: '14px' }} />
                </div>
            </div>
        </div>
    );

    return (
        <div style={{ margin: 0, padding: 0, fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif", backgroundColor: theme.bg, color: theme.textMain, minHeight: '100vh', display: 'flex', transition: 'background-color 0.3s ease' }}>
            
            {/* SIDEBAR NAVIGATION */}
            <aside style={{ width: '300px', backgroundColor: theme.sidebarBg, color: '#e5e7eb', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, bottom: 0, left: 0, zIndex: 100, borderRight: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ padding: '40px 30px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', width: '45px', height: '45px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 15px rgba(16,185,129,0.3)', color: '#fff', fontSize: '20px' }}>🌱</div>
                    <div>
                        <h3 style={{ margin: 0, color: 'white', fontWeight: '800', fontSize: '20px', letterSpacing: '-0.5px' }}>Sipesam</h3>
                        <span style={{ fontSize: '11px', color: '#34d399', fontWeight: '700', uppercase: 'true' }}>Portal Hub v3.5</span>
                    </div>
                </div>

                <div style={{ padding: '20px 20px', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {[
                        { id: 'dashboard', label: 'Dashboard Overview', icon: '📊' },
                        { id: 'riwayat', label: 'Setor Bank Sampah', icon: '⚖️' },
                        { id: 'maps', label: 'Peta Lokasi Mitra', icon: '🗺️' },
                        { id: 'reward', label: 'Tukar Poin Reward', icon: '🎁' },
                        { id: 'jadwal', label: 'Jadwal Armada RW', icon: '🗓️' },
                        { id: 'edukasi', label: 'Katalog Pintar Pilah', icon: '📘' },
                        { id: 'pengaduan', label: 'Ajukan Pengaduan', icon: '📢' },
                    ].map((menu) => (
                        <button key={menu.id} onClick={() => { setActiveMenu(menu.id); resetRegionalDropdowns(); }} style={{ display: 'flex', alignItems: 'center', gap: '14px', width: '100%', padding: '14px 20px', border: 'none', borderRadius: '14px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', textAlign: 'left', backgroundColor: activeMenu === menu.id ? '#10b981' : 'transparent', color: activeMenu === menu.id ? 'white' : '#9ca3af', boxShadow: activeMenu === menu.id ? '0 4px 15px rgba(16,185,129,0.2)' : 'none', transition: 'all 0.2s ease-in-out' }}>
                            <span style={{ fontSize: '18px' }}>{menu.icon}</span> {menu.label}
                        </button>
                    ))}
                </div>

                <div style={{ padding: '25px', backgroundColor: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ width: '45px', height: '45px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800', fontSize: '16px' }}>
                        {storedUser?.name ? storedUser.name.charAt(0) : 'W'}
                    </div>
                    <div style={{ overflow: 'hidden', flex: 1 }}>
                        <p style={{ margin: 0, color: 'white', fontSize: '14px', fontWeight: '700', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{storedUser?.name || 'Warga Mandiri'}</p>
                        <span style={{ fontSize: '11px', color: '#10b981', fontWeight: '600' }}>Sektor Kolektif</span>
                    </div>
                </div>
            </aside>

            {/* MAIN CONTAINER */}
            <main style={{ flex: 1, marginLeft: '300px', padding: '50px 60px', boxSizing: 'border-box' }}>
                
                {/* NAVBAR TOP BAR */}
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', backgroundColor: theme.cardBg, padding: '25px 40px', borderRadius: '24px', border: `1px solid ${theme.border}`, boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                    <div>
                        <h1 style={{ margin: 0, fontSize: '26px', fontWeight: '800', color: theme.textMain, letterSpacing: '-0.5px' }}>
                            {activeMenu === 'dashboard' && 'Dashboard Center'}
                            {activeMenu === 'riwayat' && 'Pusat Manajemen Log Sampah'}
                            {activeMenu === 'maps' && 'Peta Satelit Interaktif'}
                            {activeMenu === 'reward' && 'E-Voucher Rewards Hub'}
                            {activeMenu === 'jadwal' && 'Kalender Operasional RW'}
                            {activeMenu === 'edukasi' && 'Katalog Pemilahan Pintar'}
                            {activeMenu === 'pengaduan' && 'Layanan Pengaduan Indonesia'}
                        </h1>
                        <p style={{ margin: '4px 0 0 0', color: theme.textSub, fontSize: '13px' }}>Monitoring ekosistem lingkungan pintar secara real-time</p>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <button onClick={() => setDarkMode(!darkMode)} style={{ padding: '12px 20px', backgroundColor: darkMode ? '#1f2937' : '#fff', color: darkMode ? '#fbbf24' : '#4b5563', border: `1px solid ${theme.border}`, borderRadius: '14px', fontWeight: '700', fontSize: '13px', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                            {darkMode ? '☀️ Mode Terang' : '🌙 Mode Gelap'}
                        </button>
                        <button onClick={handleLogout} style={{ padding: '12px 22px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '14px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 10px rgba(239,68,68,0.2)' }}>Keluar</button>
                    </div>
                </header>

                {/* SCREEN 1: DASHBOARD */}
                {activeMenu === 'dashboard' && (
                    <>
                        <div style={{ background: 'linear-gradient(135deg, #047857 0%, #064e3b 100%)', padding: '45px', borderRadius: '28px', color: 'white', marginBottom: '40px', boxShadow: '0 10px 30px rgba(4,120,87,0.2)' }}>
                            <h2 style={{ margin: 0, fontSize: '30px', fontWeight: '800', letterSpacing: '-0.5px' }}>Selamat Datang Kembali, {storedUser?.name || 'Warga'}! 👋</h2>
                            <p style={{ margin: '8px 0 0 0', opacity: 0.85, fontSize: '15px' }}>Rekapitulasi data kebersihan terintegrasi. Lingkungan hijau dimulai dari aksi nyata Anda.</p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px', marginBottom: '40px' }}>
                            <div style={{ backgroundColor: theme.cardBg, padding: '30px', borderRadius: '24px', border: `1px solid ${theme.border}`, display: 'flex', alignItems: 'center', gap: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.01)' }}>
                                <div style={{ fontSize: '32px', backgroundColor: darkMode ? '#064e3b' : '#e6f4ea', padding: '18px', borderRadius: '20px' }}>💰</div>
                                <div><span style={{ color: theme.textSub, fontSize: '13px', fontWeight: '600' }}>Kas Tabungan</span><h2 style={{ margin: '4px 0 0 0', color: '#10b981', fontWeight: '800', fontSize: '26px' }}>Rp {totalSaldo.toLocaleString('id-ID')}</h2></div>
                            </div>
                            <div style={{ backgroundColor: theme.cardBg, padding: '30px', borderRadius: '24px', border: `1px solid ${theme.border}`, display: 'flex', alignItems: 'center', gap: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.01)' }}>
                                <div style={{ fontSize: '32px', backgroundColor: darkMode ? '#1e3a8a' : '#eff6ff', padding: '18px', borderRadius: '20px' }}>⚖️</div>
                                <div><span style={{ color: theme.textSub, fontSize: '13px', fontWeight: '600' }}>Total Timbangan</span><h2 style={{ margin: '4px 0 0 0', color: '#3b82f6', fontWeight: '800', fontSize: '26px' }}>{totalBerat.toFixed(1)} Kg</h2></div>
                            </div>
                            <div style={{ backgroundColor: theme.cardBg, padding: '30px', borderRadius: '24px', border: `1px solid ${theme.border}`, display: 'flex', alignItems: 'center', gap: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.01)' }}>
                                <div style={{ fontSize: '32px', backgroundColor: darkMode ? '#78350f' : '#fefce8', padding: '18px', borderRadius: '20px' }}>🏆</div>
                                <div><span style={{ color: theme.textSub, fontSize: '13px', fontWeight: '600' }}>Poin Kontribusi</span><h2 style={{ margin: '4px 0 0 0', color: '#f59e0b', fontWeight: '800', fontSize: '26px' }}>{points} Pts</h2></div>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '35px' }}>
                            <div style={{ backgroundColor: theme.cardBg, padding: '40px', borderRadius: '28px', border: `1px solid ${theme.border}`, boxShadow: '0 4px 20px rgba(0,0,0,0.01)' }}>
                                <h3 style={{ margin: '0 0 25px 0', color: theme.textMain, fontSize: '18px', fontWeight: '800' }}>📊 Kalkulator Dampak Ekologi</h3>
                                <div style={{ backgroundColor: darkMode ? 'rgba(16,185,129,0.08)' : '#f0fdf4', padding: '20px', borderRadius: '18px', marginBottom: '16px', border: `1px solid ${darkMode ? '#064e3b' : '#bbf7d0'}` }}>
                                    <h5 style={{ margin: 0, color: theme.textMain, fontSize: '14px', fontWeight: '600' }}>Reduksi Emisi Gas CO₂</h5><h2 style={{ margin: '6px 0 0 0', color: '#10b981', fontWeight: '900', fontSize: '32px' }}>{carbonReduced.toFixed(1)} Kg</h2>
                                </div>
                                <div style={{ backgroundColor: darkMode ? 'rgba(59,130,246,0.08)' : '#eff6ff', padding: '20px', borderRadius: '18px', border: `1px solid ${darkMode ? '#1e3a8a' : '#bfdbfe'}` }}>
                                    <h5 style={{ margin: 0, color: theme.textMain, fontSize: '14px', fontWeight: '600' }}>Simulasi Pohon Diselamatkan</h5><h2 style={{ margin: '6px 0 0 0', color: '#3b82f6', fontWeight: '900', fontSize: '32px' }}>{treesSaved} Pohon</h2>
                                </div>
                            </div>

                            <div style={{ backgroundColor: theme.cardBg, padding: '40px', borderRadius: '28px', border: `1px solid ${theme.border}`, boxShadow: '0 4px 20px rgba(0,0,0,0.01)' }}>
                                <h3 style={{ margin: '0 0 4px 0', color: theme.textMain, fontSize: '18px', fontWeight: '800' }}>🏆 Peringkat Wilayah Ter-Hijau</h3>
                                <p style={{ margin: '0 0 25px 0', color: theme.textSub, fontSize: '12px' }}>Akumulasi otomatis dari berat total setoran sampah warga</p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                    {leaderboardDinamis.map((item, i) => (
                                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', backgroundColor: darkMode ? '#1f2937' : '#f9fafb', borderRadius: '16px', border: `1px solid ${theme.border}` }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                <span style={{ fontSize: '20px' }}>{item.badge}</span>
                                                <div>
                                                    <span style={{ fontSize: '14px', fontWeight: '700', color: theme.textMain, display: 'block' }}>{item.wilayah}</span>
                                                    <span style={{ fontSize: '12px', color: theme.textSub }}>{item.deskripsi}</span>
                                                </div>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <span style={{ fontSize: '15px', fontWeight: '800', color: '#10b981', display: 'block' }}>{item.massa}</span>
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
                        <div style={{ backgroundColor: theme.cardBg, padding: '40px', borderRadius: '28px', border: `1px solid ${theme.border}`, boxShadow: '0 4px 20px rgba(0,0,0,0.01)' }}>
                            <h3 style={{ color: theme.textMain, marginBottom: '25px', fontSize: '18px', fontWeight: '800' }}>{isEditingSetoran ? '📝 Edit Berkas Setoran Timbangan' : '➕ Input Pembukuan Setoran & Validasi'}</h3>
                            <form onSubmit={handleSaveSetoran} style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                                <div style={{ display: 'flex', gap: '25px', flexWrap: 'wrap' }}>
                                    <div style={{ flex: 2, minWidth: '280px' }}>
                                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', color: theme.textMain, fontSize: '13px' }}>Kategori Material (Ketik Bebas)</label>
                                        <input type="text" value={inputJenis} onChange={(e) => handleJenisTxtChange(e.target.value)} placeholder="Contoh: Plastik HDPE, Kardus Box..." required style={{ width: '100%', padding: '14px', border: `1px solid ${theme.border}`, backgroundColor: theme.inputBg, color: theme.textMain, borderRadius: '12px', outline: 'none', fontSize: '14px' }} />
                                    </div>
                                    <div style={{ width: '160px' }}>
                                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', color: theme.textMain, fontSize: '13px' }}>Berat (Kg)</label>
                                        <input type="number" step="0.1" value={inputBerat} onChange={(e) => handleBeratTxtChange(e.target.value)} placeholder="0.0" required style={{ width: '100%', padding: '14px', border: `1px solid ${theme.border}`, backgroundColor: theme.inputBg, color: theme.textMain, borderRadius: '12px', outline: 'none', fontSize: '14px' }} />
                                    </div>
                                    <div style={{ width: '240px' }}>
                                        <label style={{ display: 'block', marginBottom: '8px', color: '#10b981', fontWeight: '700', fontSize: '13px' }}>Nominal Rupiah Cair</label>
                                        <div style={{ padding: '14px', border: '1px solid #10b981', backgroundColor: darkMode ? 'rgba(16,185,129,0.05)' : '#e6f4ea', color: '#059669', fontWeight: '800', borderRadius: '12px', fontSize: '15px' }}>Rp {inputNominal.toLocaleString('id-ID')}</div>
                                    </div>
                                </div>

                                {renderDropdownRegional()}

                                <button type="submit" style={{ padding: '16px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: '15px', cursor: 'pointer', boxShadow: '0 4px 15px rgba(16,185,129,0.3)', transition: '0.2s' }}>
                                    Submit Berkas Timbangan
                                </button>
                            </form>
                        </div>

                        {/* TABEL LOG */}
                        <div style={{ backgroundColor: theme.cardBg, padding: '40px', borderRadius: '28px', border: `1px solid ${theme.border}`, boxShadow: '0 4px 20px rgba(0,0,0,0.01)', overflowX: 'auto' }}>
                            <h3 style={{ color: theme.textMain, marginBottom: '25px', fontSize: '18px', fontWeight: '800' }}>Log Arsip Rekapitulasi Warga</h3>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
                                <thead>
                                    <tr style={{ backgroundColor: theme.tableHeader, borderBottom: `1px solid ${theme.border}`, color: theme.textMain }}>
                                        <th style={{ padding: '18px', borderRadius: '12px 0 0 12px' }}>Tanggal</th>
                                        <th style={{ padding: '18px' }}>Kategori</th>
                                        <th style={{ padding: '18px' }}>Sektor Wilayah</th>
                                        <th style={{ padding: '18px' }}>Berat Bersih</th>
                                        <th style={{ padding: '18px' }}>Nilai Cair</th>
                                        <th style={{ padding: '18px', textAlign: 'center', borderRadius: '0 12px 12px 0' }}>Operasi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {riwayatSetoran.map((item) => (
                                        <tr key={item.id} style={{ borderBottom: `1px solid ${theme.border}`, color: theme.textMain, transition: 'background-color 0.2s' }} onMouseOver={(e)=>e.currentTarget.style.backgroundColor=darkMode ? '#1f2937' : '#f9fafb'} onMouseOut={(e)=>e.currentTarget.style.backgroundColor='transparent'}>
                                            <td style={{ padding: '18px', color: theme.textSub, fontSize: '13px' }}>{item.tanggal}</td>
                                            <td style={{ padding: '18px', fontWeight: '700' }}>{item.jenis}</td>
                                            <td style={{ padding: '18px', fontSize: '13px' }}>
                                                <span style={{ fontWeight: '700', display: 'block' }}>{item.kelurahan} (RT {item.rt}/RW {item.rw})</span>
                                                <span style={{ color: theme.textSub, fontSize: '11px' }}>{item.kecamatan}, {item.kabupaten}</span>
                                            </td>
                                            <td style={{ padding: '18px', fontWeight: '600' }}>{item.berat} Kg</td>
                                            <td style={{ padding: '18px', color: '#10b981', fontWeight: '700' }}>Rp {item.pendapatan.toLocaleString('id-ID')}</td>
                                            <td style={{ padding: '18px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                                <button onClick={() => handleTriggerStruk(item)} style={{ padding: '8px 14px', backgroundColor: darkMode ? '#1e3a8a' : '#e0f2fe', color: '#2563eb', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '12px', fontWeight: '700' }}>🧾 Struk</button>
                                                <button onClick={() => handleEditSetoran(item)} style={{ padding: '8px 14px', backgroundColor: darkMode ? '#78350f' : '#fef3c7', color: '#d97706', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '12px', fontWeight: '700' }}>Ubah</button>
                                                <button onClick={() => handleDeleteSetoran(item.id)} style={{ padding: '8px 14px', backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '12px', fontWeight: '700' }}>Hapus</button>
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
                    <div style={{ backgroundColor: theme.cardBg, padding: '40px', borderRadius: '28px', border: `1px solid ${theme.border}`, boxShadow: '0 4px 20px rgba(0,0,0,0.01)' }}>
                        <form onSubmit={handleSearchMap} style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
                            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Ketik wilayah penelusuran peta..." style={{ flex: 1, padding: '14px', border: `1px solid ${theme.border}`, backgroundColor: theme.inputBg, color: theme.textMain, borderRadius: '12px', outline: 'none', fontSize: '14px' }} />
                            <button type="submit" style={{ padding: '14px 28px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 10px rgba(16,185,129,0.2)' }}>Cari Peta</button>
                        </form>
                        <iframe title="Maps" src={mapUrl} width="100%" height="520px" style={{ border: 0, borderRadius: '20px', boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.05)', filter: darkMode ? 'invert(90%) hue-rotate(180deg)' : 'none' }}></iframe>
                    </div>
                )}

                {/* SCREEN 4: REWARD */}
                {activeMenu === 'reward' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
                        {rewards.map(r => (
                            <div key={r.id} style={{ backgroundColor: theme.cardBg, padding: '40px', borderRadius: '28px', border: `1px solid ${theme.border}`, textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.01)', transition: 'transform 0.2s' }}>
                                <div style={{ background: r.gradasi, width: '80px', height: '80px', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', margin: '0 auto 20px auto', boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}>{r.ikon}</div>
                                <h4 style={{ color: theme.textMain, margin: '0 0 10px 0', fontSize: '16px', fontWeight: '800' }}>{r.nama}</h4>
                                <p style={{ color: '#10b981', fontWeight: '900', fontSize: '22px', margin: '0 0 25px 0' }}>{r.butuhPoin} <span style={{ fontSize: '14px', fontWeight: '600', color: theme.textSub }}>Pts</span></p>
                                <button onClick={() => handleClaimReward(r)} style={{ width: '100%', padding: '14px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 10px rgba(16,185,129,0.2)' }}>Klaim Voucher</button>
                            </div>
                        ))}
                    </div>
                )}

                {/* SCREEN 5: JADWAL */}
                {activeMenu === 'jadwal' && (
                    <div style={{ backgroundColor: theme.cardBg, padding: '40px', borderRadius: '28px', border: `1px solid ${theme.border}`, color: theme.textMain, boxShadow: '0 4px 20px rgba(0,0,0,0.01)' }}>
                        <h3 style={{ marginBottom: '25px', fontSize: '18px', fontWeight: '800' }}>🗓 Kalender Operasional Truk RW</h3>
                        
                        <div style={{ marginBottom: '35px', paddingBottom: '20px', borderBottom: `1px dashed ${theme.border}` }}>
                            <p style={{ color: '#10b981', fontWeight: '800', margin: '0 0 12px 0', fontSize: '14px' }}>Jadwal Tetap Wilayah:</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <p style={{ color: theme.textSub, margin: 0, fontSize: '14px' }}>• **Senin 07.00 WIB:** Sampah Basah Organik Dapur</p>
                                <p style={{ color: theme.textSub, margin: 0, fontSize: '14px' }}>• **Rabu 09.30 WIB:** Klaster Penjemputan Timbangan Depot Pusat</p>
                            </div>
                        </div>

                        <p style={{ color: '#10b981', fontWeight: '800', marginBottom: '15px', fontSize: '14px' }}>Jadwal Armada Tambahan (Input Admin):</p>
                        {jadwalArmada.length === 0 ? (
                            <p style={{ color: theme.textSub, fontStyle: 'italic', fontSize: '13px' }}>Belum ada jadwal operasional tambahan dari administrator.</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {jadwalArmada.map(j => (
                                    <div key={j.id} style={{ padding: '18px 25px', border: `1px solid ${theme.border}`, backgroundColor: darkMode ? '#1f2937' : '#f9fafb', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <span style={{ fontSize: '16px' }}>📅</span> <span style={{ fontSize: '14px', fontWeight: '600' }}>Hari: {j.hari}</span> 
                                        <span style={{ color: theme.border, margin: '0 10px' }}>|</span>
                                        <span style={{ fontSize: '16px' }}>🕒</span> <span style={{ fontSize: '14px', fontWeight: '600' }}>Jam: {j.jam}</span> 
                                        <span style={{ color: theme.border, margin: '0 10px' }}>|</span>
                                        <span style={{ fontSize: '16px' }}>📍</span> <span style={{ fontSize: '14px', fontWeight: '700', color: '#10b981' }}>Lokasi: RW {j.lokasi}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
                
                {/* SCREEN 6: EDUKASI */}
                {activeMenu === 'edukasi' && (
                    <div style={{ backgroundColor: theme.cardBg, padding: '40px', borderRadius: '28px', border: `1px solid ${theme.border}`, color: theme.textMain, boxShadow: '0 4px 20px rgba(0,0,0,0.01)' }}>
                        <h3 style={{ marginBottom: '25px', fontSize: '18px', fontWeight: '800' }}>📘 Katalog Pemilahan Pintar</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
                            <div style={{ padding: '25px', backgroundColor: darkMode ? 'rgba(16,185,129,0.05)' : '#f0fdf4', border: '1px solid #10b981', borderRadius: '20px' }}>
                                <h4 style={{ color: '#059669', margin: '0 0 12px 0', fontWeight: '800' }}>✅ Bernilai Ekonomis</h4>
                                <p style={{ color: theme.textMain, margin: 0, fontSize: '14px', lineHeight: '1.6' }}>Plastik Kemasan PET, Kardus Box Cokelat, Besi Tua, Aluminium Kaleng minuman soda, botol kaca sirup.</p>
                            </div>
                            <div style={{ padding: '25px', backgroundColor: 'rgba(239,68,68,0.05)', border: '1px solid #ef4444', borderRadius: '20px' }}>
                                <h4 style={{ color: '#dc2626', margin: '0 0 12px 0', fontWeight: '800' }}>❌ Residu B3 Ditolak</h4>
                                <p style={{ color: theme.textMain, margin: 0, fontSize: '14px', lineHeight: '1.6' }}>Jarum Suntik Medis, Masker Bekas pakai, Lampu Neon Pijar pecah, wadah Styrofoam kotor bekas makanan.</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* SCREEN 7: COMPLAINT */}
                {activeMenu === 'pengaduan' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'flex-start' }}>
                        <div style={{ backgroundColor: theme.cardBg, padding: '40px', borderRadius: '28px', border: `1px solid ${theme.border}`, boxShadow: '0 4px 20px rgba(0,0,0,0.01)' }}>
                            <h3 style={{ margin: '0 0 25px 0', color: theme.textMain, fontWeight: '800', fontSize: '18px' }}>
                                {isEditingAduan ? '📝 Koreksi Berkas Laporan Sektor' : '📢 Form Hub Laporan Kendala Wilayah'}
                            </h3>
                            <form onSubmit={handleSaveAduan} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                {renderDropdownRegional()}
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', color: theme.textMain, fontSize: '13px' }}>Rincian Kendala Lapangan</label>
                                    <textarea rows="4" value={inputAduanPerihal} onChange={(e) => setInputAduanPerihal(e.target.value)} placeholder="Ceritakan penumpukan limbah liar atau penyumbatan gorong-gorong..." required style={{ width: '100%', padding: '14px', border: `1px solid ${theme.border}`, backgroundColor: theme.inputBg, color: theme.textMain, borderRadius: '12px', resize: 'none', outline: 'none', fontSize: '14px' }}></textarea>
                                </div>
                                <button type="submit" style={{ padding: '16px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: '15px', cursor: 'pointer', boxShadow: '0 4px 15px rgba(16,185,129,0.3)' }}>
                                    {isEditingAduan ? 'Simpan Pembaruan Aduan' : 'Kirim Laporan Resmi'}
                                </button>
                            </form>
                        </div>

                        {/* ARSIP DOKUMEN ADUAN */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <h3 style={{ margin: 0, color: theme.textMain, fontWeight: '800', fontSize: '18px' }}>Arsip Pengaduan Terkirim</h3>
                            {riwayatAduan.map(a => (
                                <div key={a.id} style={{ backgroundColor: theme.cardBg, padding: '25px', borderRadius: '24px', border: `1px solid ${theme.border}`, boxShadow: '0 4px 15px rgba(0,0,0,0.005)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                        <span style={{ fontSize: '11px', color: theme.textSub, fontWeight: '700' }}>DOC-ID #{a.id.toString().slice(-5)}</span>
                                        <span style={{ backgroundColor: darkMode ? '#7c2d12' : '#ffedd5', color: '#c2410c', padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '700' }}>{a.status}</span>
                                    </div>
                                    <div style={{ fontSize: '13px', color: theme.textMain, display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '15px', backgroundColor: theme.tableHeader, padding: '14px', borderRadius: '14px', border: `1px solid ${theme.border}` }}>
                                        <p style={{ margin: 0 }}><b>📍 Sektor:</b> {a.kelurahan} (RT {a.rt} / RW {a.rw})</p>
                                        <p style={{ margin: 0, color: theme.textSub }}><b>🏙️ Kec/Kab:</b> {a.kecamatan}, {a.kabupaten}</p>
                                    </div>
                                    <p style={{ margin: 0, fontSize: '13px', color: theme.textSub, fontStyle: 'italic', lineHeight: '1.5' }}>"{a.perihal}"</p>
                                    <div style={{ display: 'flex', gap: '10px', borderTop: `1px solid ${theme.border}`, paddingTop: '15px', marginTop: '15px' }}>
                                        <button onClick={() => handleEditAduan(a)} style={{ padding: '8px 14px', backgroundColor: darkMode ? '#78350f' : '#fef3c7', color: '#d97706', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>Ubah</button>
                                        <button onClick={() => handleDeleteAduan(a.id)} style={{ padding: '8px 14px', backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>Hapus</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* FOOTER */}
                <footer style={{ marginTop: '80px', borderTop: `1px solid ${theme.border}`, padding: '30px 0', textAlign: 'center', color: '#9ca3af', fontSize: '13px', fontWeight: '500' }}>
                    <p style={{ margin: 0 }}>Proyek Aplikasi UTS Praktikum Sistem Informasi Manajemen Kelurahan</p>
                    <p style={{ margin: '4px 0 0 0', fontWeight: '700', color: '#10b981' }}>Secure Cloud Architecture Connected to Local Node</p>
                </footer>

            </main>

            {/* MODAL STRUK */}
            {showModalStruk && selectedStruk && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15,23,42,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(5px)' }}>
                    <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '28px', width: '390px', fontFamily: "'Courier New', Courier, monospace", color: '#111827', border: '2px dashed #111827', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
                        <div style={{ textAlign: 'center', marginBottom: '20px', borderBottom: '2px dashed #111827', paddingBottom: '15px' }}>
                            <h3 style={{ margin: 0, fontWeight: '900', fontSize: '18px', letterSpacing: '-0.5px' }}>BANK SAMPAH DIGITAL</h3>
                            <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#6b7280' }}>STRUK ID: #STK-{selectedStruk.id.toString().slice(-6)}</p>
                        </div>
                        <div style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '25px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Tanggal:</span> <span style={{ fontWeight: '700' }}>{selectedStruk.tanggal}</span></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Sektor:</span> <span style={{ fontWeight: '700' }}>{selectedStruk.kelurahan}</span></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>RT / RW:</span> <span style={{ fontWeight: '700' }}>RT {selectedStruk.rt} / RW {selectedStruk.rw}</span></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Kategori:</span> <span style={{ fontWeight: '900' }}>{selectedStruk.jenis}</span></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Berat Bersih:</span> <span style={{ fontWeight: '900', color: '#2563eb' }}>{selectedStruk.berat} Kg</span></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px dashed #111827', paddingTop: '12px', fontSize: '16px', fontWeight: '900' }}><span>TOTAL CAIR:</span> <span style={{ color: '#10b981' }}>Rp {selectedStruk.pendapatan.toLocaleString('id-ID')}</span></div>
                        </div>
                        <button onClick={() => setShowModalStruk(false)} style={{ width: '100%', padding: '14px', backgroundColor: '#111827', color: 'white', border: 'none', borderRadius: '12px', fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: '700', cursor: 'pointer' }}>Tutup Nota</button>
                    </div>
                </div>
            )}

        </div>
    );
};

export default UserDashboard;