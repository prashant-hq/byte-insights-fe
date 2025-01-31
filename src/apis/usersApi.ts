// DOCS : https://redux-toolkit.js.org/rtk-query/usage-with-typescript
// DOCS : https://jsonplaceholder.typicode.com

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

/**
 * Base API URL
 */
const baseUrl: string = `https://api.watchtower.gohq.in/api/`;

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
      query: () => ({
        url: `/action-items?actionItemStatus=CREATED`,
        responseHandler: async (res: any) => await res.json(),
      }),
      transformResponse: (res: any) => res,
    }),
    getInsightFromPrompt: builder.query({
      query: (prompt) => ({
        url: 'rag/insight',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': 'connect.sid=s%3AT8eUzCetQj_R_cWwF3O_JdgWLjMNvkj-.rNHeeitvwTJhHuzO9JXJweLUHd5DYdYuofyBchKQ%2Fj0', // Your Cookie
        },
        body: JSON.stringify({ prompt }),
        responseHandler: async (res) => await res.json(), 
      }),
      transformResponse: (res) => res, 
    })
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useTicketCountQuery,
  useGetInsightsQuery,
  useGetActionItemsQuery,
  useGetInsightFromPromptQuery
} = usersApi;
