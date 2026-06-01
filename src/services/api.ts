import axios from "axios";

/* =========================
   BASE URL
========================= */

export const BASE_URL =
  import.meta.env
    .VITE_API_URL ||
  "http://localhost:8000";

/* =========================
   AXIOS INSTANCE
========================= */

export const api =
  axios.create({
    baseURL: BASE_URL,

    headers: {
      "Content-Type":
        "application/json",
    },

    timeout: 15000,
  });

/* =========================
   REQUEST INTERCEPTOR
========================= */

api.interceptors.request.use(
  (config) => {
    console.log(
      `[API REQUEST] ${config.method?.toUpperCase()} ${config.url}`
    );

    return config;
  },

  (error) => {
    console.error(
      "[REQUEST ERROR]",
      error
    );

    return Promise.reject(
      error
    );
  }
);

/* =========================
   RESPONSE INTERCEPTOR
========================= */

api.interceptors.response.use(
  (response) => {
    console.log(
      `[API RESPONSE] ${response.status} ${response.config.url}`
    );

    return response;
  },

  (error) => {
    /* =========================
       SERVER ERROR
    ========================= */

    if (
      error.response
    ) {
      console.error(
        "[API SERVER ERROR]",
        {
          status:
            error.response
              .status,

          data:
            error.response
              .data,
        }
      );
    }

    /* =========================
       NETWORK ERROR
    ========================= */

    else if (
      error.request
    ) {
      console.error(
        "[NETWORK ERROR]",
        "Backend tidak merespons."
      );
    }

    /* =========================
       UNKNOWN ERROR
    ========================= */

    else {
      console.error(
        "[UNKNOWN ERROR]",
        error.message
      );
    }

    return Promise.reject(
      error
    );
  }
);

/* =========================
   FUTURE READY NOTES
========================= */

/*
  NEXT IMPROVEMENTS:

  - JWT Authentication
  - Refresh Token
  - Retry Request
  - Global Error Toast
  - Request Cancellation
  - API Logger
  - Multi Environment

  ==================================

  ENV FILE:

  .env

  VITE_API_URL=http://localhost:8000

  ==================================

  PRODUCTION:

  VITE_API_URL=https://api.domain.com
*/