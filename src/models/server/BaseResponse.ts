export type BaseResponse = {
  status: boolean;
  response: JSON;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type JSON = Record<string, any>;
