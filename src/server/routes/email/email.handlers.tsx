import { AppRouteHandler } from "@/server/types";
import { TestEmailRoute } from "./email.route";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { Resend } from "resend";
import { render } from "@react-email/render";

import EmailActivateAccount from "@/features/email/email-activate-account";
import EmailReturningAccount from "@/features/email/email-returning-account";

const key = process.env.RESEND_API_KEY;

if (!key) {
  throw new Error("No Api key");
}
const resend = new Resend(key);

export const sendEmail: AppRouteHandler<TestEmailRoute> = async (c) => {
  c.var.logger.info("Processing email");

  const { to, link, subject, name, type } = c.req.valid("json");

  let html;

  switch (type) {
    case "welcome":
      html = await render(
        <EmailActivateAccount inviteLink={link} name={name} />,
        {
          pretty: true,
        }
      );
      break;
    case "returning":
      html = await render(
        <EmailReturningAccount inviteLink={link} name={name} />,
        {
          pretty: true,
        }
      );
  }

  if (!html) {
    throw new Error("No email sent");
  }

  const { data, error } = await resend.emails.send({
    from: "incrementatuconsulta <info@aumentapacientes.com>",
    to,
    subject,
    html: html,
  });

  if (error) {
    return c.json({ message: "Error sending email" }, 400);
  }

  console.log(data);

  return c.json({ message: "Email sent" }, HttpStatusCodes.OK);
};
