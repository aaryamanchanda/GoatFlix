import axios from "axios";

const API_KEY = "f80c9736e0eeda31350cd3af24b128bf";
const BASE = "https://api.themoviedb.org/3";

export const fetchTrending = async () => {
  const res = await axios.get(
    `${BASE}/trending/all/week?api_key=${API_KEY}`
  );
  return res.data.results;
};

export const fetchTV = async () => {
  const res = await axios.get(
    `${BASE}/trending/tv/week?api_key=${API_KEY}`
  );
  return res.data.results;
};

export const fetchPopular = async () => {
  const res = await axios.get(
    `${BASE}/movie/popular?api_key=${API_KEY}`
  );
  return res.data.results;
};

export const fetchTopRated = async () => {
  const res = await axios.get(
    `${BASE}/movie/top_rated?api_key=${API_KEY}`
  );
  return res.data.results;
};

export const fetchUpcoming = async () => {
  const res = await axios.get(
    `${BASE}/movie/upcoming?api_key=${API_KEY}`
  );
  return res.data.results;
};

export const fetchNowPlaying = async () => {
  const res = await axios.get(
    `${BASE}/movie/now_playing?api_key=${API_KEY}`
  );
  return res.data.results;
};

export const searchMulti = async (query) => {
  const res = await axios.get(
    `${BASE}/search/multi?api_key=${API_KEY}&query=${query}`
  );
  return res.data.results;
};

export const getDetails = async (type, id) => {
  const res = await axios.get(
    `${BASE}/${type}/${id}?api_key=${API_KEY}`
  );
  return res.data;
};