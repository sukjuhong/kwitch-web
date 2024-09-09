
interface FailedSocketResponse {
  error: string;
}

interface SuccessSocketResponse {
  content: any;
}

export type SocketResponse = FailedSocketResponse | SuccessSocketResponse;

export function isFailedSocketResponse(response: SocketResponse): response is FailedSocketResponse {
  return (response as FailedSocketResponse).error !== undefined;
}