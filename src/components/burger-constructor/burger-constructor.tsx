import { BurgerConstructorUI } from '@ui';
import { useMemo } from 'react';
import type { RootState } from '@services/store';

import { createSelector } from '@reduxjs/toolkit';

import { useDispatch, useSelector } from '@services/store';

import {
  setOrderRequest,
  setOrderModalData,
} from '@services/slices/constructorSlice';

import { createOrderThunk } from '@services/slices/orderSlice';

import type { TConstructorIngredient, TOrder } from '@utils-types';

const selectBun = (state: RootState) => state.burgerConstructor.bun;
const selectIngredients = (state: RootState) => state.burgerConstructor.ingredients;

export const selectConstructorItems = createSelector(
  [selectBun, selectIngredients],
  (bun, ingredients) => ({ bun, ingredients })
);
const selectOrderRequest = (state: RootState): boolean => state.burgerConstructor.orderRequest;
const selectOrderModalData = (state: RootState): TOrder | null => state.burgerConstructor.orderModalData;

export const BurgerConstructor = (): React.JSX.Element | null => {
  const dispatch = useDispatch();

  const constructorItems = useSelector(selectConstructorItems);
  const orderRequest = useSelector(selectOrderRequest);
  const orderModalData = useSelector(selectOrderModalData);

  const onOrderClick = (): void => {
    if (!constructorItems.bun || orderRequest) return;

    dispatch(setOrderRequest(true));
    void dispatch(createOrderThunk(constructorItems))
      .unwrap()
      .then((order) => {
        dispatch(setOrderModalData(order));
      })
      .catch(() => {
        dispatch(setOrderRequest(false));
      });
  };

  const closeOrderModal = (): void => {
    dispatch(setOrderModalData(null));
    dispatch(setOrderRequest(false));
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
