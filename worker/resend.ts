import { Resend } from "resend";
import { RESEND_KEY } from "./constant";

type SendMailProps = {
  to: string;
  subject?: string;
  body: string;
  key?: string;
};

export const SendMail = async ({ to, subject, body, key }: SendMailProps) => {
  let resend;
  if (key) {
    resend = new Resend(key);
  } else {
    resend = new Resend(RESEND_KEY);
  }

  if (!resend) {
    throw new Error("Unable to initialize RESEND");
  }
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to,
    subject: subject || "Powered by x8x",
    html: body,
  });
};
