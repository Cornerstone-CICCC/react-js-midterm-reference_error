"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
gsap.registerPlugin(useGSAP);

type Image = {
  id: string;
  url: string;
};

type ItemSlideProps = {
  images: Image[];
  title: string;
  aspectRatio?: "square" | "auto";
  maxHeight?: number;
  breakpoint?: number;
};

export function ProductSlide({
  images,
  title,
  aspectRatio = "square",
  maxHeight = 400,
  breakpoint = 980,
}: ItemSlideProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useGSAP(() => {
    gsap.fromTo(".slide", { opacity: 0, duration: 0.5 }, { duration: 0.5, opacity: 1 });
  }, [currentSlide !== 0]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [breakpoint]);

  if (!images || !images.length) {
    return (
      <div className="relative aspect-square w-full mx-auto overflow-hidden bg-gray-200 sm:rounded-lg flex items-center justify-center">
        <span className="text-gray-400">No image available</span>
      </div>
    );
  }

  const prev = () => {
    if (images.length <= 1) return;
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  };

  const next = () => {
    if (images.length <= 1) return;
    setCurrentSlide((prev) => (prev + 1) % images.length);
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentSlide(index);
  };

  const handleThumbnailKeyDown = (event: React.KeyboardEvent<HTMLDivElement>, index: number) => {
    if (event.key === "Enter" || event.key === " ") {
      handleThumbnailClick(index);
      event.preventDefault();
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="mx-auto w-full">
        <div
          className="relative overflow-hidden sm:rounded-lg bg-gray-100"
          style={{
            width: "100%",
            height: aspectRatio === "square" ? "auto" : `${maxHeight}px`,
            aspectRatio: aspectRatio === "square" ? "1 / 1" : "auto",
            maxHeight: `${maxHeight}px`,
          }}
        >
          <div className="w-full h-full flex items-center justify-center">
            <img
              src={
                images[currentSlide]?.url
                  ? `${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}/${images[currentSlide].url}`
                  : "/assets/images/no-image.png"
              }
              alt={`${title} - view ${images[currentSlide].id}`}
              className="max-w-full max-h-full object-contain slide"
            />
          </div>

          {images.length > 1 && (
            <div className="absolute inset-0 flex justify-between items-center z-20 pointer-events-none">
              <button
                onClick={prev}
                className="w-8 h-8 bg-white bg-opacity-80 rounded-full flex items-center justify-center shadow-md cursor-pointer transition-all hover:bg-white hover:opacity-100 opacity-80 pointer-events-auto mx-2"
                aria-label="Previous image"
              >
                <FaChevronLeft size={16} />
              </button>
              <button
                onClick={next}
                className="w-8 h-8 bg-white bg-opacity-80 rounded-full flex items-center justify-center shadow-md cursor-pointer transition-all hover:bg-white hover:opacity-100 opacity-80 pointer-events-auto mx-2"
                aria-label="Next image"
              >
                <FaChevronRight size={16} />
              </button>
            </div>
          )}

          {images.length > 1 && (
            <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded z-20">
              {currentSlide + 1} / {images.length}
            </div>
          )}
        </div>
      </div>

      {images.length > 1 && (
        <div className={`w-full ${isMobile ? "max-w-full" : "max-w-lg"} mx-auto`}>
          <div className="flex flex-nowrap gap-2 overflow-x-auto overflow-y-hidden scroll-smooth">
            {images.map((image, index) => (
              <div
                key={image.id}
                className={`w-16 h-16 flex-shrink-0 overflow-hidden rounded cursor-pointer border-2 ${
                  index === currentSlide
                    ? "border-orange-500"
                    : "border-transparent hover:border-gray-300"
                }`}
                onClick={() => handleThumbnailClick(index)}
                onKeyDown={(e) => handleThumbnailKeyDown(e, index)}
                aria-label={`View image ${index + 1}`}
                aria-pressed={index === currentSlide}
              >
                <div className="w-full h-full bg-gray-100">
                  <img
                    src={image.url}
                    alt={`${title} - thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
