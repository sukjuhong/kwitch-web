import { API_URL } from "@/config/env";
import returnFetch from "return-fetch";

export const rFetch = returnFetch({
  baseUrl: API_URL,
  headers: {
    Accept: "application/json",
  },
});
