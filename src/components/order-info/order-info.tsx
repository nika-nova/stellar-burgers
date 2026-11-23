import { Preloader, OrderInfoUI } from '@ui';
import { useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from '@services/store';
import { useParams } from 'react-router-dom';

import type { RootState } from '@/services/store';
import type { TIngredient, TOrder } from '@utils-types';

import { selectIngredients } from '@services/slices/ingredientsSlice';
import { fetchOrderByNumber } from '@services/slices/orderSlice';

export const OrderInfo = (): React.JSX.Element => {
  const { number } = useParams<{ number: string }>();
  const dispatch = useDispatch();

  const orderNumberStr = String(number);
  const orderNumberNum = Number(number);

  const orderData = useSelector((state: RootState): TOrder | null | undefined => {
    const feedOrder = state.feed.orders?.find((item) => item.number === orderNumberNum);
    if (feedOrder) return feedOrder;

    const userOrder = state.feed.userOrders?.find((item) => item.number === orderNumberNum);
    if (userOrder) return userOrder;

    return null;
  });

  const ingredients: TIngredient[] = useSelector(selectIngredients);

  useEffect(() => {
    if (!orderData) {
      void dispatch(fetchOrderByNumber(orderNumberStr));
    }
  }, [orderData, orderNumberStr, dispatch]);

  if (!number || !orderData || ingredients.length === 0) {
    return <Preloader />;
  }

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = Record<string, TIngredient & { count: number }>;

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1,
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {} as TIngredientsWithCount
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total,
    };
  }, [orderData, ingredients]);

  return <OrderInfoUI orderInfo={orderInfo}/>;
};
