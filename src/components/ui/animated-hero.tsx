import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MoveRight, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GradientText } from "@/components/ui/gradient-text";

function Hero() {
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(() => ["science", "research"], []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <div className="!w-full !block">
      <div className="container !mx-auto">
        {/* Added ! to flex, gap, mt, and alignment to beat Bootstrap's grid/margin defaults */}
        <div className="!flex !gap-8 !items-center !justify-center !flex-col">
          <div>
            <div className="flex flex-col gap-6 p-10 bg-black items-center">
              {/* 1. THE UNCLICKABLE TEXTBOX */}
              <div
                /* THE KEY PART: 'pointer-events-none' makes it unclickable. 
           Change to 'pointer-events-auto cursor-pointer' to make it a button.
        */
                className="
          !pointer-events-auto
          cursor-pointer
          !select-none
          !relative 
          !px-8 
          !py-3 
          !rounded-full 
          !border 
          !border-white/20 
          !bg-white/10 
          !backdrop-blur-md
          !text-white 
          !font-semibold 
          !mt-10
          md:!mt-0
          md:!text-lg
          !shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),inset_0_-1px_1px_rgba(0,0,0,0.4),0_10px_20px_rgba(0,0,0,0.5)]
          !transition-all
        "
              >
                {" "}
                <a
                  href="https://forms.gle/Sk9JS3kcKe8qw1cU6"
                  className="!text-white !no-underline"
                >
                  {/* The bottom shine/reflection line */}
                  <div className="!absolute !bottom-0 !left-1/2 !-translate-x-1/2 !w-3/4 !h-[1px] !bg-gradient-to-r !from-transparent !via-white/40 !to-transparent" />
                  Click here to sign up for our mailing list!
                </a>
              </div>
            </div>
          </div>
          <div className="!flex !flex-col !items-center !w-full">
            <h1 className="!text-5xl md:!text-[5rem] !max-w-none !text-center">
              <span className="!text-spektr-cyan">
                Malaysia&apos;s #1 Guide to{" "}
              </span>
              <span className="!relative !flex md:!text-[6rem] !w-full !justify-center !overflow-visible !text-center md:!pb-4 md:!pt-1 !font-semibold bg-gradient-to-r from-stone-400  to-slate-300 bg-clip-text text-transparent">
                &nbsp;
                {/* {titles.map((title, index) => (
                  <motion.span
                    key={index}
                    className="!absolute !font-semibold bg-gradient-to-r from-stone-400  to-slate-300 bg-clip-text text-transparent"
                    initial={{ opacity: 0, y: -100 }}
                    transition={{ type: "spring", stiffness: 50 }}
                    animate={
                      titleNumber === index
                        ? { y: 0, opacity: 1 }
                        : { y: titleNumber > index ? -150 : 150, opacity: 0 }
                    }
                  >
                    {title}
                  </motion.span>
                ))} */}
                Science Research
              </span>
            </h1>

            {/* FIX: Added !mx-auto to the paragraph to center the block itself within the flex column */}
            <p className="!text-lg md:!text-xl !leading-relaxed !tracking-tight !text-muted-foreground !max-w-2xl !text-center !mx-auto !mt-4">
              Welcome to MYResearchGuide, the beginner-friendly platform for all
              STEM-based research. Backed by researchers from leading
              universities and institutions - start your research journey today
              with MYResearchGuide.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Hero };
