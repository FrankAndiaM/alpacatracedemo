import jwt_decode from 'jwt-decode';

const isExpired = () => {
  try {
    const valueToken = String(localStorage.getItem('token'));
    // every 30min the token is refreshed
    const token: any = jwt_decode(valueToken);
    if (token?.exp < Date.now() / 1000 + 3540) return true;
    return false;
  } catch (error) {
    return false;
  }
};

export { isExpired };
