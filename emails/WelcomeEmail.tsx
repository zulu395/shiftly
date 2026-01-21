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

export function WelcomeEmail() {
  const { main, container, hr, paragraph, footer, anchor, box, button } =
    emailStyles;

  return (
    <Html>
      <Head />
      <Preview>
        You have successfully created an account with {CONFIG.website.name}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={box}>
            <Img src={CONFIG.website.logoUrl} width="24" height="24" alt="" />
            <Hr style={hr} />
            <Text style={paragraph}>
              Thanks for creating an account with {CONFIG.website.name}.
              You&apos;re now ready to buy your choice products!
            </Text>
            <Text style={paragraph}>
              You can start buying products you love by exploring our shop.
            </Text>
            <Button style={button} href={CONFIG.website.host + "/"}>
              Go to Shop
            </Button>
            <Hr style={hr} />
            <Text style={paragraph}>
              You can also{" "}
              <Link style={anchor} href={CONFIG.website.host + "/dashboard"}>
                view your dashboard
              </Link>{" "}
              to manage cart and orders.
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

export default WelcomeEmail;
