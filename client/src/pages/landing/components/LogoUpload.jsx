import { ErrorMessage } from "formik";
import { Upload } from "lucide-react";
import { useRef } from "react";
import { useFormikContext } from "formik";
const LogoUpload = () => {
  const fileRef = useRef(null);
  const { setFieldValue } = useFormikContext();
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
      className="glass gradient-border rounded-2xl p-5 w-full flex flex-col justify-center "
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

export default LogoUpload;
