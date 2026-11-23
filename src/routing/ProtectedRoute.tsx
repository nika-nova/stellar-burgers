import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '@services/store';
import type { RootState } from '@services/store';

type ProtectionMode = 'public' | 'private';

interface ProtectedRouteProps {
  children: React.ReactNode;
  mode?: ProtectionMode;
}

export const ProtectedRoute = ({
  children,
  mode = 'private',
}: ProtectedRouteProps): React.JSX.Element => {
  const { user, isAuthChecked } = useSelector((state: RootState) => state.user);
  const location = useLocation();
  const isLoggedIn = !!user;

  if (!isAuthChecked) {
    return <></>;
  }

  if (mode === 'private') {
    if (!isLoggedIn) {
      return (
        <Navigate
          to="/login"
          state={{ from: location }}
          replace
        />
      );
    }
    return <>{children}</>;
  }

  return <>{children}</>;
};
