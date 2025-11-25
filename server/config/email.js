// import sgMail from "@sendgrid/mail";
// import dotenv from "dotenv";

// dotenv.config();

// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// export { sgMail };
// server/config/email.js

// Email service disabled
export const sgMail = {
  send: async () => {
    console.log("📭 SendGrid email disabled — no email sent.");
    return true;
  },
};
