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
    Text
} from "@react-email/components";
import { format } from "date-fns";
import { emailStyles } from "./styles";

export type EventInvitationEmailParams = {
    email: string;
    eventTitle: string;
    eventDate: Date;
    inviterName?: string;
    link: string;
};

export function EventInvitationEmail({
    eventTitle,
    eventDate,
    inviterName = "Admin",
    link,
}: EventInvitationEmailParams) {
    const { main, container, hr, paragraph, footer, box, button } =
        emailStyles;

    return (
        <Html>
            <Head />
            <Preview>You&apos;re invited to {eventTitle}</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Section style={box}>
                        <Img src={CONFIG.website.logoUrl} width="24" height="24" alt="" />
                        <Hr style={hr} />
                        <Text style={paragraph}>Hello,</Text>
                        <Text style={paragraph}>
                            You have been invited by {inviterName} to attend:
                        </Text>
                        <Text style={{ ...paragraph, fontWeight: "bold", fontSize: "18px" }}>
                            {eventTitle}
                        </Text>
                        <Text style={paragraph}>
                            When: {format(new Date(eventDate), "MMMM do, yyyy h:mm a")}
                        </Text>

                        <Button style={button} href={link}>
                            View Event Details
                        </Button>

                        <Hr style={hr} />
                        <Text style={paragraph}>
                            You can accept or decline this invitation by clicking the button above.
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

export default EventInvitationEmail;
