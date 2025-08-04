// API Configuration
export const API_CONFIG = {
  BASE_URL: "https://fantastic-disco-wjwv555r4qg35w5x-3000.app.github.dev/api/v1",
  TIMEOUT: 10000,
}

// Environment-specific configurations
export const getApiConfig = () => {
  const env = process.env.NODE_ENV || "development"

  switch (env) {
    case "production":
      return {
        ...API_CONFIG,
        BASE_URL: "https://your-production-api.com/api/v1",
      }
    case "staging":
      return {
        ...API_CONFIG,
        BASE_URL: "https://your-staging-api.com/api/v1",
      }
    case "development":
    default:
      return {
        ...API_CONFIG,
        BASE_URL: "https://fantastic-disco-wjwv555r4qg35w5x-3000.app.github.dev/api/v1", // Local development
      }
  }
}
