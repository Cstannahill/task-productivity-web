import axios from "axios";

const fileUrl = process.env.REACT_APP_API_HOST + "/files";

const uploadFile = (files) => {
  const config = {
    method: "POST",
    url: fileUrl,
    crossDomain: true,
    withCredentials: true,
    headers: { "Content-Type": "multipart/form-data" },
    data: files,
  };
  return axios(config).then((response) => response);
};

export default uploadFile;
