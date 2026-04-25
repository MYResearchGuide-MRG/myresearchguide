import type { NextPage } from 'next'
import Head from 'next/head'

const IndexPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Design without Limits (Animated Gradient)</title>
      </Head>

      <div className="flex !important items-center !important justify-center !important min-h-screen !important bg-black !important p-4 !important">
        <h1 className="text-6xl !important md:text-8xl !important font-extrabold !important tracking-tighter !important">
          {/* Static black part "Design" */}
          <span className="text-white !important">Design</span>
          {' '}

          {/* Animated gradient part "without" */}
          <span className="relative !important inline-block !important">
            <span
              className="absolute !important inset-0 !important bg-gradient-to-r !important from-fuchsia-500 !important via-purple-500 !important to-cyan-500 !important"
              style={{
                backgroundSize: '200% auto',
                animation: 'gradient-flow 3s linear infinite',
              }}
            />
            <span className="relative !important text-transparent !important bg-clip-text !important">
              without
            </span>
          </span>
          {' '}

          {/* Static black part "Limits" */}
          <span className="text-white !important">Limits</span>
        </h1>
      </div>

      <style jsx global>{`
        @keyframes gradient-flow {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 200% 50%;
          }
        }
      `}</style>
    </>
  )
}

export default IndexPage