import React, { useRef } from "react";
import { ErrorMessage, useField } from "formik";
import { Upload, Wifi } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import {
  GRADIENT_PRESETS,
  SOLID_PRESETS,
  TEMPLATE_PRESETS,
  toLinearGradient,
  toRadialGradient,
} from "../constants/cardsData";

// --- PersonalDetails Component ---
export const PersonalDetails = () => {
  const InputField = ({ name, placeholder }) => {
    const [field, meta] = useField(name);
    const base = "gradient-border glass rounded-full p-3 mt-5 outline-0 w-full";
    return (
      <>
        <input
          {...field}
          placeholder={placeholder}
          className={`${base} ${
            meta.touched && meta.error ? "border border-red-500" : ""
          }`}
          aria-invalid={meta.error ? "true" : "false"}
          aria-describedby={`${name}-error`}
        />
        <ErrorMessage
          name={name}
          component="div"
          id={`${name}-error`}
          className="text-red-500 text-sm mt-1"
        />
      </>
    );
  };

  return (
    <section
      aria-label="Personal Details"
      className="glass gradient-border rounded-2xl p-5 w-full flex flex-col justify-center flex-1"
    >
      <h2 className="text-xl font-semibold text-start">Personal Details</h2>
      <InputField name="fullName" placeholder="Full Name" />
      <InputField name="designation" placeholder="Designation" />
      <InputField name="companyName" placeholder="Company Name" />
    </section>
  );
};

// --- LogoUpload Component ---
export const LogoUpload = ({ setFieldValue }) => {
  const fileRef = useRef(null);
  const handleUploadClick = () => fileRef.current?.click();

  const onChange = (file) => {
    if (file) {
      setFieldValue("logo", URL.createObjectURL(file));
    } else {
      setFieldValue("logo", "");
    }
  };

  return (
    <section
      aria-label="Logo Upload"
      className="glass gradient-border rounded-2xl p-5 w-full flex flex-col justify-center flex-1"
    >
      <h2 className="text-xl font-semibold text-start mb-3">Logo</h2>
      <div
        role="button"
        tabIndex={0}
        onClick={handleUploadClick}
        onKeyPress={(e) => {
          if (e.key === "Enter" || e.key === " ") handleUploadClick();
        }}
        className="glass gradient-border rounded-2xl flex items-center justify-center py-10 cursor-pointer"
        aria-label="Upload Logo"
      >
        <div className="bg-black rounded-full p-3">
          <Upload />
        </div>
      </div>
      <input
        ref={fileRef}
        type="file"
        className="hidden"
        accept="image/*"
        onChange={(e) => onChange(e.target.files?.[0])}
        aria-hidden="true"
      />
      <ErrorMessage
        name="logo"
        component="div"
        className="text-red-500 text-sm mt-2"
      />
    </section>
  );
};

// --- ColorPickerPro Component ---
export const ColorPickerPro = ({
  label = "Color",
  initialMode = "solid",
  initialGradient = {
    type: "linear",
    from: "#374151",
    to: "#111827",
    angle: 135,
  },
  initialSolid = "#374151",
  onChange = () => {},
  className = "",
}) => {
  const [mode, setMode] = React.useState(initialMode); // "solid" or "gradient"
  const [gradient, setGradient] = React.useState(() => ({
    type: initialGradient.type || "linear",
    from: initialGradient.from,
    to: initialGradient.to,
    angle: initialGradient.angle ?? 135,
  }));
  const [solid, setSolid] = React.useState(initialSolid);

  // Compute the CSS value depending on mode and gradient type
  const value = React.useMemo(() => {
    if (mode === "solid") return solid;
    if (gradient.type === "linear") return toLinearGradient(gradient);
    if (gradient.type === "radial") return toRadialGradient(gradient);
    return solid; // fallback
  }, [mode, solid, gradient]);

  const payload = React.useMemo(
    () => ({
      mode,
      value,
      stops: { from: gradient.from, to: gradient.to },
      angle: gradient.angle,
      gradientType: gradient.type,
    }),
    [mode, value, gradient]
  );

  React.useEffect(() => {
    onChange(payload);
  }, [payload, onChange]);

  const setGradientProp = React.useCallback(
    (prop, val) => setGradient((g) => ({ ...g, [prop]: val })),
    []
  );

  return (
    <div
      className={`glass-gradient gradient-border rounded-lg w-full border p-4  ${className}`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-neutral-100">{label}</span>
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
          aria-label={`${label} Preview`}
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
};

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
          <div className="col-span-2 text-neutral-100 capitalize">{label}</div>
          <input
            aria-label={`Gradient ${label} color`}
            type="color"
            value={gradient[label]}
            onChange={(e) => setGradientProp(label, e.target.value)}
            className="col-span-5 rounded outline-none cursor-pointer border-0 w-full h-full"
          />
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
      <div className="flex flex-wrap gap-2">
        {presets.map((p) => (
          <button
            key={p.name}
            type="button"
            onClick={() => {
              setGradientProp("from", p.from);
              setGradientProp("to", p.to);
              setGradientProp("angle", p.angle ?? 135);
            }}
            className="w-16 h-10 rounded border border-neutral-600"
            title={p.name}
            style={{ background: toLinearGradient(p) }}
            aria-label={`${p.name} gradient preset`}
          />
        ))}
      </div>
    </div>
  </div>
);

// --- TemplateOnlySelector Component ---
export const TemplateOnlySelector = ({
  presets,
  selectedOverlay,
  setSelectedOverlay,
  setColorData,
}) => {
  return (
    <div className="glass-gradient gradient-border rounded-xl p-5">
      <h3 className="text-sm font-semibold text-neutral-200 mb-6 tracking-wide">
        Select Pattern
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {TEMPLATE_PRESETS.map((t) => {
          const isActive = selectedOverlay === t.overlay;
          return (
            <button
              key={t.name}
              type="button"
              onClick={() => {
                setSelectedOverlay(t.overlay);
                setColorData?.(t.bg);
              }}
              className={`group relative rounded-lg overflow-hidden border 
              transition-all duration-300 shadow-md 
              focus:outline-none focus:ring-2 focus:ring-purple-400/40
              ${
                isActive
                  ? "bg-black text-white shadow-xl scale-105 border-gradient"
                  : "bg-neutral-900/50 hover:bg-neutral-800/70"
              }`}
              title={t.overlay}
            >
              <div className="relative h-16 w-full">
                <div
                  className="absolute inset-0"
                  style={{ background: t.bg?.value }}
                  aria-hidden="true"
                />
                {/* PatternOverlay should be imported or defined elsewhere */}
              </div>
              <div
                className={`px-2 py-1 text-xs truncate font-medium ${
                  isActive
                    ? "text-white"
                    : "text-neutral-300 group-hover:text-white"
                }`}
              >
                {t.overlay}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// --- PreviewCard Component ---
export const PreviewCard = ({
  imgSrc,
  qrSize,
  values,
  colorData,
  selectedOverlay,
  accentColor,
  setFieldValue,
}) => {
  const [flipped, setFlipped] = React.useState(false);
  const logoImgRef = React.useRef(null);
  const canvasRef = React.useRef(null);

  const pickColor = (e) => {
    if (!logoImgRef.current || !imgSrc || !canvasRef.current) return;
    const img = logoImgRef.current,
      canvas = canvasRef.current,
      ctx = canvas.getContext("2d");
    const rect = img.getBoundingClientRect();
    const x = Math.round(
      ((e.clientX - rect.left) / rect.width) * img.naturalWidth
    );
    const y = Math.round(
      ((e.clientY - rect.top) / rect.height) * img.naturalHeight
    );
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx.drawImage(img, 0, 0);
    const pixel = ctx.getImageData(x, y, 1, 1).data;
    const hex =
      "#" +
      [0, 1, 2].map((i) => pixel[i].toString(16).padStart(2, "0")).join("");
    setFieldValue("bgColor", hex.toLowerCase());
  };

  return (
    <div className="w-full flex flex-col items-center space-y-4">
      <div className="flex justify-center items-center bg-black w-full">
        <div className="flex justify-center items-center w-full bg-black">
          <div className="flex w-full">
            {/* Front Button */}
            <button
              type="button"
              onClick={() => setFlipped(false)}
              className={`flex-1 px-6 py-3 text-center font-semibold transition-colors duration-300
              ${
                !flipped
                  ? "text-primary border-primary"
                  : "text-gray-400 border-neutral-400"
              }
              border rounded-l-full`}
            >
              Front
            </button>

            {/* Back Button */}
            <button
              type="button"
              onClick={() => setFlipped(true)}
              className={`flex-1 px-6 py-3 text-center font-semibold transition-colors duration-300
              ${
                flipped
                  ? "text-primary border-primary"
                  : "text-gray-400 border-neutral-400"
              }
              border rounded-r-full`}
            >
              Back
            </button>
          </div>
        </div>
      </div>

      <div className="relative w-full aspect-[10/6] [perspective:1000px] rounded-xl">
        <div
          className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] ${
            flipped ? "[transform:rotateY(180deg)]" : ""
          }`}
        >
          {/* Front side */}
          <div
            className="absolute inset-0 w-full h-full flex items-center justify-center rounded-xl [backface-visibility:hidden] overflow-hidden border border-gray-600/30 shadow-xl drop-shadow-zinc-500 shadow-neutral-900"
            style={{ background: colorData.value, position: "relative" }}
          >
            {/* PatternOverlay should be imported or defined */}
            {imgSrc ? (
              <img
                src={imgSrc}
                alt="Uploaded Logo Preview"
                className="w-full h-full object-cover rounded-xl"
                ref={logoImgRef}
                onClick={pickColor}
                style={{ cursor: "crosshair" }}
                role="img"
              />
            ) : (
              <div className="text-center px-2">
                <h2
                  className="uppercase font-light tracking-wider"
                  style={{ color: values.textColor }}
                >
                  Upload your Logo / Image
                </h2>
              </div>
            )}
            <canvas ref={canvasRef} style={{ display: "none" }} />
          </div>

          {/* Back side */}
          <div
            className="absolute inset-0 w-full h-full flex flex-col items-center justify-between rounded-xl p-4 [backface-visibility:hidden] [transform:rotateY(180deg)] border border-gray-600/30 shadow-xl drop-shadow-zinc-500 shadow-neutral-900"
            style={{ background: colorData.value, color: values.textColor }}
          >
            {/* PatternOverlay should be imported or defined */}

            <div className="flex justify-between w-full items-start">
              <div className="flex-1 min-w-0 text-start">
                <p className="font-bold text-lg truncate">{values.fullName}</p>
                <p className="text-sm opacity-80 truncate">
                  {values.designation}
                </p>
              </div>
              <Wifi
                className="rotate-90 flex-shrink-0"
                style={{ color: accentColor }}
                aria-label="Wi-Fi Icon"
              />
            </div>
            <div className="flex justify-between items-end w-full">
              <div className="text-start">
                <span className="text-sm font-semibold">
                  {values.companyName}
                </span>
              </div>
              <div className="bg-white p-2 rounded-md shadow-lg">
                <QRCodeCanvas
                  value={JSON.stringify({
                    name: values.fullName,
                    designation: values.designation,
                    company: values.companyName,
                  })}
                  size={qrSize}
                  includeMargin={false}
                  aria-label="QR Code"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- VerticalProgressBar Component ---
export const VerticalProgressBar = ({ progress }) => {
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
