import { Preloader } from '@ui';
import { Navigate, useLocation } from 'react-router-dom';

import { selectIsLoggedIn } from '@services/slices/userSlice';
import { useSelector } from '@services/store';

type ProtectionMode = 'public' | 'private';

type ProtectedRouteProps = {
  children: React.ReactNode;
  mode?: ProtectionMode;
};

export const ProtectedRoute = ({
  children,
  mode = 'private',
}: ProtectedRouteProps): React.JSX.Element => {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const { isAuthChecked } = useSelector((state) => state.user);
  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (mode === 'private') {
    if (!isLoggedIn) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    return <>{children}</>;
  }

  if (isLoggedIn) {
    const from = (location.state as { from?: { pathname: string } })?.from?.pathname;

    const publicPaths = ['/login', '/register', '/forgot-password'];

    if (from && !publicPaths.includes(from)) {
      return <Navigate to={from} replace />;
    }

    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
