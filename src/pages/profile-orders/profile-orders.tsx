import { ProfileOrdersUI } from '@ui-pages';
import { useEffect } from 'react';

import { fetchUserOrders } from '@services/slices/feedSlice';
import { useDispatch, useSelector } from '@services/store';

export const ProfileOrders = (): React.JSX.Element => {
  const dispatch = useDispatch();

  const userOrders = useSelector((state) => state.feed.userOrders);

  useEffect(() => {
    void dispatch(fetchUserOrders());
  }, [dispatch]);

  return <ProfileOrdersUI orders={userOrders} />;
};
