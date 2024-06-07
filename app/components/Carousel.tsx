import React, { ReactElement, useEffect } from "react";
import { format } from "date-fns";
import { Data, DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Lottie } from "@prisma/client";
import Card from "./Card";

type CarouselProps = {
  items: ReactElement[];
  loadMore?: () => void;
};

const Carousel: React.FC<CarouselProps> = ({ items, loadMore }) => {
  useEffect(() => {
    let observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore && loadMore();
          console.log("LOAD MORE");
        }
      },
      { threshold: 1.0 }
    );

    let sentinel = document.querySelector("#sentinel");
    if (sentinel) {
      observer.observe(sentinel);
    }

    return () => {
      if (sentinel) {
        observer.unobserve(sentinel);
      }
    };
  }, []);

  return (
    <div className="w-full inline-flex flex-nowrap overflow-scroll [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
      <ul className="flex items-center justify-center gap-6">
        {items.map((item, key) => (
          <li key={key}>{item}</li>
        ))}
        <li key="sentinel" id="sentinel" className="h-10"></li>
      </ul>
    </div>
  );
};

export default Carousel;
