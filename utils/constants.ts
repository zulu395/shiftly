export const CONFIG = {
  website: {
    host: process.env.NEXT_PUBLIC_HOST ?? "",
    name: "Shiftly",
    address: "123 Main St, Anytown, USA",
    logoUrl: `${process.env.NEXT_PUBLIC_HOST}/images/logo.png`,
  },
  client: {
    host: process.env.NEXT_PUBLIC_HOST ?? "",
    successPaymentPath: "/payment/success",
    errorPaymentPath: "/payment/error",
  },
  colors: {
    primary: "#0179ff",
    primaryAlt: "#3895ffff",
  },
  adminEmails: `${process.env.ADMIN_EMAILS}`.split(","),
};
