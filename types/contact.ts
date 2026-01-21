export type Contact = {
  _id: string;
  createdAt: string;
  updatedAt: string;
  fullname: string;
  email: string;
  phone: string;
  jobTitle: string;
  company: string;
  linkedin: string;
  timezone: string;
};

export const dummyContacts: Contact[] = [
  {
    _id: "64a1f2b3c4d5e6f701234567",
    createdAt: "2024-01-10T09:15:00.000Z",
    updatedAt: "2024-06-01T12:00:00.000Z",
    fullname: "Ava Thompson",
    email: "ava.thompson@example.com",
    phone: "+1-415-555-0132",
    jobTitle: "Product Manager",
    company: "Beacon Labs",
    linkedin: "https://www.linkedin.com/in/ava-thompson",
    timezone: "America/Los_Angeles",
  },
  {
    _id: "64a1f2b3c4d5e6f701234568",
    createdAt: "2023-11-02T14:30:00.000Z",
    updatedAt: "2024-05-20T08:45:00.000Z",
    fullname: "Liam Rivera",
    email: "liam.rivera@example.com",
    phone: "+1-212-555-0178",
    jobTitle: "Software Engineer",
    company: "BlueArc Solutions",
    linkedin: "https://www.linkedin.com/in/liam-rivera",
    timezone: "America/New_York",
  },
  {
    _id: "64a1f2b3c4d5e6f701234569",
    createdAt: "2022-07-18T07:05:00.000Z",
    updatedAt: "2024-04-11T10:20:00.000Z",
    fullname: "Sophie Laurent",
    email: "sophie.laurent@example.com",
    phone: "+44-20-7946-0958",
    jobTitle: "UX Designer",
    company: "Northbridge Creative",
    linkedin: "https://www.linkedin.com/in/sophie-laurent",
    timezone: "Europe/London",
  },
  {
    _id: "64a1f2b3c4d5e6f70123456a",
    createdAt: "2024-03-05T16:45:00.000Z",
    updatedAt: "2024-06-05T09:10:00.000Z",
    fullname: "Jonas Müller",
    email: "jonas.mueller@example.com",
    phone: "+49-30-5555-0123",
    jobTitle: "Data Scientist",
    company: "Quantify GmbH",
    linkedin: "https://www.linkedin.com/in/jonas-mueller",
    timezone: "Europe/Berlin",
  },
  {
    _id: "64a1f2b3c4d5e6f70123456b",
    createdAt: "2023-09-12T22:00:00.000Z",
    updatedAt: "2024-02-28T11:30:00.000Z",
    fullname: "Yuki Tanaka",
    email: "yuki.tanaka@example.com",
    phone: "+81-3-5555-0011",
    jobTitle: "Operations Lead",
    company: "Horizon Works",
    linkedin: "https://www.linkedin.com/in/yuki-tanaka",
    timezone: "Asia/Tokyo",
  },
  {
    _id: "64a1f2b3c4d5e6f70123456c",
    createdAt: "2024-05-01T05:25:00.000Z",
    updatedAt: "2024-06-10T14:55:00.000Z",
    fullname: "Maya Clarke",
    email: "maya.clarke@example.com",
    phone: "+61-2-5550-3344",
    jobTitle: "Customer Success Manager",
    company: "HarborTech",
    linkedin: "https://www.linkedin.com/in/maya-clarke",
    timezone: "Australia/Sydney",
  },
];
