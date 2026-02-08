"use client";
import React, { useState, useEffect } from 'react';

const daftarAset = [
  { nama: "Kantor Bupati", lat: -2.5781, lng: 121.1641 },
  { nama: "Kantor DPRD", lat: -2.5850, lng: 121.1700 },
  { nama: "Rumah Jabatan Bupati", lat: -2.5900, lng: 121.1800 },
  { nama: "Rujab Wakil Bupati", lat: -2.5950, lng: 121.1900 },
  { nama: "Rujab Sekda", lat: -2.6000, lng: 121.2000 },
  { nama: "Rujab Ketua DPRD", lat: -2.6050, lng: 121.2100 },
  { nama: "Kediaman", lat: -2.6100, lng: 121.2200 },
  { nama: "Mako Praja Satpol PP Lutim", lat: -2.5848, lng: 121.1708 },
];

export default function PenjagaanApp() {
  const [selectedAset, setSelectedAset] = useState(daftarAset[0]);
  const [namaPetugas, setNamaPetugas] = useState("");
  const [namaDanru, setNamaDanru] = useState("");
  const [regu, setRegu] = useState("Regu I");
  const [currentTime, setCurrentTime] = useState("");
  const [distance, setDistance] = useState<number>(0); 
  const [photo, setPhoto] = useState<string | null>(null);

  const calculateHaversine = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return Math.round(R * c);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('id-ID'));
    }, 1000);

    let watchId: number;
    if ("geolocation" in navigator) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const d = calculateHaversine(
            position.coords.latitude, 
            position.coords.longitude, 
            selectedAset.lat, 
            selectedAset.lng
          );
          setDistance(d);
        },
        (err) => console.error(err),
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    }

    return () => {
      clearInterval(timer);
      if(watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [selectedAset]);

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto', fontFamily: 'sans-serif', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <h2 style={{ textAlign: 'center', color: '#1e3a8a' }}>PENJAGAAN SATPOL PP</h2>
      <p style={{ textAlign: 'center', fontWeight: 'bold' }}>🕒 {currentTime} WITA</p>
      
      <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '15px', marginBottom: '20px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
        <input type="text" placeholder="Nama Petugas" value={namaPetugas} onChange={(e) => setNamaPetugas(e.target.value)} style={{ width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
        <input type="text" placeholder="Nama Danru" value={namaDanru} onChange={(e) => setNamaDanru(e.target.value)} style={{ width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
        <select value={regu} onChange={(e) => setRegu(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', backgroundColor: 'white' }}>
          <option value="Regu I">Regu I</option><option value="Regu II">Regu II</option><option value="Regu III">Regu III</option><option value="Regu IV">Regu IV</option>
        </select>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', fontWeight: 'bold' }}>Pilih Aset Jaga:</label>
        <select 
          onChange={(e) => {
            const aset = daftarAset.find(a => a.nama === e.target.value);
            if(aset) setSelectedAset(aset);
          }} 
          style={{ width: '100%', padding: '15px', borderRadius: '10px', fontSize: '16px', border: '2px solid #1e3a8a', backgroundColor: 'white' }}
        >
          {daftarAset.map((aset) => (
            <option key={aset.nama} value={aset.nama}>{aset.nama}</option>
          ))}
        </select>
      </div>

      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '20px', textAlign: 'center', marginBottom: '20px' }}>
        <p style={{ color: '#666', margin: 0 }}>Jarak ke {selectedAset.nama}:</p>
        <h1 style={{ color: distance < 100 ? '#16a34a' : '#dc2626', fontSize: '35px' }}>{distance} m</h1>
      </div>

      <label style={{ width: '100%', display: 'block', padding: '18px', textAlign: 'center', backgroundColor: '#059669', color: 'white', borderRadius: '15px', cursor: 'pointer', marginBottom: '15px', fontWeight: 'bold' }}>
        📷 AMBIL FOTO LOKASI
        <input type="file" accept="image/*" capture="environment" onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setPhoto(reader.result as string);
            reader.readAsDataURL(file);
          }
        }} style={{ display: 'none' }} />
      </label>

      {photo && <img src={photo} alt="Preview" style={{ width: '100%', borderRadius: '15px', marginBottom: '10px', border: '2px solid white' }} />}

      <button 
        onClick={() => alert(`TERKIRIM!\nPetugas: ${namaPetugas}\nDanru: ${namaDanru}\nRegu: ${regu}\nLokasi: ${selectedAset.nama}`)}
        style={{ width: '100%', padding: '20px', backgroundColor: '#1e3a8a', color: 'white', border: 'none', borderRadius: '15px', fontWeight: 'bold', fontSize: '18px' }}
      >
        🚀 KIRIM LAPORAN
      </button>
    </div>
  );
}