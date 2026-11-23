import { ProfileMenuUI } from '@ui';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from '@services/store';

import { logoutUser } from '@services/slices/userSlice';

export const ProfileMenu = (): React.JSX.Element => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = (): void => {
    void dispatch(logoutUser())
      .unwrap()
      .then(() => {
        navigate('/login', { replace: true });
      })
      .catch((err) => {
        console.warn('Logout warning:', err);
        navigate('/login', { replace: true });
      });
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
