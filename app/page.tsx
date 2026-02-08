"use client";
import React, { useState, useEffect } from 'react';

export default function PenjagaanApp() {
  const [nama, setNama] = useState('');
  const [danru, setDanru] = useState('');
  const [waktu, setWaktu] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setWaktu(new Date().toLocaleString('id-ID') + ' WITA');
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setPhoto(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const kirimLaporan = async () => {
    const url = "https://script.google.com/macros/s/AKfycby7rlnUH8vBabUt1_P6plh0M7fA34uzLGCgR53OEPLjFANugRDBtTsMHsTftNXGOWhX/exec";
    try {
      await fetch(url, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify({ nama, danru, foto: photo })
      });
      alert("✅ LAPORAN & FOTO TERKIRIM!");
    } catch (e) {
      alert("❌ GAGAL MENGIRIM");
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '400px', margin: 'auto' }}>
      <h2 style={{ textAlign: 'center' }}>PENJAGAAN SATPOL PP</h2>
      <p style={{ textAlign: 'center' }}>{waktu}</p>
      <div style={{ background: 'white', padding: '15px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
        <input placeholder="Nama Petugas" value={nama} onChange={(e) => setNama(e.target.value)} style={{ width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
        <input placeholder="Nama Danru" value={danru} onChange={(e) => setDanru(e.target.value)} style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '5px', border: '1px solid #ccc' }} />
        
        <label style={{ display: 'block', backgroundColor: '#10b981', color: 'white', padding: '12px', textAlign: 'center', borderRadius: '8px', cursor: 'pointer', marginBottom: '10px', fontWeight: 'bold' }}>
          📸 AMBIL FOTO
          <input type="file" accept="image/*" capture="environment" onChange={handleCapture} style={{ display: 'none' }} />
        </label>

        {photo && <img src={photo} alt="Preview" style={{ width: '100%', borderRadius: '8px', marginBottom: '15px' }} />}

        <button onClick={kirimLaporan} style={{ width: '100%', padding: '15px', background: '#1e3a8a', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
          🚀 KIRIM LAPORAN
        </button>
      </div>
    </div>
  );
}