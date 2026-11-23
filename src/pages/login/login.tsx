import { LoginUI } from '@ui-pages';
import { type SyntheticEvent, useState } from 'react';
import { useDispatch } from '@services/store';
import { useLocation, useNavigate } from 'react-router-dom';

import { loginUser } from '@services/slices/userSlice';

export const Login = (): React.JSX.Element => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [errorText, setErrorText] = useState<string | null>(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/';

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    setErrorText(null);

    if (!email || !password) return;

    void dispatch(loginUser({ email, password }))
      .unwrap()
      .then(() => {
        navigate(from, { replace: true });
      })
      .catch((err) => {
        let message = 'Неверный логин или пароль. Проверьте данные и попробуйте снова.';

        if (err instanceof Error && 'data' in err && typeof err.data === 'object') {
          const data = err.data as { success?: boolean; message?: string };
          if (data.message) {
            message = data.message;
          }
        } else if (typeof err === 'string') {
          message = err;
        }

        setErrorText(message);
      });
  };

  return (
    <LoginUI
      errorText={errorText ?? ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
