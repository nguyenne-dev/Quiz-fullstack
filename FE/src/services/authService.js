import { get, getPublic, patch, postPublic } from "../utils/request"

export const UserLogin = async (option) => {
  const result = postPublic("auth/login", option);
  return result;
}

export const send_verify_mail = async (option) => {
  const result = postPublic("auth/send-verify-mail", option);
  return result;
}

export const verify = async (token) => {
  const result = await getPublic(`auth/verify?token=${token}`);
  return result;
}

export const check = async (option) => {
  const result = await put("auth/check", option);
  return result;
}

export const getMe = async () => {
  const result = await get("auth/me");
  return result;
}

export const updateInfo = async (option) => {
  const result = await patch("auth/me", option);
  return result;
}

export const send_repass_email = async (option) => {
  const result = await postPublic("auth/send-repass-email", option)
  return result;
}

export const reset_password = async (token, option) => {
  const result = await postPublic(`auth/reset-password?token=${token}`, option);
  return result;
}

export const getAllUser = async () => {
  const result = await get("auth/alluser");
  return result;
}

export const status = async (id, option) => {
  const result = await patch(`auth/status/${id}`, option);
  return result;
}

export const role = async (id, option) => {
  const result = await patch(`auth/role/${id}`, option);
  return result;
}
