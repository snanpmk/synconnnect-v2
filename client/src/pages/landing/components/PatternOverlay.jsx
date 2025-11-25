export const PatternOverlay = ({ type, opacity = 0.12 }) => {
  
  if (type === "none") return null;
  const baseProps = { patternUnits: "userSpaceOnUse" };
  const patterns = {
    "dots": {
      attrs: { ...baseProps, x: 0, y: 0, width: 20, height: 20 },
      elements: <circle cx="10" cy="10" r="2" fill="white" />,
    },
    "waves": {
      attrs: { ...baseProps, x: 0, y: 0, width: 60, height: 30 },
      elements: (
        <path
          d="M0 15 Q15 0 30 15 T60 15"
          stroke="white"
          strokeWidth="2"
          fill="none"
        />
      ),
    },
    "hexagon": {
      attrs: { ...baseProps, x: 0, y: 0, width: 40, height: 35 },
      elements: (
        <path
          d="M10 0 L30 0 L40 17.5 L30 35 L10 35 L0 17.5 Z"
          stroke="white"
          strokeWidth="1"
          fill="none"
        />
      ),
    },
    "grid": {
      attrs: { ...baseProps, width: 24, height: 24 },
      elements: (
        <path d="M24 0 L0 0 0 24" fill="none" stroke="white" strokeWidth="1" />
      ),
    },
    "diagonal": {
      attrs: {
        ...baseProps,
        width: 16,
        height: 16,
        patternTransform: "rotate(45)",
      },
      elements: (
        <line x1="0" y1="0" x2="0" y2="16" stroke="white" strokeWidth="2" />
      ),
    },
    "cross": {
      attrs: { ...baseProps, width: 24, height: 24 },
      elements: (
        <path d="M12 0 V24 M0 12 H24" stroke="white" strokeWidth="1.2" />
      ),
    },
    "stripes": {
      attrs: { ...baseProps, width: 10, height: 10 },
      elements: <rect width="5" height="10" fill="white" />,
    },
    "triangles": {
      attrs: { ...baseProps, width: 20, height: 20 },
      elements: <path d="M0 20 L10 0 L20 20 Z" fill="white" />,
    },
    "circles": {
      attrs: { ...baseProps, width: 30, height: 30 },
      elements: <circle cx="15" cy="15" r="5" fill="white" />,
    },
    "waves-large": {
      attrs: { ...baseProps, width: 80, height: 40 },
      elements: (
        <path
          d="M0 20 Q20 0 40 20 T80 20"
          stroke="white"
          strokeWidth="3"
          fill="none"
        />
      ),
    },
    "hexgrid": {
      attrs: { ...baseProps, width: 50, height: 43 },
      elements: (
        <path
          d="M25 0 L45 12.5 L45 37.5 L25 50 L5 37.5 L5 12.5 Z"
          stroke="white"
          strokeWidth="1"
          fill="none"
        />
      ),
    },
    "diagonal-lines": {
      attrs: {
        ...baseProps,
        width: 10,
        height: 10,
        patternTransform: "rotate(45)",
      },
      elements: (
        <line x1="0" y1="0" x2="10" y2="0" stroke="white" strokeWidth="1" />
      ),
    },
    "crosshatch": {
      attrs: { ...baseProps, width: 10, height: 10 },
      elements: (
        <>
          <line x1="0" y1="0" x2="10" y2="10" stroke="white" strokeWidth="1" />
          <line x1="10" y1="0" x2="0" y2="10" stroke="white" strokeWidth="1" />
        </>
      ),
    },
    "dots-sparse": {
      attrs: { ...baseProps, width: 40, height: 40 },
      elements: <circle cx="20" cy="20" r="3" fill="white" />,
    },
    "diamond": {
      attrs: { ...baseProps, width: 20, height: 20 },
      elements: (
        <path
          d="M10 0 L20 10 L10 20 L0 10 Z"
          stroke="white"
          strokeWidth="1"
          fill="none"
        />
      ),
    },
    "grid-dots": {
      attrs: { ...baseProps, width: 24, height: 24 },
      elements: (
        <>
          <circle cx="6" cy="6" r="2" fill="white" />
          <circle cx="18" cy="6" r="2" fill="white" />
          <circle cx="6" cy="18" r="2" fill="white" />
          <circle cx="18" cy="18" r="2" fill="white" />
        </>
      ),
    },
  };

  const pattern = patterns[type];
  if (!pattern) return null;

  return (
    <div className="absolute inset-0 pointer-events-none " style={{ opacity }}>
      <svg
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
{          console.log(pattern)}          
          <pattern id={type} {...pattern.attrs}>
            {pattern.elements}
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${type})`} />
      </svg>
    </div>
  );
};
