import React, { useState } from "react";
import { useRef, useEffect } from "react";

export const Carousel: React.FC<{
  children: React.ReactNode[];
  className?: string;
}> = ({ children, className }) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [disabled, setDisabled] = useState(false);
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const [currentSlide, setCurrentSlide] = useState(0);

  const [slide, setSlide] = useState(false);

  const handleLeft = () => {
    setDisabled(true);
    setSlide(true);
    timerRef.current = setTimeout(
      () => setCurrentSlide((prev) => (prev - 1) % children.length),
      1000
    );
    timerRef.current = setTimeout(() => setSlide(false), 1000);
    timerRef.current = setTimeout(() => setDisabled(false), 1000);
  };

  const handleRight = () => {
    setDisabled(true);
    setSlide(true);
    timerRef.current = setTimeout(
      () => setCurrentSlide((prev) => (prev + 1) % children.length),
      1000
    );
    timerRef.current = setTimeout(() => setSlide(false), 1000);
    timerRef.current = setTimeout(() => setDisabled(false), 1000);
  };

  return (
    <div className="flex flex-row items-center justify-center space-x-4">
      <button
        type="button"
        className="text-7xl font-medium text-white focus:outline-none"
        onClick={handleLeft}
        disabled={disabled}
      >
        {"<"}
      </button>
      <div
        className={`${
          className ?? ""
        } transition-all duration-1000 ease-in-out ${
          slide ? "opacity-50" : "opacity-100"
        }`}
      >
        {children[Math.abs(currentSlide)]}
      </div>
      <button
        type="button"
        className="bg-inherit text-7xl font-medium text-white focus:outline-none"
        onClick={handleRight}
        disabled={disabled}
      >
        {">"}
      </button>
    </div>
  );
};

export default Carousel;
