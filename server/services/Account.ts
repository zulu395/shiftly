import { connectDB } from "@/server/db/connect";
import Account, { IAccount } from "@/server/models/Account";
import { ServiceResponse } from "@/types";
import { AppError } from "@/utils/appError";
import { SecurityService } from "./Security";

const createFromRegister = async (
  data: Partial<IAccount>
): Promise<ServiceResponse<IAccount>> => {
  await connectDB();

  const existingUser = await Account.findOne({ email: data.email });
  if (existingUser) {
    return new AppError("Email already in use", {
      errorCode: "EMAIL_EXISTS",
    });
  }

  const password = await SecurityService.hashPassword(data.password!);
  const newAccount = await Account.create({
    fullname: data.fullname,
    email: data.email,
    phone: data.phone,
    password: password,
    role: "company", // Default to company for registration flow usually, or derived
    hasOnboarded: false,
  });

  return newAccount;
};

const login = async (
  data: Partial<IAccount>
): Promise<ServiceResponse<IAccount>> => {
  await connectDB();

  const account = await Account.findOne({ email: data.email }).select(
    "+password"
  );
  if (!account) {
    return new AppError("Invalid email or password", {
      errorCode: "INVALID_CREDENTIALS",
    });
  }

  const isPasswordValid = await SecurityService.comparePassword(
    data.password!,
    account.password!
  );
  if (!isPasswordValid) {
    return new AppError("Invalid email or password", {
      errorCode: "INVALID_CREDENTIALS",
    });
  }

  return account;
};

async function getById(id: string): Promise<ServiceResponse<IAccount>> {
  await connectDB();
  const account = await Account.findById(id).lean();

  if (!account) {
    return new AppError("Account not found", {
      errorCode: "ACCOUNT_NOT_FOUND",
    });
  }

  return JSON.parse(JSON.stringify(account));
}

async function update(id: string, data: Partial<IAccount>) {
  const account = await Account.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

  if (!account) {
    return new AppError("Account not found", {
      errorCode: "ACCOUNT_NOT_FOUND",
    });
  }

  return account;
}

async function changePassword(id: string, data: { old: string; new: string }) {
  await connectDB();
  const account = await Account.findById(id).select("+password");

  if (!account) {
    return new AppError("Account not found");
  }

  const isPasswordValid = await SecurityService.comparePassword(
    data.old,
    account.password!
  );

  if (!isPasswordValid) {
    return new AppError("Invalid current password");
  }

  account.password = await SecurityService.hashPassword(data.new);
  await account.save();

  return true;
}

export const AccountService = {
  createFromRegister,
  login,
  getById,
  update,
  changePassword,
};
