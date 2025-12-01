import { Mail, MapPin } from "lucide-react";
import { useEffect } from "react";
import PhoneInputField from "../../../../components/inputs/PhoneInput";
import Checkbox from "../../../../components/inputs/CheckBox";
import Input from "../../../../components/inputs/Input";

const StepContact = ({ control, watch, setValue }) => {
  const useSameNumber = watch("useSameNumberForWhatsapp");
  const phoneValue = watch("phone");

  useEffect(() => {
    if (useSameNumber && phoneValue) {
      // Only copy the value if it's different to prevent unnecessary re-renders/dirty state
      if (
        phoneValue.dialCode !== watch("whatsapp").dialCode ||
        phoneValue.countryCode !== watch("whatsapp").countryCode ||
        phoneValue.phoneNumber !== watch("whatsapp").phoneNumber
      ) {
        setValue("whatsapp", phoneValue, {
          shouldValidate: false,
          shouldDirty: true,
        });
      }
    }
  }, [useSameNumber, phoneValue, setValue, watch]);

  const phoneRules = {
    required: "Phone is required",
    validate: (value) => {
      if (!value.phoneNumber || value.phoneNumber.length < 6) {
        return "Please enter a valid phone number (at least 6 digits)";
      }
      return true;
    },
  };

  return (
    <>
      <PhoneInputField
        name="phone"
        label="Phone Number (Call)"
        control={control}
        rules={phoneRules}
        type="tel"
        placeholder="54 514 4220"
      />

      <Checkbox
        control={control}
        name={"useSameNumberForWhatsapp"}
        label={"Use the same number for WhatsApp"}
      />

      <PhoneInputField
        name="whatsapp"
        label="WhatsApp Number"
        control={control}
        rules={useSameNumber ? {} : phoneRules}
        type="tel"
        disabled={useSameNumber}
        placeholder="54 514 4220"
      />

      <Input
        name="email"
        label="Email Address"
        icon={Mail}
        control={control}
        rules={{
          required: "Email is required",
          pattern: {
            value: /^\S+@\S+$/i,
            message: "Invalid email address",
          },
        }}
        type="email"
      />
      <Input
        name="location"
        label="Location/Address"
        icon={MapPin}
        control={control}
        type="text"
        rules={{
          required: "Location is required",
          pattern: {
            value:
              /^(https?:\/\/)?(www\.)?(google\.com\/maps\/.+|goo\.gl\/maps\/.+|maps\.app\.goo\.gl\/.+)$/i,
            message: "Please enter a valid Google Maps URL",
          },
        }}
      />
    </>
  );
};

export default StepContact;
