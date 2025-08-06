"use server";

import prisma from "../lib/prismaDb";
import * as bcrypt from "bcrypt";

const generateRandomPassword = () => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = 6;
  const uniqueCharacters = [...Array.from(new Set(characters))];
  let result = "";
  for (let i = 0; i < charactersLength; i++) {
    const randomIdx = Math.floor(Math.random() * uniqueCharacters.length);
    result += uniqueCharacters[randomIdx];
  }
  return result;
};

export const addUserToDB = async (userData: any) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: userData.email,
    },
  });
  if (existingUser) {
    return existingUser;
  }

  const password = generateRandomPassword();
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      role: "User",
      phone_number: userData?.phone_number,
    },
  });

  return user;
};
