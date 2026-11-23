import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFeedsApi, getOrdersApi } from '@api';

import type { TOrder, TOrdersData } from '@utils/types';

type TFeedState = TOrdersData & {
  userOrders: TOrder[];
  isLoading: boolean;
  error: string | null;
};

const initialState: TFeedState = {
  orders: [],
  userOrders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null,
};

export const fetchFeed = createAsyncThunk<TOrdersData, void, { rejectValue: string }>(
  'feed/fetchFeed',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getFeedsApi();
      return data;
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : 'Не удалось получить ленту заказов'
      );
    }
  }
);

export const fetchUserOrders = createAsyncThunk<TOrder[], void, { rejectValue: string }>(
  'feed/fetchUserOrders',
  async (_, { rejectWithValue }) => {
    try {
      const orders = await getOrdersApi();
      return orders;
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : 'Не удалось получить заказы пользователя'
      );
    }
  }
);

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Не удалось загрузить ленту заказов';
      })

      .addCase(fetchUserOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.userOrders = action.payload;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Не удалось загрузить заказы пользователя';
      });
  },
});

export default feedSlice.reducer;
