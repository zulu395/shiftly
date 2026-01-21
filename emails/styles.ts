import { CONFIG } from "@/utils/constants";

export const emailStyles = {
  main: {
    backgroundColor: "#f6f9fc",
    fontFamily:
      '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
  },

  container: {
    backgroundColor: "#ffffff",
    margin: "0 auto",
    padding: "20px 0 48px",
    marginBottom: "64px",
  },

  box: {
    padding: "0 28px",
  },

  hr: {
    borderColor: "#e6ebf1",
    margin: "20px 0",
  },

  paragraph: {
    color: "#525f7f",
    fontSize: "16px",
    lineHeight: "24px",
    textAlign: "left" as const,
  },
  extrabold: {
    color: "#525f7f",
    fontSize: "28px",
    lineHeight: "24px",
    fontWeight: "700",
    margin: "20px 0",
    textAlign: "center" as const,
  },

  anchor: {
    color: CONFIG.colors.primaryAlt,
  },

  footer: {
    color: "#8898aa",
    fontSize: "12px",
    lineHeight: "16px",
  },

  button: {
    backgroundColor: CONFIG.colors.primary,
    borderRadius: "5px",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "bold",
    textDecoration: "none",
    textAlign: "center" as const,
    display: "block",
    padding: "10px",
  },

  heading: {
    fontSize: "24px",
    fontWeight: "bold",
    textAlign: "center" as const,
    margin: "30px 0",
  },

  logo: {
    margin: "0 auto",
  },
};
