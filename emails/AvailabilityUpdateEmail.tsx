import { CONFIG } from "@/utils/constants";
import {
    Body,
    Container,
    Head,
    Hr,
    Html,
    Img,
    Preview,
    Section,
    Text,
    Button,
} from "@react-email/components";
import { emailStyles } from "./styles";

export type AvailabilityUpdateEmailParams = {
    employeeName: string;
    weekDateString: string;
    dashboardLink: string;
};

export function AvailabilityUpdateEmail({
    employeeName,
    weekDateString,
    dashboardLink,
}: AvailabilityUpdateEmailParams) {
    const { main, container, hr, paragraph, footer, box, button } = emailStyles;

    return (
        <Html>
            <Head />
            <Preview>{employeeName} has updated their availability.</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Section style={box}>
                        <Img src={CONFIG.website.logoUrl} width="24" height="24" alt="" />
                        <Hr style={hr} />
                        <Text style={paragraph}>Hello,</Text>
                        <Text style={paragraph}>
                            <strong>{employeeName}</strong> has updated their availability for the week of <strong>{weekDateString}</strong>.
                        </Text>
                        <Text style={paragraph}>
                            Please log in to the dashboard to review the changes.
                        </Text>
                        <Button style={button} href={dashboardLink}>
                            View Schedule
                        </Button>
                        <Hr style={hr} />
                        <Text style={paragraph}>— The {CONFIG.website.name} Team</Text>
                        <Hr style={hr} />
                        <Text style={footer}>{CONFIG.website.address}</Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
}

export default AvailabilityUpdateEmail;
