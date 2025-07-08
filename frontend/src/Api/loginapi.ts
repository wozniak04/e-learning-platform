function login(email: string, password: string) {
  if (email != null && password != null) {
    return true;
  } else {
    return false;
  }
}
export default login;
