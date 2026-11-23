import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';

import { useEffect } from 'react';
import { useDispatch, useSelector } from '@services/store';

import type { TOrder } from '@utils-types';
import { fetchFeed } from '@services/slices/feedSlice';
import type { RootState } from '@services/store';

export const Feed = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector((state: RootState) => state.feed?.orders ?? []);
  const isLoading = useSelector((state: RootState) => state.feed.isLoading);

  useEffect(() => {
    void dispatch(fetchFeed());
  }, [dispatch]);

  const handleGetFeeds = (): void => {
    void dispatch(fetchFeed());
  };

  if (isLoading || !orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
