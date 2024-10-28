import { userService } from "./user.service";

export const API_BASE_URL = "http://localhost:3000";

export class ApiService {
  protected getHeaders() {
    const currentUser = userService.currentUserValue;
    return {
      headers: {
        Authorization: `Bearer ${currentUser?.accessToken}`,
      },
    };
  }

  protected handleError(error: unknown, message: string): never {
    console.error(message, error);
    throw error;
  }
}
