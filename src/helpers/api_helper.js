import axios from "axios"

//pass new generated access token here
// const token = accessToken

//apply base url for axios
const API_URL = process.env.REACT_APP_URL

const axiosApi = axios.create({
  baseURL: API_URL,
})
axiosApi.interceptors.request.use(config => {
  const authUser = localStorage.getItem("authUser")
  if (authUser) {
    const token = JSON.parse(authUser)
    config.headers["Authorization"] = `Bearer ${token}`
  } else {
    config.headers["Authorization"] = 0
  }
  return config
})
// axiosApi.defaults.headers.common["Authorization"] = `Bearer ${obj}`
// `Bearer ${obj}`
axiosApi.interceptors.response.use(
  response => response,
  error => Promise.reject(error)
)

export async function get(url, config = {}) {
  return await axiosApi.get(url, { ...config }).then(response => response.data)
  
}

export async function post(url, data, config = {}) {
  

  return axiosApi
    .post(url, { ...data }, { ...config })
    .then(response => response.data)
}

export async function put(url, data, config = {}) {
  return axiosApi
    .put(url, { ...data }, { ...config })
    .then(response => response.data)
}

export async function del(url, config = {}) {
  return await axiosApi
    .delete(url, { ...config })
    .then(response => response.data)
}
