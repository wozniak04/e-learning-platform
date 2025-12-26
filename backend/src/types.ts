export interface login_with_google {
  id: number;
  login: string;
  email: string;
  google_id: string;
}
export interface register_result {
  succes: boolean;
  message: string;
}
export interface login_result {
  id: number;
  login: string;
  email: string;
}
