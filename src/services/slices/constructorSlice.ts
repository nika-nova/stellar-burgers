import { createSlice, nanoid } from '@reduxjs/toolkit';
import { createOrderThunk } from './orderSlice';

import type {
  TConstructorIngredient,
  TIngredient,
  TConstructorState,
  TOrder,
} from '@utils/types';
import type { PayloadAction } from '@reduxjs/toolkit';

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
      state.ingredients = state.ingredients.filter(
        (item) => item.id !== action.payload
      );
    },
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    },
    moveIngredient: (
      state,
      action: PayloadAction<{ from: number; to: number }>
    ) => {
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
    builder.addCase(createOrderThunk.fulfilled, (state) => {
      state.bun = null;
      state.ingredients = [];
    });
  },
});

export const {
  addIngredient,
  removeIngredient,
  clearConstructor,
  moveIngredient,
  setOrderRequest,
  setOrderModalData,
} = constructorSlice.actions;

export default constructorSlice.reducer;
