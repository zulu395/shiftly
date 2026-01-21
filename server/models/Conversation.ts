import mongoose, { Schema, Document, Model } from "mongoose";

export interface IConversation extends Document {
  participants: mongoose.Types.ObjectId[];
  lastMessage?: {
    content: string;
    senderId: mongoose.Types.ObjectId;
    timestamp: Date;
  };
  unreadCounts: Map<string, number>;
  createdAt: Date;
  updatedAt: Date;
}

const ConversationSchema: Schema<IConversation> = new Schema(
  {
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "Account",
      },
    ],
    lastMessage: {
      content: { type: String },
      senderId: { type: Schema.Types.ObjectId, ref: "Account" },
      timestamp: { type: Date },
    },
    // Map of user _id to unread count
    unreadCounts: {
      type: Map,
      of: Number,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

ConversationSchema.index({ participants: 1 });

const Conversation: Model<IConversation> =
  mongoose.models.Conversation ||
  mongoose.model<IConversation>("Conversation", ConversationSchema);

export default Conversation;
