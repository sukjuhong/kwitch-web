import { SERVER_URL } from "@/utils/env";
import axios from "axios";

export const api = axios.create({
  baseURL: SERVER_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json; charset=utf-8",
  },
});
