const VerticalProgressBar = ({ progress }) => {
  const height = Math.min(100, Math.max(0, progress));
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="relative glass rounded-full overflow-hidden w-2 h-full min-h-[200px] max-h-full flex-1">
        <div
          className="absolute bottom-0 left-0 w-full transition-all duration-500"
          style={{
            height: `${height}%`,
            background: "linear-gradient(to top, #032200, #67d861)",
          }}
          aria-valuenow={height}
          aria-valuemin={0}
          aria-valuemax={100}
          role="progressbar"
        />
      </div>
      <span
        className="text-primary inline-block [writing-mode:vertical-rl] mt-4"
        aria-label="Progress percentage"
      >
        {height}%
      </span>
    </div>
  );
};

export default VerticalProgressBar;
