import { CONFIG } from "@/utils/constants";
import {
  Body,
  Button,
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

export function PasswordChangedEmail({ email }: { email: string }) {
  const { main, container, hr, paragraph, footer, anchor, box, button } =
    emailStyles;

  return (
    <Html>
      <Head />
      <Preview>
        You have successfully changed your password for {CONFIG.website.name}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={box}>
            <Img src={CONFIG.website.logoUrl} width="24" height="24" alt="" />
            <Hr style={hr} />
            <Text style={paragraph}>
              Your {CONFIG.website.name} password has been successfully changed.
            </Text>
            <Text style={paragraph}>
              You can login and view your dashboard to manage cart and orders.
            </Text>
            <Button style={button} href={CONFIG.website.host + "/dashboard"}>
              Go to Dashboard
            </Button>
            <Hr style={hr} />
            <Text style={paragraph}>
              If this was not you, you can{" "}
              <Link
                style={anchor}
                href={
                  CONFIG.website.host +
                  `/contact?utm_source=email&type=unknow_password_reset&email=${email}`
                }
              >
                report an issue
              </Link>
            </Text>
            <Text style={paragraph}>Best regards</Text>
            <Text style={paragraph}>— {CONFIG.website.name}</Text>
            <Hr style={hr} />
            <Text style={footer}>{CONFIG.website.address}</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default PasswordChangedEmail;
