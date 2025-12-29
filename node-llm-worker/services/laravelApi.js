import axios from "axios";

const API = process.env.LARAVEL_API;

export const getLatestArticle = async () => {
  const res = await axios.get(`${API}/articles/latest`);
  return res.data;
};

export const publishArticle = async (data) => {
  await axios.post(`${API}/articles`, data);
};
