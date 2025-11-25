const GridOverlay = () => (
  <div
    className="pointer-events-none absolute inset-0 w-full h-full"
    style={{
      backgroundImage: `
        linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)
      `,
      backgroundSize: "80px 80px",
      zIndex: 2,
      maskImage:
        "radial-gradient(ellipse at center, white 4%, transparent 100%)",
      WebkitMaskImage:
        "radial-gradient(ellipse at center, white 4%, transparent 100%)",
    }}
    aria-hidden="true"
  />
);
export default GridOverlay;
