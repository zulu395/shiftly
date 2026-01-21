import {
    Body,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Img,
    Preview,
    Section,
    Text,
} from "@react-email/components";
import { emailStyles } from "./styles";
import { format } from "date-fns";
import { CONFIG } from "@/utils/constants";

export interface EventCancellationEmailParams {
    to: string;
    eventTitle: string;
    eventDate: string | Date;
}

export const EventCancellationEmail = ({
    to = "Satoshi Nakamoto",
    eventTitle = "Strategic Planning Meeting",
    eventDate = new Date(),
}: EventCancellationEmailParams) => {
    const { main, container, hr, paragraph, footer, box, heading, } = emailStyles;

    return (
        <Html>
            <Head />
            <Preview>Event Cancelled: {eventTitle}</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Section style={box}>
                        <Img
                            src={CONFIG.website.logoUrl}
                            width="24"
                            height="24"
                            alt="Shiftly"
                        />
                        <Hr style={hr} />
                        <Heading style={heading}>Event Cancelled</Heading>
                        <Text style={paragraph}>Hi {to.split("@")[0]},</Text>
                        <Text style={paragraph}>
                            We&apos;re writing to verify that the following event has been <strong>cancelled</strong>.
                        </Text>

                        <Section style={{ padding: "10px 0" }}>
                            <Text style={paragraph}>
                                <strong>Event:</strong> {eventTitle}
                            </Text>
                            <Text style={paragraph}>
                                <strong>Date:</strong> {format(new Date(eventDate), "MMMM do, yyyy")}
                            </Text>
                        </Section>

                        <Text style={paragraph}>
                            The event has been removed from your schedule.
                        </Text>

                        <Hr style={hr} />
                        <Text style={footer}>
                            {CONFIG.website.name}
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
};

export default EventCancellationEmail;
