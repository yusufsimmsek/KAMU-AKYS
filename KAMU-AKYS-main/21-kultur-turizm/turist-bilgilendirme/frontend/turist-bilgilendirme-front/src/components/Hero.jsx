import React from 'react';

const Hero = () => {
  return (
    <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Arka plan videosu */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        src="/videos/hero-bg.mp4"
        autoPlay
        muted
        loop
        playsInline
      />

      {/* Karanlık katman */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/50 z-10"></div>

      {/* Metin içeriği */}
      <div className="relative z-20 text-center text-white px-6">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg">
          <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">Türkiye'yi</span> Keşfetmeye Hazır Mısın?
        </h1>
        <p className="text-lg md:text-2xl mb-8 drop-shadow">
          Türkiye'nin eşsiz tarihini ve doğasını şimdi keşfet.
        </p>
        <a
          href="#explore"
          className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl shadow-lg transition duration-300"
        >
          Hemen Başla
        </a>
      </div>
    </section>
  );
};

export default Hero; 