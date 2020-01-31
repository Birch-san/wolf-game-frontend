import Axios from "axios";

export const apiClient = Axios.create({
  baseURL: '/api'
});
