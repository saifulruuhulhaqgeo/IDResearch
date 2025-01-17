import * as jose from 'jose';

const getTokenPayload = () => {
  const token = localStorage.getItem('auth_token');
  if (token == null) {
    //window.location.href = '#/';
    return null;
  } else {
    const payload = jose.decodeJwt(token);
    return payload;
  }
};

export {getTokenPayload};
