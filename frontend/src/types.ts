export interface GoogleTokenPayload {
  iss: string;
  azp: string;
  aud: string;
  sub: string;
  exp: number;
  iat: number;
  email: string;
  email_verified: boolean;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
  locale: string;
}
