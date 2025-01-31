// DOCS : https://redux-toolkit.js.org/rtk-query/usage-with-typescript
// DOCS : https://jsonplaceholder.typicode.com

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

/**
 * Base API URL
 */
const baseUrl: string = `https://api.watchtower.gohq.in/api`;

/**
 * User
 */
export type User = {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
};

/**
 * Get Users API Response
 */
type UsersResponse = User[];

/**
 * Get User By ID API Response
 */
type UserResponse = User;

/**
 * Users API
 */
export const usersApi = createApi({
  reducerPath: "usersApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
  }),
  tagTypes: ["ActionItems"],
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => ({
        url: "/users",
        responseHandler: async (res: Response) => await res.json(),
      }),
      transformResponse: (res: UsersResponse) => res,
    }),
    getUserById: builder.query({
      query: (id: number | string) => ({
        url: `/users/${id}`,
        responseHandler: async (res: Response) => await res.json(),
      }),
      transformResponse: (res: UserResponse) => res,
    }),
    ticketCount: builder.query({
      query: () => ({
        url: `/tickets/counts`,
        responseHandler: async (res: any) => await res.json(),
      }),
      transformResponse: (res: any) => res,
    }),
    getInsights: builder.query({
      query: () => ({
        url: `/insights`,
        responseHandler: async (res: any) => await res.json(),
      }),
      transformResponse: (res: any) => res,
    }),
    getActionItems: builder.query({
      query: (item: string) => ({
        url: `/action-items?actionItemStatus=${item}`,
        responseHandler: async (res: any) => await res.json(),
      }),
      transformResponse: (res: any) => res,
      providesTags: ["ActionItems"],
    }),
    updateActionItems: builder.mutation({
      query: (actionItemId: string) => ({
        url: `/action-items/${actionItemId}`,
        method: "PUT",
        responseHandler: async (res: any) => await res.json(),
      }),
      transformResponse: (res: any) => res,
      invalidatesTags: ["ActionItems"],
    }),
    deleteActionItems: builder.mutation({
      query: (actionItemId: string) => ({
        url: `/action-items/${actionItemId}`,
        method: "DELETE",
        responseHandler: async (res: any) => await res.json(),
      }),
      transformResponse: (res: any) => res,
      invalidatesTags: ["ActionItems"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useTicketCountQuery,
  useGetInsightsQuery,
  useGetActionItemsQuery,
  useUpdateActionItemsMutation,
  useDeleteActionItemsMutation,
} = usersApi;
