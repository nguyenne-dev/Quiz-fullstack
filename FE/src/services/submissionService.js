import { get, post } from "../utils/request"

export const getSubmission = async () => {
  const result = await get("submission");
  return result;
}

export const createSubmission = async (option) => {
  const result = await post("submission", option);
  return result;
}