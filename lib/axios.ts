import { API_URL } from "@/config/env";
import axios from "axios";

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json; charset=utf-8",
  }
});
