import Axios from "axios";

export const apiClient = Axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_CONTEXT_ROOT || ''}/api`,
});
