import axios from "axios";
import { toast } from "react-toastify";

axios.interceptors.response.use(null, error => {
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;
  if (!expectedError) {
    console.log("Logging expected error", error);
    toast.error("An unexpected error occured");
  }
  return Promise.reject(error);
});

function setJwt(jwt) {
  // configure default header
  axios.defaults.headers.common["x-auth-token"] = jwt;
}

export default {
  post: axios.post,
  get: axios.get,
  put: axios.put,
  delete: axios.delete,
  setJwt
};
