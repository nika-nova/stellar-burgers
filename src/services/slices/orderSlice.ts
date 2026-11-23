import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getOrderByNumberApi, orderBurgerApi } from '@api';
import type { TOrder, TConstructorState } from '@utils-types';
import type { RootState } from '@services/store';

type TOrdersState = {
  items: Record<string, TOrder>;
  isLoading: boolean;
  error: string | null;
}

const initialState: TOrdersState = {
  items: {},
  isLoading: false,
  error: null,
};

export const createOrderThunk = createAsyncThunk<TOrder, TConstructorState, { rejectValue: string }>(
  'orders/createOrder',
  async (constructorItems, { rejectWithValue }) => {
    try {
      const ids: string[] = [
    ...(constructorItems.bun ? [constructorItems.bun._id] : []),
    ...constructorItems.ingredients.map(i => i._id)
  ];

      const data = await orderBurgerApi(ids);
      return data.order;
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : 'Не удалось отправить заказ'
      );
    }
  }
);

export const fetchOrderByNumber = createAsyncThunk<TOrder, string, { rejectValue: string }>(
  'orders/fetchByNumber',
  async (string, { rejectWithValue }) => {
    try {
      const number = Number(string);
      const response = await getOrderByNumberApi(number);
      return response.orders[0];
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : 'Не удалось загрузить заказ'
      );
    }
  }
);

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

export const selectOrderByNumber = (number: string) => (state: RootState) => {
  return state.orders.items[number] ?? null;
};

export const { clearOrderByNumber } = ordersSlice.actions;
