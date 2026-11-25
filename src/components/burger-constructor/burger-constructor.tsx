import { BurgerConstructorUI } from '@ui';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  selectConstructorItems,
  selectOrderRequest,
  selectOrderModalData,
} from '@services/slices/constructorSlice';
import { createOrderThunk } from '@services/slices/orderSlice';
import { selectIsLoggedIn } from '@services/slices/userSlice';
import { useDispatch, useSelector } from '@services/store';

import type { TConstructorIngredient } from '@utils-types';

export const BurgerConstructor = (): React.JSX.Element | null => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const constructorItems = useSelector(selectConstructorItems);
  const orderRequest = useSelector(selectOrderRequest);
  const orderModalData = useSelector(selectOrderModalData);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const { isAuthChecked } = useSelector((state) => state.user);

  const onOrderClick = (): void => {
    if (!isAuthChecked) return;

    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    if (!constructorItems.bun || orderRequest) return;

    void dispatch(createOrderThunk(constructorItems));
  };

  const closeOrderModal = (): void => {
    dispatch({ type: 'burgerConstructor/setOrderModalData', payload: null });
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
