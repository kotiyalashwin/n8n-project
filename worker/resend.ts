import { Resend } from "resend";
import { RESEND_KEY } from "./constant";
import type { SendMailProps } from "./types";

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
    from: "x8x@woksh.com",
    to,
    subject: subject || "Powered by x8x",
    html: body,
  });
};
