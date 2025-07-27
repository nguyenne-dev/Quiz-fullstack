import { del, get, post, put } from "../utils/request"

export const getTopic = async () => {
  const result = await get("topic");
  return result;
}

export const createTopic = async (option) => {
  const result = await post("topic", option);
  return result;
}

export const putTopic = async (id, option) => {
  const result = await put(`topic/${id}`, option);
  return result;
}

export const delTopic = async (id) => {
  const result = await del(`topic/${id}`);
  return result;
}