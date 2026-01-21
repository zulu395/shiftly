import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMessage extends Document {
  conversation: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  content: string;
  readBy: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema: Schema<IMessage> = new Schema(
  {
    conversation: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    readBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "Account",
      },
    ],
  },
  {
    timestamps: true,
  }
);

MessageSchema.index({ conversation: 1, createdAt: 1 });

const Message: Model<IMessage> =
  mongoose.models.Message || mongoose.model<IMessage>("Message", MessageSchema);

export default Message;
