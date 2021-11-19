import { AuthorizedRoute } from 'app/components';
import { getToken } from 'utils/auth';
import { LazyMainPage } from './pages/MainPage/Loadable';

export function LoginAuthRoute() {
  const logged = !!getToken();
  return (
    <AuthorizedRoute
      authority={logged}
      routeProps={{ path: '/', component: LazyMainPage }}
      redirectProps={{ to: '/login' }}
    />
  );
}
