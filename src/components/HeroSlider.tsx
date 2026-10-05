import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cmsImg, usePublishedCmsImages } from "@/lib/cms";

const HERO_FALLBACKS = [
  { key: "home.hero_collage.1", src: "/Home/1. nusa dua beach.jpg",  alt: "Acala Bar & Bistro dining atmosphere" },
  { key: "home.hero_collage.2", src: "/Home/2. Hero-2.jpg",          alt: "Acala Nusa Dua dining area" },
  { key: "home.hero_collage.3", src: "/Home/3. nusa lembogan.jpg",   alt: "Acala Nusa Lembongan tropical dining room" },
  { key: "home.hero_collage.4", src: "/Home/4. hero-4.jpg",          alt: "Acala Nusa Lembongan pizza and seafood table" },
];

export default function HeroSlider({ cmsImages }: { cmsImages?: string[] }) {
  const { images } = usePublishedCmsImages();
  
  const heroImages = cmsImages && cmsImages.length > 0
    ? cmsImages.map((src, i) => ({ src, alt: `Hero slider image ${i + 1}` }))
    : HERO_FALLBACKS.map((f) => cmsImg(images, f.key, f.src, f.alt));

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % heroImages.length);
    }, 5200);

    return () => clearInterval(timer);
  }, [heroImages.length]);

  const showPreviousSlide = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  const showNextSlide = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % heroImages.length);
  };

  const showSlide = (index: number) => {
    setDirection(index >= currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      <AnimatePresence initial={false}>
        <motion.div
          key={currentIndex}
          initial={{ x: direction > 0 ? "100%" : "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: direction > 0 ? "-100%" : "100%" }}
          transition={{ duration: 1.15, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <Image
            src={heroImages[currentIndex].src}
            alt={heroImages[currentIndex].alt}
            fill
            className="object-cover"
            preload={currentIndex === 0}
            sizes="100vw"
          />
        </motion.div>
      </AnimatePresence>
      <div className="absolute inset-0 gradient-hero z-10" />
      <div className="absolute inset-0 z-10" style={{ background: "rgba(0,0,0,0.46)" }} />

      <button
        type="button"
        onClick={showPreviousSlide}
        className="absolute left-4 sm:left-6 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/30 text-white backdrop-blur-md transition hover:bg-white/20"
        aria-label="Previous hero image"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <button
        type="button"
        onClick={showNextSlide}
        className="absolute right-4 sm:right-6 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/30 text-white backdrop-blur-md transition hover:bg-white/20"
        aria-label="Next hero image"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="absolute bottom-6 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2">
        {heroImages.map((image, index) => (
          <button
            key={image.src}
            type="button"
            onClick={() => showSlide(index)}
            className="h-2.5 rounded-full transition-all"
            style={{
              width: currentIndex === index ? 28 : 10,
              background: currentIndex === index ? "#fff" : "rgba(255,255,255,0.45)",
            }}
            aria-label={`Show hero image ${index + 1}`}
            aria-current={currentIndex === index ? "true" : undefined}
          />
        ))}
      </div>
    </div>
  );
}
