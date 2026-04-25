import React from 'react';
import Image from 'next/image';

const logos = [
  { name: 'Harvard', src: './carousel/Harvard.png' },
  { name: 'MIT', src: './carousel/MIT.png' },
  { name: 'Imperial', src: './carousel/Imperial.png' },
  { name: 'NTU', src: './carousel/NTU.png' },
  { name: 'Caltech', src: './carousel/Caltech.png' },
  { name: 'Stanford', src: './carousel/Stanford.png' },
  { name: 'Oxford', src: './carousel/Oxford.png' },
  { name: 'Cornell', src: './carousel/Cornell.png' },
  { name: 'UCL', src: './carousel/UCL.png' },
  { name: 'Cambridge', src: './carousel/Cambridge.png' },
  { name: 'NUS', src: './carousel/NUS.png' },
  { name: 'Meta', src: "./carousel/Meta.png"},
];

const Carousel = () => {
  // We double the array to ensure there's no "gap" during the loop
  const duplicatedLogos = [...logos, ...logos, ...logos];

  return (
    <div className='!m-2 md:!ml-50 md:!mr-50 !mt-20'>
    <div className='text-center !font-bold'> 
      <p className="!text-lg md:!text-3xl !leading-relaxed !tracking-tighter !text-muted-foreground">
              In collaboration with researchers from..
            </p></div>
      <div className="relative w-full overflow-hidden bg-transparent py-10 group !mt-5">
      {/* Gradient Overlays for a faded edge effect (optional, like Figma) */}
      {/* <div className="absolute inset-y-0 left-0 z-10 w-20 bg-linear-to-r from-white to-transparent"></div>
      <div className="absolute inset-y-0 right-0 z-10 w-20 bg-linear-to-l from-white to-transparent"></div> */}

      <div className="flex w-max items-center animate-scroll hover:[animation-play-state:paused]">
        {duplicatedLogos.map((logo, index) => (
          <div
            key={index}
            className=" flex w-40 items-center justify-center transition-all duration-300 hover:grayscale-0 cursor-pointer"
          >
            <img
              src={logo.src}
              alt={logo.name}
              className="h-20 w-auto object-contain m-2"
            />
          </div>
        ))}
      </div>

    </div>
    </div>
    
  );
};

export default Carousel;