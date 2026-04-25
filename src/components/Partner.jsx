/* eslint-disable @next/next/no-img-element */
export default function Partner() {
  return (
    <section className="w-full px-6 py-12">
      {/* Container that stays in the middle */}
      <div className="mx-auto max-w-5xl">

        <h1 className="mb-12 text-center text-5xl font-normal tracking-tighter md:text-7xl lg:text-8xl">
          <span className="text-spektr-cyan">Partners.</span>
        </h1>

        {/* White box for logos - Updated to Grid for 2-3 items per row */}
        <div className="grid grid-cols-1 gap-8 rounded-2xl bg-white p-10 shadow-md border border-gray-100 sm:grid-cols-2 lg:grid-cols-3">

          <div className="flex items-center justify-center">
            <a href="https://www.mbios.org" className="flex justify-center">
              <img
                src="/mbios.png"
                alt="MBIOS Logo"
                className="h-auto max-w-[180px] object-contain transition-all hover:scale-105"
              />
            </a>
          </div>

          <div className="flex items-center justify-center">
            <a href="https://seaecon.org" className="flex justify-center">
              <img
                src="/seaecon.png"
                alt="Partner Logo"
                className="h-auto max-w-[150px] object-contain grayscale transition-all hover:grayscale-0"
              />
            </a>
          </div>

          <div className="flex items-center justify-center">
            <a href="https://apcore.apu.edu.my" className="flex justify-center">
              <img
                src="/apcore.jpg"
                alt="apcore"
                className="h-auto max-w-[150px] object-contain transition-all hover:scale-105"
              />
            </a>
          </div>

          <div className="flex items-center justify-center">
            <a href="https://girlsinstem43.wixsite.com/girlsinstemkl" className="flex justify-center">
              <img
                src="/girls4stem.jpeg"
                alt="Partner Logo"
                className="h-auto max-w-[150px] object-contain transition-all hover:scale-105"
              />
            </a>
          </div>

          {/* <div className="flex items-center justify-center">
            <a href="https://scholarships.baseinitiativemy.com" className="flex justify-center">
              <img
                src="/base.jpg"
                alt="Partner Logo"
                className="h-auto max-w-[150px] object-contain transition-all hover:scale-105"
              />
            </a>
          </div>
           */}
        </div>
      </div>
    </section>
  );
}