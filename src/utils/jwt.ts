import jwt_decode from 'jwt-decode';

const isExpired = () => {
  try {
    const valueStore = JSON.parse(String(localStorage.getItem('state')));
    const {
      auth: { user }
    } = valueStore;

    // every 30min the token is refreshed
    const token: any = jwt_decode(user.accessToken);
    if (token?.exp < Date.now() / 1000 + 1800) return true;
    return false;
  } catch (error) {
    return false;
  }
};

export { isExpired };
