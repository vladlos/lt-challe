import React, { ReactElement, useEffect } from "react";

type CarouselProps = {
  items: ReactElement[];
  loadMore?: () => void;
  id: string;
};

const Carousel: React.FC<CarouselProps> = ({ items, loadMore, id }) => {
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

    let sentinel = document.querySelector("#" + id);
    if (sentinel) {
      observer.observe(sentinel);
    }

    return () => {
      if (sentinel) {
        observer.unobserve(sentinel);
      }
    };
  }, []);
  //[mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]
  return (
    <div className="w-full inline-flex flex-nowrap overflow-scroll">
      <ul className="flex items-center justify-center gap-6">
        {items.map((item, key) => (
          <li key={key}>{item}</li>
        ))}
        <li key={id} id={id} className="h-10"></li>
      </ul>
    </div>
  );
};

export default Carousel;
