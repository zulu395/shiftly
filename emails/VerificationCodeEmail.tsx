import { CONFIG } from "@/utils/constants";
import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { emailStyles } from "./styles";
import { VerificationCodeEmailParams } from "@/server/services/EmailService";

export function VerificationCodeEmail({
  email = "",
  code = "190827",
}: VerificationCodeEmailParams) {
  const { main, container, hr, paragraph, extrabold, footer, anchor, box } =
    emailStyles;

  return (
    <Html>
      <Head />
      <Preview>Verification code {CONFIG.website.name}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={box}>
            <Img src={CONFIG.website.logoUrl} width="24" height="24" alt="" />
            <Hr style={hr} />
            <Text style={paragraph}>
              A request was made on your account that requires email
              verification, use the code below to verify your email address{" "}
            </Text>
            <Text style={extrabold}>{code}</Text>
            <Hr style={hr} />
            <Text style={paragraph}>
              You can{" "}
              <Link
                style={anchor}
                href={
                  CONFIG.website.host +
                  `/contact?utm_source=email&type=unknow_request&email=${email}`
                }
              >
                Report this email
              </Link>{" "}
              if this request was not made by you.
            </Text>

            <Text style={paragraph}>— {CONFIG.website.name}</Text>
            <Hr style={hr} />
            <Text style={footer}>{CONFIG.website.address}</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
