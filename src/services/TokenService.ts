import "dotenv/config";
import { Now } from "~/utils";
import jwt from "jsonwebtoken";

export const requestToken = (data, timeout?) => {
  return jwt.sign(
    {
      ...data,
      exp: toSeconds(timeout || import.meta.env.VITE_SESSION_TIMEOUT),
    },
    import.meta.env.VITE_SESSION_SECRET
  );
};

export const verifyToken = (token) => {
  return jwt.verify(token, process.env.SECRET);
};

export const toSeconds = (expireMinutes) => {
  return Math.floor(Now().valueOf() / 1000) + 60 * expireMinutes;
};

export const createLoginToken = (data) => {
  return jwt.sign({ ...data, exp: toSeconds(1000) }, process.env.SECRET);
};
