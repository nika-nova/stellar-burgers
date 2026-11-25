import { Preloader, OrderInfoUI } from '@ui';
import { useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { selectIngredients } from '@services/slices/ingredientsSlice';
import { fetchOrderByNumber } from '@services/slices/orderSlice';
import { useDispatch, useSelector } from '@services/store';

import type { TOrderInfo } from '@components/ui/order-info/type';
import type { TIngredient } from '@utils-types';

export const OrderInfo = (): React.JSX.Element => {
  const { number } = useParams<{ number: string }>();
  const dispatch = useDispatch();

  const orderNumberStr = String(number);
  const orderNumberNum = Number(number);

  const orderData = useSelector((state) => {
    const feedOrder = state.feed.orders?.find((item) => item.number === orderNumberNum);
    if (feedOrder) return feedOrder;

    const userOrder = state.feed.userOrders?.find(
      (item) => item.number === orderNumberNum
    );
    if (userOrder) return userOrder;

    const savedOrder = state.orders?.items[String(orderNumberNum)];
    if (savedOrder) return savedOrder;

    return null;
  });

  const ingredients: TIngredient[] = useSelector(selectIngredients);

  useEffect(() => {
    if (!orderData) {
      void dispatch(fetchOrderByNumber(orderNumberNum));
    }
  }, [orderData, orderNumberStr, dispatch]);

  /* Готовим данные для отображения */
  const orderInfo = useMemo((): TOrderInfo | null => {
    if (!orderData || !ingredients.length) {
      return null;
    }

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

  if (!number || !orderInfo) {
    return <Preloader />;
  }

  return (
    <>
      <OrderInfoUI orderInfo={orderInfo} />;
    </>
  );
};
