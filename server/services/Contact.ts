import { connectDB } from "@/server/db/connect";
import Contact, { IContact } from "@/server/models/Contact";
import { ServiceResponse } from "@/types";
import { AppError } from "@/utils/appError";

const create = async (
  data: Partial<IContact>
): Promise<ServiceResponse<IContact>> => {
  await connectDB();
  try {
    const contact = await Contact.create(data);
    return JSON.parse(JSON.stringify(contact));
  } catch {
    return new AppError("Failed to create contact");
  }
};

const getAll = async (
  ownerId: string
): Promise<ServiceResponse<IContact[]>> => {
  await connectDB();
  try {
    const contacts = await Contact.find({
      owner: ownerId,
      status: { $ne: "deleted" },
    })
      .sort({ createdAt: -1 })
      .lean();
    return JSON.parse(JSON.stringify(contacts));
  } catch {
    return new AppError("Failed to fetch contacts");
  }
};

const update = async (
  id: string,
  data: Partial<IContact>
): Promise<ServiceResponse<IContact>> => {
  await connectDB();
  try {
    const contact = await Contact.findByIdAndUpdate(id, data, { new: true });
    if (!contact) return new AppError("Contact not found");
    return JSON.parse(JSON.stringify(contact));
  } catch {
    return new AppError("Failed to update contact");
  }
};

const remove = async (id: string): Promise<ServiceResponse<boolean>> => {
  await connectDB();
  try {
    const contact = await Contact.findByIdAndUpdate(id, { status: "deleted" });
    if (!contact) return new AppError("Contact not found");
    return true;
  } catch {
    return new AppError("Failed to delete contact");
  }
};

export const ContactService = {
  create,
  getAll,
  update,
  delete: remove,
};
