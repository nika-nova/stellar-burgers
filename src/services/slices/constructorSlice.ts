import { createSlice, nanoid, createSelector } from '@reduxjs/toolkit';

import { createOrderThunk } from './orderSlice';

import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@services/store';
import type {
  TConstructorIngredient,
  TIngredient,
  TConstructorState,
  TOrder,
} from '@utils/types';

export type TConstructorFullState = TConstructorState & {
  orderRequest: boolean;
  orderModalData: TOrder | null;
};

const initialState: TConstructorFullState = {
  bun: null,
  ingredients: [],
  orderRequest: false,
  orderModalData: null,
};

const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.bun = action.payload;
        } else {
          state.ingredients.push(action.payload);
        }
      },
      prepare: (ingredient: TIngredient) => {
        const id = nanoid();
        return {
          payload: {
            ...ingredient,
            id,
          },
        };
      },
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter((item) => item.id !== action.payload);
    },
    moveIngredient: (state, action: PayloadAction<{ from: number; to: number }>) => {
      const { from, to } = action.payload;
      if (from < 0 || from >= state.ingredients.length) return;

      const movingIngredient = state.ingredients.splice(from, 1)[0];
      if (!movingIngredient) return;

      state.ingredients.splice(to, 0, movingIngredient);
    },
    setOrderRequest: (state, action: PayloadAction<boolean>) => {
      state.orderRequest = action.payload;
    },
    setOrderModalData: (state, action: PayloadAction<TOrder | null>) => {
      state.orderModalData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrderThunk.pending, (state) => {
        state.orderRequest = true;
      })
      .addCase(createOrderThunk.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
        state.bun = null;
        state.ingredients = [];
      })
      .addCase(createOrderThunk.rejected, (state) => {
        state.orderRequest = false;
      });
  },
});

export const selectBun = (state: RootState) => state.burgerConstructor.bun;

export const selectIngredients = (state: RootState) =>
  state.burgerConstructor.ingredients;

export const selectConstructorItems = createSelector(
  [selectBun, selectIngredients],
  (bun, ingredients) => ({ bun, ingredients })
);

export const selectOrderRequest = (state: RootState): boolean =>
  state.burgerConstructor.orderRequest;

export const selectOrderModalData = (state: RootState): TOrder | null =>
  state.burgerConstructor.orderModalData;

export const {
  addIngredient,
  removeIngredient,
  moveIngredient,
  setOrderRequest,
  setOrderModalData,
} = constructorSlice.actions;

export default constructorSlice.reducer;
