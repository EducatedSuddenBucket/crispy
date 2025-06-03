import React, { useEffect, useState } from "react";

const ScanningIndicator = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const totalDots = 3;

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % totalDots);
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dots-container flex justify-center gap-4 mb-6">
      {[...Array(totalDots)].map((_, index) => (
        <span key={index} className={`minecraft-char ${index === activeIndex ? "active" : ""}`}>
          {index === activeIndex ? "O" : "o"}
        </span>
      ))}
    </div>
  );
};

export default ScanningIndicator;