import { sign, verify } from "jsonwebtoken";
import { IAccount } from "../models/Account";
import bcrypt from "bcrypt";

const jwtSecret = process.env.JWT_SECRET ?? "secret";
const jwtMaxAge = Number(process.env.JWT_MAX_AGE ?? 259200);

async function generateToken(account: IAccount): Promise<string> {
  const expiresIn = jwtMaxAge;

  return sign(
    {
      email: account.email,
      _id: account._id,
      role: account.role,
    },
    jwtSecret,
    {
      expiresIn,
    }
  );
}

async function isTokenValid(
  token: string
): Promise<{ email: string; _id: string } | null> {
  let decoded: unknown, error: unknown;
  verify(token, jwtSecret, (err, _decoded) => {
    error = err;
    decoded = _decoded;
  });

  if (error) return null;
  return decoded as { email: string; _id: string };
}

async function hashPassword(pass: string) {
  return await bcrypt.hash(pass, 10);
}

async function comparePassword(pass: string, hash: string) {
  return await bcrypt.compare(pass, hash);
}

export const SecurityService = {
  generateToken,
  isTokenValid,
  hashPassword,
  comparePassword,
};
