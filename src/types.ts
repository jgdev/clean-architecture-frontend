export type PaginatedParams = {
  limit?: number;
  skip?: number;
  searchParams?: any;
};

export type PaginatedResult<T> = PaginatedParams & {
  result: T[];
};

export type Operation = {
  id: string;
  type: string;
  name: string;
};

export type Record = {
  id: string;
  operationId: string;
  operationType: string;
  cost: number;
  operationArgs: any[];
  operationResult: any;
  date: Date;
  oldUserBalance: number;
  newUserBalance: number;
};

export type User = {
  email: string;
  balance: number;
};

export type FetchAction<T, K = any> = {
  loading: boolean;
  error?: any;
  result?: T | undefined;
  getAction: (options?: RequestInit & { querystring?: K }) => Promise<any>;
  postAction: (options?: RequestInit & { data?: K }) => Promise<any>;
  delAction: (options?: RequestInit & { data?: K }) => Promise<any>;
};

export type FetchResources<T> = FetchAction<
  PaginatedResult<T>,
  PaginatedParams
>;
