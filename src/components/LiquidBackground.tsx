export default function LiquidBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Blob 1 — top-left */}
      <div
        className="blob-1 absolute w-[550px] h-[550px]
          bg-blue-400/30 dark:bg-indigo-600/25
          blur-[90px]"
        style={{ top: "-15%", left: "-10%" }}
      />
      {/* Blob 2 — right-center */}
      <div
        className="blob-2 absolute w-[480px] h-[480px]
          bg-violet-400/25 dark:bg-violet-700/20
          blur-[90px]"
        style={{ top: "40%", right: "-12%" }}
      />
      {/* Blob 3 — bottom-center */}
      <div
        className="blob-3 absolute w-[420px] h-[420px]
          bg-pink-300/25 dark:bg-blue-800/25
          blur-[90px]"
        style={{ bottom: "10%", left: "25%" }}
      />
      {/* Blob 4 — bottom-right */}
      <div
        className="blob-4 absolute w-[380px] h-[380px]
          bg-cyan-300/20 dark:bg-purple-900/25
          blur-[90px]"
        style={{ bottom: "-8%", right: "10%" }}
      />
      {/* Blob 5 — top-center subtle accent */}
      <div
        className="blob-5 absolute w-[300px] h-[300px]
          bg-emerald-300/15 dark:bg-cyan-900/20
          blur-[80px]"
        style={{ top: "20%", left: "40%" }}
      />
    </div>
  );
}
