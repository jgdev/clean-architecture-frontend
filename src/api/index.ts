import { User, Record, Operation, ReqParams } from "../types";
import { createFetchAction, createFetchResourcesAction } from "../utils/api";

export const user = createFetchAction<User>("/v1/profile", undefined, {
  response: ({ user }) => user,
});
export const records = createFetchResourcesAction<Record>("/v1/records");
export const operations =
  createFetchResourcesAction<Operation>("/v1/operations");
export const authSession = createFetchAction<
  string,
  { email: string; password: string }
>("/v1/auth/sign-in", window.localStorage.getItem("auth-session-id") || "");

export const deleteRecord = createFetchAction<void>(
  "/v1/records/:recordId",
  undefined,
  {
    url: (url: string, options?: ReqParams<{ recordId: string }>) =>
      url.replace(":recordId", options?.params.recordId),
  }
);

export const authLogout = createFetchAction<void>("/v1/auth/sign-out");
