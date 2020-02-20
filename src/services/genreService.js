import { apiUrl } from "../config.json";
import http from "./httpService";
import { toast } from "react-toastify";

export async function getGenres() {
  try {
    const response = await http.get(apiUrl + "/genres");
    return response.data;
  } catch {
    toast.error("Unable to retrive genres from the server. ");
  }
}

export const genres = () => getGenres();
