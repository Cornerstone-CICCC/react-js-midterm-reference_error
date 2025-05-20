"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const mobileImages = [
  "/assets/images/banner/main-mobile-1.png",
  "/assets/images/banner/main-mobile-2.png",
];
const tabletImages = [
  "/assets/images/banner/main-tablet-1.png",
  "/assets/images/banner/main-tablet-2.png",
];
const desktopImages = [
  "/assets/images/banner/main-desktop-1.png",
  "/assets/images/banner/main-desktop-2.png",
];

type ScreenType = "mobile" | "tablet" | "desktop";

export function Banner() {
  const [screenType, setScreenType] = useState<ScreenType>("desktop");
  const [images, setImages] = useState<string[]>(desktopImages); // 初期値をデスクトップに設定
  const [currentSlide, setCurrentSlide] = useState<number>(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // ローディング状態を追加
  const slideContainerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const updateScreenType = useCallback(() => {
    const width = window.innerWidth;
    if (width < 640) {
      setScreenType("mobile");
      setImages(mobileImages);
      setCurrentSlide((prev) => (prev > mobileImages.length ? 1 : prev));
    } else if (width < 960) {
      setScreenType("tablet");
      setImages(tabletImages);
      setCurrentSlide((prev) => (prev > tabletImages.length ? 1 : prev));
    } else {
      setScreenType("desktop");
      setImages(desktopImages);
      setCurrentSlide((prev) => (prev > desktopImages.length ? 1 : prev));
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      updateScreenType();
      setIsLoading(false);
      window.addEventListener("resize", updateScreenType);
      return () => window.removeEventListener("resize", updateScreenType);
    }
  }, [updateScreenType]);

  const next = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => prev + 1);
  }, [isTransitioning]);

  const prev = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => prev - 1);
  }, [isTransitioning]);

  const resetTimer = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      next();
    }, 8000);
  }, [next]);

  useEffect(() => {
    if (!isLoading) {
      resetTimer();
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [resetTimer, isLoading]);

  const handleNext = () => {
    next();
    resetTimer();
  };

  const handlePrev = () => {
    prev();
    resetTimer();
  };

  useEffect(() => {
    if (!isTransitioning) return;

    const container = slideContainerRef.current;
    if (!container) return;

    const handleTransitionEnd = () => {
      setIsTransitioning(false);

      if (currentSlide >= images.length + 1) {
        container.style.transition = "none";
        setCurrentSlide(1);
        container.style.transform = "translateX(-100%)";

        setTimeout(() => {
          container.style.transition = "transform 700ms ease-in-out";
        }, 10);
      } else if (currentSlide <= 0) {
        container.style.transition = "none";
        setCurrentSlide(images.length);
        container.style.transform = `translateX(-${images.length * 100}%)`;

        setTimeout(() => {
          container.style.transition = "transform 700ms ease-in-out";
        }, 10);
      }
    };

    container.addEventListener("transitionend", handleTransitionEnd);
    return () => container.removeEventListener("transitionend", handleTransitionEnd);
  }, [currentSlide, isTransitioning, images.length]);

  useEffect(() => {
    const container = slideContainerRef.current;
    if (container) {
      container.style.transform = `translateX(-${currentSlide * 100}%)`;
    }
  }, [currentSlide]);

  const renderSlides = () => {
    const extendedSlides = [
      { src: images[images.length - 1], id: `clone-last-${images.length - 1}` },
      ...images.map((src, idx) => ({ src, id: `original-${idx}` })),
      { src: images[0], id: "clone-first-0" },
    ];

    return (
      <div
        className="flex transition-transform duration-700 ease-in-out w-full h-full absolute top-0 left-0"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        ref={slideContainerRef}
      >
        {extendedSlides.map((slide, i) => (
          <div key={slide.id} className="w-full flex-shrink-0 relative">
            <Image
              src={slide.src}
              alt={`Slide ${i + 1}`}
              fill
              className="object-cover"
              priority={i === 1}
              onLoad={i === 1 ? () => setIsLoading(false) : undefined}
            />
          </div>
        ))}
      </div>
    );
  };

  const aspectRatio =
    screenType === "mobile" ? "56.25%" : screenType === "tablet" ? "28.125%" : "25%";

  if (isLoading) {
    return (
      <section className="w-full relative overflow-hidden">
        <div
          className="relative w-full animate-pulse bg-gray-200"
          style={{ paddingTop: aspectRatio }}
        />
      </section>
    );
  }

  return (
    <section className="w-full relative overflow-hidden">
      <div className="relative w-full" style={{ paddingTop: aspectRatio }}>
        {renderSlides()}
      </div>

      {/* ナビゲーション */}
      <div className="absolute inset-0 flex justify-between items-center max-w-7xl mx-auto px-6 sm:px-4 z-10 pointer-events-none">
        <button
          onClick={handlePrev}
          className="flex items-center justify-center w-10 h-10 text-gray-800 rounded-full pointer-events-auto cursor-pointer"
          aria-label="Previous slide"
        >
          <FaChevronLeft size={12} />
        </button>
        <button
          onClick={handleNext}
          className="flex items-center justify-center w-10 h-10 text-gray-800 rounded-full pointer-events-auto cursor-pointer"
          aria-label="Next slide"
        >
          <FaChevronRight size={12} />
        </button>
      </div>
    </section>
  );
}
