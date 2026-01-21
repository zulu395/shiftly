import { AppError } from "@/utils/appError";

export type ServiceResponse<T = unknown, E = AppError> = T | E;

export type Paginated<T = unknown> = {
  items: T[];
  hasPreviousPage: boolean;
  previousPages: number;
  hasNextPage: boolean;
  nextPages: number;
  totalPages: number;
  totalDocuments: number;
  currentPage: number;
};

export type BaseQueryParams = {
  /** Page number
   * @default 1
   */
  page?: number | string;
  /** Search query
   * @default ""
   */
  q?: string;
  /** Limit
   * @default 20
   */
  limit?: number | string;
};

export type ApiResponse<T = unknown> = {
  /** Status code
   * @type number
   */
  status: number;
  /** Message */
  message: string;
  /** Response data */
  data: T;
  /** Field errors (error in form fields, if any)
   *  where key is the field name
   * @example {
   *   "email": ["Email is required"],
   *   "password": ["Password is required"]
   * }
   * @type Record<string, string[]>
   */
  fieldErrors?: Record<string, string[]>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ANY = any;

export type ActionResponse<T = unknown> = {
  error?: string;
  success?: string;
  data?: T;
  fieldErrors?: Record<string, string[]>;
};
export type AppLayoutProps = Readonly<{ children: React.ReactNode }>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AppPageProps<T = any, K = unknown> = {
  params?: Promise<T>;
  searchParams?: Promise<K>;
};

export type AppPageError = {
  error: Error & { digest?: string };
  reset: () => void;
};

export type PaginatedOrArrayAction<T = unknown> = (
  ...props: ANY
) => Promise<(Paginated<T> | T[]) | Error>;
