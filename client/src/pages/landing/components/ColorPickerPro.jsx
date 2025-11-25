import { useCallback, useEffect, useMemo, useState } from "react";
import {
  GRADIENT_PRESETS,
  SOLID_PRESETS,
  toLinearGradient,
  toRadialGradient,
} from "../constants/cardsData";
import { useLandingContext } from "../contexts/LandingContext";

function ColorPickerPro() {
  const { colorData, setColorData } = useLandingContext();
  console.log(colorData);
  
  const [mode, setMode] = useState(colorData.mode);
  const [gradient, setGradient] = useState(() => ({
    type: colorData?.type || "linear",
    from: colorData?.stops.from,
    to: colorData?.stops?.to,
    angle: colorData.angle ?? 135,
  }));
  const [solid, setSolid] = useState("#374151");

  const value = useMemo(() => {
    if (mode === "solid") return solid;
    if (gradient.type === "linear") return toLinearGradient(gradient);
    if (gradient.type === "radial") return toRadialGradient(gradient);
    return solid;
  }, [mode, solid, gradient]);

  const payload = useMemo(
    () => ({
      mode,
      value,
      stops: { from: gradient.from, to: gradient.to },
      angle: gradient.angle,
      gradientType: gradient.type,
    }),
    [mode, value, gradient]
  );

  useEffect(() => {
    setColorData(payload);
  }, [payload, setColorData]);

  const setGradientProp = useCallback(
    (prop, val) => setGradient((g) => ({ ...g, [prop]: val })),
    []
  );

  return (
    <div
      className={`glass-gradient gradient-border rounded-2xl w-full border p-4 flex-1 `}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-neutral-100">
          Card Background
        </span>
        <div className="flex items-center gap-2">
          {["solid", "gradient"].map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              aria-pressed={mode === m}
              className={`px-3 py-1.5 rounded text-sm transition ${
                mode === m
                  ? "bg-gradient-to-br from-primary to-green-800 text-black"
                  : "bg-neutral-700 text-neutral-200 hover:bg-neutral-600"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-16 h-16 rounded-lg border border-gray-700"
          style={{ background: value }}
          aria-label={`Card Bg With Preview`}
          role="img"
        />
        <div className="text-sm text-neutral-100 break-all select-all">
          {value}
        </div>
      </div>

      {mode === "solid" ? (
        <SolidColorPicker
          solid={solid}
          setSolid={setSolid}
          presets={SOLID_PRESETS}
        />
      ) : (
        <>
          <GradientTypeSwitcher
            gradient={gradient}
            setGradientProp={setGradientProp}
          />
          <GradientColorPicker
            gradient={gradient}
            setGradientProp={setGradientProp}
            presets={GRADIENT_PRESETS}
          />
        </>
      )}
    </div>
  );
}

export default ColorPickerPro;

const GradientTypeSwitcher = ({ gradient, setGradientProp }) => (
  <div className="flex gap-2 mb-4">
    {["linear", "radial"].map((type) => (
      <button
        key={type}
        type="button"
        onClick={() => setGradientProp("type", type)}
        aria-pressed={gradient.type === type}
        className={`px-3 py-1 rounded text-sm transition ${
          gradient.type === type
            ? "bg-gradient-to-br from-primary to-green-800 text-black"
            : "bg-neutral-700 text-neutral-200 hover:bg-neutral-600"
        }`}
      >
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </button>
    ))}
  </div>
);

const SolidColorPicker = ({ solid, setSolid, presets }) => (
  <div className="space-y-4">
    <div className="flex items-center gap-3">
      <input
        aria-label="Solid color"
        type="color"
        value={solid}
        onChange={(e) => setSolid(e.target.value)}
        className="w-1/2 h-12 rounded cursor-pointer "
      />
      <input
        type="text"
        value={solid}
        onChange={(e) => setSolid(e.target.value)}
        className="flex-1 px-3 py-2 text-sm  border border-neutral-600 rounded outline-none focus:ring-2 focus:ring-gray-300"
        placeholder="#374151"
      />
    </div>
    <div>
      <div className="text-xs text-gray-700 mb-2">Solid presets</div>
      <div className="flex flex-wrap gap-2">
        {presets.map((p) => (
          <button
            key={p.name}
            type="button"
            onClick={() => setSolid(p.value)}
            className="w-10 h-10 rounded border"
            title={p.name}
            style={{ background: p.value }}
            aria-label={p.name}
          />
        ))}
      </div>
    </div>
  </div>
);

const GradientColorPicker = ({ gradient, setGradientProp, presets }) => (
  <div className="space-y-4">
    <div className="flex flex-col gap-3">
      {["from", "to"].map((label) => (
        <div key={label} className="grid grid-cols-12 items-center gap-3">
          {/* Label column - small width */}
          <div className="col-span-2 text-neutral-100 capitalize">{label}</div>

          {/* Color input */}
          <input
            aria-label={`Gradient ${label} color`}
            type="color"
            value={gradient[label]}
            onChange={(e) => setGradientProp(label, e.target.value)}
            className="col-span-5 rounded outline-none cursor-pointer border-0 w-full h-full"
          />

          {/* Text input */}
          <input
            type="text"
            value={gradient[label]}
            onChange={(e) => setGradientProp(label, e.target.value)}
            className="col-span-5 px-3 py-2 text-sm border border-neutral-600 rounded outline-none focus:ring-2 focus:ring-gray-300"
            placeholder={label === "from" ? "#2563eb" : "#1e3a8a"}
          />
        </div>
      ))}
    </div>

    {gradient.type === "linear" && (
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-neutral-200">Angle</span>
          <span className="text-sm text-neutral-200">{gradient.angle}°</span>
        </div>
        <input
          type="range"
          min={0}
          max={360}
          value={gradient.angle}
          onChange={(e) =>
            setGradientProp("angle", parseInt(e.target.value, 10))
          }
          className="w-full "
          aria-valuemin={0}
          aria-valuemax={360}
          aria-valuenow={gradient.angle}
          aria-label="Gradient angle"
        />
      </div>
    )}

    <div>
      <div className="text-sm text-gray-100 mb-2">Gradient presets</div>
      <div className="flex flex-wrap gap-3">
        {presets.map((p) => (
          <button
            key={p.name}
            type="button"
            onClick={() => {
              setGradientProp("from", p.from);
              setGradientProp("to", p.to);
              setGradientProp("angle", p.angle ?? 135);
            }}
            className="aspect-[1/1] h-16 rounded-full border border-neutral-600"
            title={p.name}
            style={{ background: toLinearGradient(p) }}
            aria-label={`${p.name} gradient preset`}
          />
        ))}
      </div>
    </div>
  </div>
);
