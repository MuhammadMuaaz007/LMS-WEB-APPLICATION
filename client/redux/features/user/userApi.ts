import { apiSlice } from "../api/apiSlice";

const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    updateAvatar: builder.mutation({
      query: ({ avatar }) => ({
        url: "/update-user-avatar",
        method: "PUT",
        body: { avatar },
        credentials: "include" as const,
      }),
     
    }),
  }),
});

export const { useUpdateAvatarMutation } = userApi;
