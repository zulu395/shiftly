import { connectDB } from "@/server/db/connect";
import Conversation, { IConversation } from "@/server/models/Conversation";
import { ServiceResponse } from "@/types";
import { AppError } from "@/utils/appError";
import mongoose from "mongoose";

const create = async (
  participantIds: string[]
): Promise<ServiceResponse<IConversation>> => {
  await connectDB();
  try {
    // Sort to ensure unique finding regardless of order
    const sortedParticipants = participantIds.sort();

    // Check if conversation exists
    let conversation = await Conversation.findOne({
      participants: {
        $all: sortedParticipants,
        $size: sortedParticipants.length,
      },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: sortedParticipants.map(
          (id) => new mongoose.Types.ObjectId(id)
        ),
        unreadCounts: {},
      });
    }

    return JSON.parse(JSON.stringify(conversation));
  } catch (error) {
    console.error("Error creating conversation:", error);
    return new AppError("Failed to create conversation");
  }
};

const getAll = async (
  userId: string
): Promise<ServiceResponse<IConversation[]>> => {
  await connectDB();
  try {
    // const conversations = await Conversation.find({
    //   participants: userId,
    // });
    const conversations = await Conversation.find({
      participants: userId,
    })
      .populate("participants", "fullname email avatar") // Participants are Accounts directly
      .sort({ updatedAt: -1 }); // Most recent first

    return JSON.parse(JSON.stringify(conversations));
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return new AppError("Failed to fetch conversations");
  }
};

const updateLastMessage = async (
  conversationId: string,
  message: { content: string; senderId: string; timestamp: Date }
): Promise<ServiceResponse<IConversation>> => {
  await connectDB();
  try {
    const conversation = await Conversation.findByIdAndUpdate(
      conversationId,
      {
        $set: {
          lastMessage: {
            content: message.content,
            senderId: new mongoose.Types.ObjectId(message.senderId),
            timestamp: message.timestamp,
          },
        },
      },
      { new: true }
    );

    if (!conversation) return new AppError("Conversation not found");

    return JSON.parse(JSON.stringify(conversation));
  } catch (error) {
    console.error("Error updating last message:", error);
    return new AppError("Failed to update conversation");
  }
};

const getById = async (id: string): Promise<ServiceResponse<IConversation>> => {
  await connectDB();
  try {
    const conversation = await Conversation.findById(id)
      .populate("participants", "fullname email avatar")
      .lean();

    if (!conversation) return new AppError("Conversation not found");

    return JSON.parse(JSON.stringify(conversation));
  } catch (error) {
    console.error("Error fetching conversation:", error);
    return new AppError("Failed to fetch conversation");
  }
};

export const ConversationService = {
  create,
  getAll,
  getById,
  updateLastMessage,
};
