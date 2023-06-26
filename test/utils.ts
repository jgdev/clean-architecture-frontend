import { FetchResources, FetchAction } from "../src/types";
import { vi } from "vitest";

export const createFakeAction = <T>(initialValue?: any): FetchAction<T> => {
  const action = {
    loading: false,
    result: initialValue,
    error: undefined,
    getAction: vi.fn(async () => Promise.resolve()),
    delAction: vi.fn(async () => Promise.resolve()),
    postAction: vi.fn(async () => Promise.resolve()),
  };
  return action;
};

export const createFakeResources = <T>(): FetchResources<T> => {
  return createFakeAction<
    T & {
      skip: 0;
      limit: 0;
      result: [];
    }
  >();
};
