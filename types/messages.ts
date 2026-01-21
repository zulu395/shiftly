export type User = {
  _id: string;
  name: string;
  avatar: string;
  status: "online" | "offline" | "away";
};

export type Message = {
  _id: string;
  senderId: string;
  content: string;
  timestamp: string; // ISO string
  read: boolean;
};

export type Conversation = {
  _id: string;
  otherUser: User;
  lastMessage?: Message;
  unreadCount: number;
  messages: Message[];
};

export const DUMMY_USERS: User[] = [
  {
    _id: "user1",
    name: "Ikechukwu Osuji",
    avatar: "https://i.pravatar.cc/150?u=user1",
    status: "online",
  },
  {
    _id: "user2",
    name: "Izuchukwu Nwankwo",
    avatar: "https://i.pravatar.cc/150?u=user2",
    status: "offline",
  },
  {
    _id: "user3",
    name: "John Doe",
    avatar: "https://i.pravatar.cc/150?u=user3",
    status: "away",
  },
];

export const DUMMY_CONVERSATIONS: Conversation[] = [
  {
    _id: "conv1",
    otherUser: DUMMY_USERS[0],
    unreadCount: 2,
    messages: [
      {
        _id: "m1",
        senderId: "user1",
        content: "Hey, can you toggle my shift tomorrow?",
        timestamp: "2025-12-30T10:00:00Z",
        read: true,
      },
      {
        _id: "m2",
        senderId: "me",
        content: "Sure, let me check the schedule.",
        timestamp: "2025-12-30T10:05:00Z",
        read: true,
      },
      {
        _id: "m3",
        senderId: "user1",
        content: "Thanks! I appreciate it.",
        timestamp: "2025-12-30T10:06:00Z",
        read: false,
      },
      {
        _id: "m4",
        senderId: "user1",
        content: "Just let me know when it's done.",
        timestamp: "2025-12-30T10:06:30Z",
        read: false,
      },
    ],
    lastMessage: {
      _id: "m4",
      senderId: "user1",
      content: "Just let me know when it's done.",
      timestamp: "2025-12-30T10:06:30Z",
      read: false,
    },
  },
  {
    _id: "conv2",
    otherUser: DUMMY_USERS[1],
    unreadCount: 0,
    messages: [
      {
        _id: "m5",
        senderId: "me",
        content: "Did you finish the report?",
        timestamp: "2025-12-29T14:30:00Z",
        read: true,
      },
      {
        _id: "m6",
        senderId: "user2",
        content: "Yes, I sent it over email.",
        timestamp: "2025-12-29T14:45:00Z",
        read: true,
      },
    ],
    lastMessage: {
      _id: "m6",
      senderId: "user2",
      content: "Yes, I sent it over email.",
      timestamp: "2025-12-29T14:45:00Z",
      read: true,
    },
  },
  {
    _id: "conv3",
    otherUser: DUMMY_USERS[2],
    unreadCount: 0,
    messages: [],
    lastMessage: undefined,
  },
];
