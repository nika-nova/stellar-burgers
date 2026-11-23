import { ProfileUI } from '@ui-pages';
import { type SyntheticEvent, useEffect, useState } from 'react';

import { useDispatch, useSelector } from '@services/store';
import { updateUser } from '@services/slices/userSlice';
import type { TRegisterData } from '@api';

import type { RootState } from '@services/store';
import type { TUser } from '@utils-types';

export const Profile = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user) as TUser | null;

  const [formValue, setFormValue] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    password: '',
  });

  useEffect(() => {
    setFormValue((prevState) => ({
      ...prevState,
      name: user?.name ?? '',
      email: user?.email ?? '',
    }));
  }, [user]);

  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    if (!formValue.email || !formValue.name) return;

    const payload: Partial<TRegisterData> = {
      name: formValue.name,
      email: formValue.email,
    };

    if (formValue.password) {
      payload.password = formValue.password;
    }

    void dispatch(updateUser(payload))
      .unwrap()
      .then(() => {
        setFormValue((prev) => ({ ...prev, password: '' }));
      })
      .catch((err) => {
        console.error('Ошибка обновления профиля:', err);
      });
  };

  const handleCancel = (e: SyntheticEvent): void => {
    e.preventDefault();
    setFormValue({
      name: user?.name ?? '',
      email: user?.email ?? '',
      password: '',
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
