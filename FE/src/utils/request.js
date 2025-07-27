"use client"
const API_DOMAIN = "http://localhost:3002/";
const getToken = () => {
  const cookieString = document.cookie;
  const cookies = cookieString.split("; ").reduce((acc, current) => {
    const [key, value] = current.split("=");
    acc[key] = value;
    return acc;
  }, {});
  return cookies.token;
};

export const get = async (path) => {
  const token = getToken();
  const response = await fetch(API_DOMAIN + path, {
    headers: { Authorization: `Bearer ${token}` }
  });

  const result = await response.json();
  return result;
}

export const post = async (path, option) => {
  const token = getToken();
  const response = await fetch(API_DOMAIN + path, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(option)
  });
  const result = await response.json();
  return result;
}

export const postPublic = async (path, option) => {
  const response = await fetch(API_DOMAIN + path, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
    },
    body: JSON.stringify(option)
  });
  const result = await response.json();
  return result;
}

export const getPublic = async (path) => {
  const response = await fetch(API_DOMAIN + path);

  const result = await response.json();
  return result;
}

export const put = async (path, option) => {
  const token = getToken();
  const response = await fetch(API_DOMAIN + path, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(option)
  });
  const result = await response.json();
  return result;
}

export const patch = async (path, option) => {
  const token = getToken();
  const response = await fetch(API_DOMAIN + path, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(option)
  });
  const result = await response.json();
  return result;
}

export const del = async (path) => {
  const token = getToken();
  const response = await fetch(`${API_DOMAIN}${path}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    },
  });
  const result = await response.json();
  return result;
}