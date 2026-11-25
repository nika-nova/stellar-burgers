import { getOrderByNumberApi, orderBurgerApi } from '@api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import type { TOrder, TConstructorState } from '@utils-types';

type TOrdersState = {
  items: Record<string, TOrder>;
  isLoading: boolean;
  error: string | null;
};

const initialState: TOrdersState = {
  items: {},
  isLoading: false,
  error: null,
};

export const createOrderThunk = createAsyncThunk<
  TOrder,
  TConstructorState,
  { rejectValue: string }
>('orders/createOrder', async (constructorItems, { rejectWithValue }) => {
  try {
    const ids: string[] = [
      ...(constructorItems.bun
        ? [constructorItems.bun._id, constructorItems.bun._id]
        : []),
      ...constructorItems.ingredients.map((i) => i._id),
    ];

    const data = await orderBurgerApi(ids);
    return data.order;
  } catch (err) {
    return rejectWithValue(
      err instanceof Error ? err.message : 'Не удалось отправить заказ'
    );
  }
});

export const fetchOrderByNumber = createAsyncThunk<
  TOrder,
  number,
  { rejectValue: string }
>('orders/fetchByNumber', async (orderNumber, { rejectWithValue }) => {
  try {
    const response = await getOrderByNumberApi(orderNumber);
    const order = response.orders[0];
    if (!order) {
      return rejectWithValue('Заказ не найден');
    }
    return order;
  } catch (err) {
    return rejectWithValue(
      err instanceof Error ? err.message : 'Не удалось загрузить заказ'
    );
  }
});

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrderByNumber: (state, action: { payload: string | number }) => {
      const key = String(action.payload);
      delete state.items[key];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrderThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrderThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        const order = action.payload;
        state.items[String(order.number)] = order;
      })
      .addCase(createOrderThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Ошибка при создании заказа';
      })

      .addCase(fetchOrderByNumber.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.isLoading = false;
        const order = action.payload;
        state.items[String(order.number)] = order;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Ошибка загрузки заказа';
      });
  },
});

export default ordersSlice.reducer;
