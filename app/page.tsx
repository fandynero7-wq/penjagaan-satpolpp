"use client";
import React, { useState, useEffect } from 'react';

export default function PenjagaanApp() {
  const [nama, setNama] = useState('');
  const [danru, setDanru] = useState('');
  const [lokasi, setLokasi] = useState('');
  const [waktu, setWaktu] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setWaktu(new Date().toLocaleString('id-ID', { 
        timeZone: 'Asia/Makassar',
        day: 'numeric', 
        month: 'numeric', 
        year: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      }) + ' WITA');
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
    if (!nama || !lokasi) {
      alert("⚠️ Nama dan Lokasi wajib diisi!");
      return;
    }
    try {
      await fetch(url, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify({ nama, danru, lokasi, foto: photo })
      });
      alert("✅ LAPORAN BERHASIL TERKIRIM!");
    } catch (e) {
      alert("❌ GAGAL MENGIRIM");
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '450px', margin: 'auto', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
      <div style={{ backgroundColor: '#1e3a8a', color: 'white', padding: '20px', borderRadius: '15px', textAlign: 'center', marginBottom: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <h2 style={{ margin: 0, fontSize: '20px' }}>PENJAGAAN SATPOL PP</h2>
        <p style={{ margin: '10px 0 0 0', fontSize: '14px', opacity: 0.9 }}>{waktu}</p>
      </div>

      <div style={{ background: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '5px' }}>NAMA PETUGAS</label>
          <input placeholder="Ketik nama lengkap..." value={nama} onChange={(e) => setNama(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }} />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '5px' }}>NAMA DANRU</label>
          <input placeholder="Ketik nama Danru..." value={danru} onChange={(e) => setDanru(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }} />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '5px' }}>LOKASI JAGA</label>
          <input placeholder="Contoh: Kantor Gubernur / Pos A" value={lokasi} onChange={(e) => setLokasi(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }} />
        </div>
        
        <label style={{ display: 'block', backgroundColor: '#10b981', color: 'white', padding: '15px', textAlign: 'center', borderRadius: '10px', cursor: 'pointer', marginBottom: '15px', fontWeight: 'bold' }}>
          📸 AMBIL FOTO
          <input type="file" accept="image/*" capture="environment" onChange={handleCapture} style={{ display: 'none' }} />
        </label>

        {photo && <img src={photo} alt="Preview" style={{ width: '100%', borderRadius: '10px', marginBottom: '15px' }} />}

        <button onClick={kirimLaporan} style={{ width: '100%', padding: '16px', background: '#1e3a8a', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>
          🚀 KIRIM LAPORAN
        </button>
      </div>
    </div>
  );
}