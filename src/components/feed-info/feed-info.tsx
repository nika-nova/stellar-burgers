import { FeedInfoUI } from '@ui';

import { useSelector } from '@services/store';

import type { TOrder } from '@utils-types';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo = (): React.JSX.Element => {
  const orders = useSelector((state) => state.feed.orders);
  const total = useSelector((state): number => state.feed.total);
  const totalToday = useSelector((state): number => state.feed.totalToday);
  const isLoading = useSelector((state): boolean => state.feed.isLoading);
  const error = useSelector((state): string | null => state.feed.error);

  const feed = {
    orders,
    total,
    totalToday,
    isLoading,
    error,
  };

  const readyOrders = getOrders(orders, 'done');

  const pendingOrders = getOrders(orders, 'pending');

  return (
    <FeedInfoUI readyOrders={readyOrders} pendingOrders={pendingOrders} feed={feed} />
  );
};
