import { del, get, patch, post } from "../utils/request";

export const getQuestion = async () => {
  const result = await get("question/all");
  return result;
}

export const getQuestionTopic = async (topicId) => {
  const result = await get(`question/${topicId}`);
  return result;
}

export const postQuestion = async (option) => {
  const result = await post(`question`, option);
  return result;
}

export const patchQuestion = async (id, option) => {
  const result = await patch(`question/${id}`, option);
  return result;
}

export const deleteQuestion = async (id) => {
  const result = await del(`question/${id}`)
  return result;
}