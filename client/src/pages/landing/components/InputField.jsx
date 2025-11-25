import { ErrorMessage, useField } from "formik";

const InputField = ({ name, placeholder }) => {
  const [field, meta] = useField(name);
  const base =
    "glass  rounded-full p-3 mt-5 outline-0 w-full";
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

export default InputField;
