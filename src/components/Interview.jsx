// "use client";
// import React, { useState, useEffect } from "react";

// /* eslint-disable @next/next/no-img-element */
// const Interview = () => {
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const [isHovered, setIsHovered] = useState(false);
//   const [isPaused, setIsPaused] = useState(false);

//   // Replace these with your actual interview data
//   const interviews = [
//     {
//       image: "./hero.png",
//       title: "Tech Innovation Summit 2024",
//       description:
//         "Discussing the future of AI and machine learning with industry leaders at the annual summit.",
//       link: "https://google.com",
//       date: "January 2024",
//     },
//     {
//       image: "/path/to/interview2.jpg",
//       title: "Developer Conference Panel",
//       description:
//         "Sharing insights on modern web development practices and emerging frameworks.",
//       link: "https://example.com/interview2",
//       date: "February 2024",
//     },
//     {
//       image: "/path/to/interview3.jpg",
//       title: "Startup Ecosystem Discussion",
//       description:
//         "Exploring entrepreneurship challenges and opportunities in Southeast Asia.",
//       link: "https://example.com/interview3",
//       date: "March 2024",
//     },
//     {
//       image: "/path/to/interview4.jpg",
//       title: "Design Thinking Workshop",
//       description:
//         "Leading a hands-on session about user-centered design methodologies.",
//       link: "https://example.com/interview4",
//       date: "April 2024",
//     },
//   ];

//   // Auto-advance carousel
//   useEffect(() => {
//     if (!isPaused && !isHovered) {
//       const interval = setInterval(() => {
//         setCurrentSlide((prev) => (prev + 1) % interviews.length);
//       }, 5000);
//       return () => clearInterval(interval);
//     }
//   }, [isPaused, isHovered, interviews.length]);

//   const handleDotClick = (index) => {
//     setCurrentSlide(index);
//     setIsPaused(true);
//     setTimeout(() => setIsPaused(false), 10000); // Resume after 10s
//   };

//   return (
//     <section className="py-20 px-6 overflow-hidden">
//       <div className="max-w-6xl mx-auto">
//         {/* Section Header */}
//         <div className="mb-16 text-center">
//           <h2 className="!text-5xl md:text-6xl !font-bold text-transparent bg-clip-text  mb-4">
//             Recent Interviews
//           </h2>
//           <p className="text-lg max-w-2xl mx-auto">
//             Sharing knowledge and experiences across various platforms and
//             events
//           </p>
//         </div>

//         {/* Carousel Container */}
//         <div className="!w-full !h-full !px-4 md:!px-0">
//           <div className="flex justify-center items-center">
//             <div
//               className="relative flex aspect-video !w-full !max-w-5xl rounded-2xl overflow-hidden shadow-2xl !md:ml-0 !md:mr-0"
//               onMouseEnter={() => setIsHovered(true)}
//               onMouseLeave={() => setIsHovered(false)}
//             >
//               {/* Slides */}
//               {interviews.map((interview, index) => (
//                 <div
//                   key={index}
//                   className={`absolute flex inset-0 transition-all duration-700 ease-in-out ${
//                     index === currentSlide
//                       ? "opacity-100 scale-100"
//                       : "opacity-0 scale-95 pointer-events-none"
//                   }`}
//                 >
//                   {/* Background Image */}
//                   <div className="absolute inset-0">
//                     <img
//                       src={interview.image}
//                       alt={interview.title}
//                       className={`h-full w-full object-cover transition-all duration-500 ${
//                         isHovered && index === currentSlide
//                           ? "opacity-25 scale-105"
//                           : "opacity-100 scale-100"
//                       }`}
//                     />
//                     {/* Gradient Overlay */}
//                     <div className="absolute inset-0 " />
//                   </div>

//                   {/* Hover Card Overlay */}
//                   <div
//                     className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
//                       isHovered && index === currentSlide
//                         ? "opacity-100 translate-y-0"
//                         : "opacity-0 translate-y-8 pointer-events-none"
//                     }`}
//                   >
//                     <div className="backdrop-blur-md rounded-xl !p-8 md:p-12 max-w-2xl mx-6 shadow-2xl border transform transition-all duration-500">
//                       <div className="text-sm font-semibold tracking-wider uppercase mb-3">
//                         {interview.date}
//                       </div>
//                       <h3 className="text-3xl md:text-4xl font-bold mb-4">
//                         {interview.title}
//                       </h3>
//                       <p className=" text-lg leading-relaxed mb-6">
//                         {interview.description}
//                       </p>
//                       <a
//                         href={interview.link}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="inline-flex items-center gap-2  font-semibold m-3 !p-5 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
//                       >
//                         Read More
//                         <svg
//                           className="w-5 h-5"
//                           fill="none"
//                           stroke="currentColor"
//                           viewBox="0 0 24 24"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M17 8l4 4m0 0l-4 4m4-4H3"
//                           />
//                         </svg>
//                       </a>
//                     </div>
//                   </div>

//                   {/* Static Info (shown when not hovering) */}
//                   <div
//                     className={`absolute bottom-0 left-0 right-0 p-8 md:p-12 transition-opacity duration-500 ${
//                       isHovered && index === currentSlide
//                         ? "opacity-0"
//                         : "opacity-100"
//                     }`}
//                   >
//                     <div className="text-sm font-semibold tracking-wider uppercase !m-2">
//                       {interview.date}
//                     </div>
//                     <h3 className="text-3xl md:text-4xl font-bold !m-2">
//                       {interview.title}
//                     </h3>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Dot Navigation */}
//           <div className="flex justify-center gap-3 !mt-8">
//             {interviews.map((_, index) => (
//               <button
//                 key={index}
//                 onClick={() => handleDotClick(index)}
//                 className="group relative"
//                 aria-label={`Go to slide ${index + 1}`}
//               >
//                 <div
//                   className={`h-1 rounded-full transition-all duration-500 ${
//                     index === currentSlide
//                       ? "w-12 bg-gradient-to-r from-amber-400 to-orange-400"
//                       : "w-8 bg-slate-600 group-hover:bg-slate-500"
//                   }`}
//                 />
//                 {/* Active indicator */}
//                 {index === currentSlide && !isPaused && !isHovered && (
//                   <div
//                     className="absolute top-0 left-0 h-1 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full origin-left"
//                     style={{
//                       animation: "progress 5s linear",
//                       width: "3rem",
//                     }}
//                   />
//                 )}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Instruction hint */}
//         <>&nbsp;</>
//       </div>

//       <style jsx>{`
//         @keyframes progress {
//           from {
//             transform: scaleX(0);
//           }
//           to {
//             transform: scaleX(1);
//           }
//         }
//       `}</style>
//     </section>
//   );
// };

// export default Interview;
