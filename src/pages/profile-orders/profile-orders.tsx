import { ProfileOrdersUI } from '@ui-pages';

import type { TOrder } from '@utils-types';

import { useSelector } from 'react-redux';

import type { RootState } from '@/services/store';

export const ProfileOrders = (): React.JSX.Element => {
  const orders = useSelector((state: RootState): TOrder[] => {
    const list = Object.values(state.orders.items);
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  });

  return <ProfileOrdersUI orders={orders} />;
};
