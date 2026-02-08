"use client";
import React, { useState, useEffect } from "react";

export default function PenjagaanApp() {
  const [nama, setNama] = useState("");
  const [danru, setDanru] = useState("");
  const [waktu, setWaktu] = useState("");

  useEffect(() => {
    setWaktu(new Date().toLocaleString("id-ID") + " WITA");
  }, []);

  const kirimLaporan = async () => {
    try {
      await fetch("https://script.google.com/macros/s/AKfycbz4GnFEIhcmGEo5PYqZx6BQ0HRhUD6JWV0NwVlz8hNVg3Zmd9H_CRBnAK5gI135H4jJ/exec", {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify({ nama, danru })
      });
      alert("✅ TERKIRIM!");
    } catch (e) {
      alert("❌ GAGAL");
    }
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>PENJAGAAN SATPOL PP</h2>
      <p>{waktu}</p>
      <input placeholder="Nama" value={nama} onChange={(e) => setNama(e.target.value)} style={{ display: "block", width: "100%", marginBottom: "10px", padding: "10px" }} />
      <input placeholder="Danru" value={danru} onChange={(e) => setDanru(e.target.value)} style={{ display: "block", width: "100%", marginBottom: "15px", padding: "10px" }} />
      <button onClick={kirimLaporan} style={{ width: "100%", padding: "15px", background: "blue", color: "white", fontWeight: "bold" }}>🚀 KIRIM</button>
    </div>
  );
}