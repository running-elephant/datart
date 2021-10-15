import {
  DEFAULT_AUTHORIZATION_TOKEN_EXPIRATION,
  StorageKeys,
} from 'globalConstants';
import Cookies from 'js-cookie';

export function getToken() {
  return Cookies.get(StorageKeys.AuthorizationToken);
}

export function setToken(token: string, expires?: number) {
  Cookies.set(StorageKeys.AuthorizationToken, token, {
    expires: new Date(
      new Date().getTime() +
        (expires || DEFAULT_AUTHORIZATION_TOKEN_EXPIRATION),
    ),
  });
}

export function removeToken() {
  Cookies.remove(StorageKeys.AuthorizationToken);
}
