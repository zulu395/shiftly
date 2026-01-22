import {
  PasswordChangedEmail,
  VerificationCodeEmail,
  WelcomeEmail,
  EventInvitationEmail,
  EmployeeInvitationEmail,
  AvailabilityUpdateEmail,
} from "@/emails";
import { AvailabilityUpdateEmailParams } from "@/emails/AvailabilityUpdateEmail";
import { EventInvitationEmailParams } from "@/emails/EventInvitationEmail";
import { EmployeeInvitationEmailParams } from "@/emails/EmployeeInvitationEmail";
import {
  EventCancellationEmailParams,
  EventCancellationEmail,
} from "@/emails/EventCancellationEmail";
import Plunk from "@plunk/node";
import { render } from "@react-email/render";
import { JSX } from "react";
import { ServiceResponse } from "@/types";
import { AppError } from "@/utils/appError";
const plunk = new Plunk(process.env.PLUNK_API_KEY ?? "");

export type SendEmailParams = {
  to: string | string[];
  subject: string;
};

export type VerificationCodeEmailParams = {
  email: string;
  code: string;
};

export type OrderEmailProps = {
  fullName: string;
  orderId: string;
};

async function sendEmail(
  email: JSX.Element,
  params: SendEmailParams,
): Promise<ServiceResponse<boolean>> {
  const body = await render(email);
  const res = await plunk.emails.send({
    ...params,
    body,
  });

  if (!res.success) return new AppError("Email sending failed");
  return true;
}

export const EmailService = {
  send: sendEmail,
  welcome: sendEmail.bind(null, WelcomeEmail()),
  passwordChanged: (props: { email: string }) =>
    sendEmail.bind(null, PasswordChangedEmail(props)),
  verificationCode: (props: VerificationCodeEmailParams) =>
    sendEmail.bind(null, VerificationCodeEmail(props)),

  eventInvitation: (props: EventInvitationEmailParams) =>
    sendEmail.bind(null, EventInvitationEmail(props)),

  eventCancellation: (props: EventCancellationEmailParams) =>
    sendEmail.bind(null, EventCancellationEmail(props)),

  employeeInvitation: (props: EmployeeInvitationEmailParams) =>
    sendEmail.bind(null, EmployeeInvitationEmail(props)),

  availabilityUpdate: (props: AvailabilityUpdateEmailParams) =>
    sendEmail.bind(null, AvailabilityUpdateEmail(props)),
};
