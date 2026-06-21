import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./features/api/apiSlice";
import authSlice from "./features/auth/authSlice";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authSlice,
  },
  devTools: false,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

// store.ts or appInitializer.ts

const initializeApp = async () => {
  try {
    // 1. Attempt to refresh the access token using the HTTP-only refresh cookie
    await store.dispatch(
      apiSlice.endpoints.refreshToken.initiate(undefined, {
        forceRefetch: true,
      }),
    );

    // 2. Fetch the user profile now that a fresh access token is in play
    await store.dispatch(
      apiSlice.endpoints.loadUser.initiate(undefined, { forceRefetch: true }),
    );
  } catch (error) {
    console.error("Failed to hydrate authentication session:", error);
  }
};

initializeApp();

