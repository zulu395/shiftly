import { CONFIG } from "@/utils/constants";
import {
    Body,
    Button,
    Container,
    Head,
    Hr,
    Html,
    Img,
    Preview,
    Section,
    Text,
} from "@react-email/components";
import { emailStyles } from "./styles";

export type EmployeeInvitationEmailParams = {
    employeeName: string;
    companyName: string;
    link: string;
};

export function EmployeeInvitationEmail({
    employeeName,
    companyName,
    link,
}: EmployeeInvitationEmailParams) {
    const { main, container, hr, paragraph, footer, box, button } = emailStyles;

    return (
        <Html>
            <Head />
            <Preview>You&apos;ve been invited to join {companyName} on {CONFIG.website.name}</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Section style={box}>
                        <Img src={CONFIG.website.logoUrl} width="24" height="24" alt="" />
                        <Hr style={hr} />
                        <Text style={paragraph}>Hello {employeeName},</Text>
                        <Text style={paragraph}>
                            You have been invited to join <strong>{companyName}</strong> on {CONFIG.website.name}.
                        </Text>
                        <Text style={paragraph}>
                            Click the button below to accept the invitation and set up your account.
                        </Text>
                        <Button style={button} href={link}>
                            Join {companyName}
                        </Button>
                        <Hr style={hr} />
                        <Text style={paragraph}>
                            If you have any questions, feel free to reach out to your administrator.
                        </Text>
                        <Text style={paragraph}>— The {CONFIG.website.name} Team</Text>
                        <Hr style={hr} />
                        <Text style={footer}>{CONFIG.website.address}</Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
}

export default EmployeeInvitationEmail;
