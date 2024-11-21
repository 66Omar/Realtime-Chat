import { baseURL } from "@/src/utils/constants";
import axios from "axios";

const API_URL = baseURL + "/api/";

export const axiosInstance = axios.create({
  baseURL: API_URL,
});
