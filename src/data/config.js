export const ApiConfig = {
    baseUrl: process.env.REACT_APP_API_URL,
    timeout: 120,
  };

export const shouldLogApi = process.env.REACT_APP_ENVIRONTMENT !== "production";