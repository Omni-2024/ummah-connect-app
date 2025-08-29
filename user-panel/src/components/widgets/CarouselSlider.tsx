import { useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

import { cn } from "@/lib/className";

interface Slide {
  id: number;
  image: string;
  text?: React.ReactNode;
}

interface Props {
  slides: Slide[];
}

const CarouselSlider = ({ slides }: Props) => {
  const [currentItemIndex, setCurrentItemIndex] = useState(0);

  return (
    <div className="relative overflow-hidden rounded-xl">
      <Carousel
        autoPlay
        swipeable
        infiniteLoop
        emulateTouch
        showArrows={false}
        showStatus={false}
        showThumbs={false}
        className="size-full"
        dynamicHeight={false}
        showIndicators={false}
        onChange={(index) => setCurrentItemIndex(index)}
      >
        {slides?.map(({ id, image, text }) => (
          <div key={id} className="relative size-full">
            <img src={image} className="h-[calc(90vh-3rem)] object-cover" />

            <div className="absolute inset-0 top-1/2 flex flex-col items-start justify-end bg-gradient-to-b from-transparent to-black/80 px-6 py-14">
              {text}
            </div>
          </div>
        ))}
      </Carousel>

      <div className="absolute bottom-5 left-7 z-50 flex items-center gap-2">
        {slides?.map(({ id }, index) => (
          <div
            key={id}
            className={cn("size-1.5 rounded-full bg-white/50", {
              "bg-white": currentItemIndex === index,
            })}
          />
        ))}
      </div>
    </div>
  );
};

export default CarouselSlider;
