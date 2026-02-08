"use client";
import React, { useState, useEffect } from 'react';

// Fungsi hitung jarak meter
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3; 
  const φ1 = lat1 * Math.PI/180;
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2-lat1) * Math.PI/180;
  const Δλ = (lon2-lon1) * Math.PI/180;
  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; 
}

export default function PenjagaanApp() {
  const [nama, setNama] = useState('');
  const [regu, setRegu] = useState('');
  const [danru, setDanru] = useState('');
  const [lokasi, setLokasi] = useState('');
  const [waktu, setWaktu] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [userCoords, setUserCoords] = useState<{lat: number, lng: number} | null>(null);
  const [jarak, setJarak] = useState<number | null>(null);

  const daftarAset = [
    { name: "--- Pilih Lokasi ---", lat: 0, lng: 0 },
    { name: "Kantor Bupati", lat: -2.6074, lng: 121.1332 },
    { name: "Kantor DPRD", lat: -2.6080, lng: 121.1340 },
    { name: "Rujab Bupati", lat: -2.6100, lng: 121.1350 },
    { name: "Rujab Wakil Bupati", lat: -2.6110, lng: 121.1360 },
    { name: "Rujab Ketua DPRD", lat: -2.6120, lng: 121.1370 },
    { name: "Mako Satpol PP Luwu Timur", lat: -2.6050, lng: 121.1300 },
    { name: "BBG Bundaran Batara Guru", lat: -2.5796, lng: 121.1365 },
    { name: "Rujab Sekda", lat: -2.6130, lng: 121.1380 },
    { name: "Kediaman Bupati", lat: -2.6133788, lng: 121.1067481 }
  ];

  const daftarRegu = ["--- Pilih Regu ---", "Regu 1", "Regu 2", "Regu 3", "Regu 4"];

  useEffect(() => {
    const timer = setInterval(() => {
      setWaktu(new Date().toLocaleString('id-ID', { timeZone: 'Asia/Makassar' }) + ' WITA');
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.error(err),
        { enableHighAccuracy: true }
      );
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (lokasi && userCoords) {
      const target = daftarAset.find(a => a.name === lokasi);
      if (target && target.lat !== 0) {
        const d = getDistance(userCoords.lat, userCoords.lng, target.lat, target.lng);
        setJarak(Math.round(d));
      }
    }
  }, [lokasi, userCoords]);

  const handleCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (jarak !== null && jarak > 500) {
      alert(`❌ JARAK TERLALU JAUH! Jarak Anda ${jarak}m. Maksimal 500m.`);
      return;
    }
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => { if (typeof reader.result === 'string') setPhoto(reader.result); };
      reader.readAsDataURL(file);
    }
  };

  const kirimLaporan = async () => {
    if (!nama || !regu || !lokasi || !photo) {
      alert("⚠️ Mohon lengkapi semua data dan foto!");
      return;
    }
    const url = "https://script.google.com/macros/s/AKfycby7rlnUH8vBabUt1_P6plh0M7fA34uzLGCgR53OEPLjFANugRDBtTsMHsTftNXGOWhX/exec";
    try {
      await fetch(url, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify({ nama, regu, danru, lokasi, foto: photo, jarak: `${jarak}m` })
      });
      alert("✅ LAPORAN BERHASIL TERKIRIM!");
      setPhoto(null);
    } catch (e) {
      alert("❌ GAGAL MENGIRIM");
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '450px', margin: 'auto', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
      <div style={{ backgroundColor: '#1e3a8a', color: 'white', padding: '15px', borderRadius: '15px', textAlign: 'center', marginBottom: '15px' }}>
        <h2 style={{ margin: 0, fontSize: '18px' }}>PENJAGAAN SATPOL PP LUTIM</h2>
        <p style={{ fontSize: '12px', marginTop: '5px' }}>{waktu}</p>
        {jarak !== null && lokasi !== "--- Pilih Lokasi ---" && (
          <div style={{ marginTop: '10px', padding: '8px', borderRadius: '8px', fontSize: '13px', backgroundColor: jarak <= 500 ? '#10b981' : '#ef4444' }}>
            📍 Jarak: {jarak} meter {jarak <= 500 ? '(Aman)' : '(Terlalu Jauh)'}
          </div>
        )}
      </div>

      <div style={{ background: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
        <input placeholder="Nama Petugas" value={nama} onChange={(e) => setNama(e.target.value)} style={{ width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '8px', border: '1px solid #ddd' }} />
        <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
          <select value={regu} onChange={(e) => setRegu(e.target.value)} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}>
            {daftarRegu.map((r, i) => <option key={i} value={r}>{r}</option>)}
          </select>
          <input placeholder="Danru" value={danru} onChange={(e) => setDanru(e.target.value)} style={{ flex: 2, padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }} />
        </div>
        <select value={lokasi} onChange={(e) => setLokasi(e.target.value)} style={{ width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '8px', border: '1px solid #ddd' }}>
          {daftarAset.map((item, i) => <option key={i} value={item.name}>{item.name}</option>)}
        </select>
        <label style={{ display: 'block', backgroundColor: (jarak !== null && jarak <= 500) ? '#10b981' : '#94a3b8', color: 'white', padding: '15px', textAlign: 'center', borderRadius: '10px', cursor: 'pointer', marginBottom: '15px', fontWeight: 'bold' }}>
          📸 AMBIL FOTO
          <input type="file" accept="image/*" capture="environment" onChange={handleCapture} style={{ display: 'none' }} disabled={jarak === null || jarak > 500} />
        </label>
        {photo && <img src={photo} alt="Preview" style={{ width: '100%', borderRadius: '10px', marginBottom: '15px' }} />}
        <button onClick={kirimLaporan} disabled={!photo} style={{ width: '100%', padding: '16px', background: photo ? '#1e3a8a' : '#cbd5e1', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold' }}>
          🚀 KIRIM LAPORAN
        </button>
      </div>
    </div>
  );
}