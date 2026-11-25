import { getIngredientsApi } from '@api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import type { RootState } from '@services/store';
import type { TIngredient } from '@utils/types';

type TIngredientsState = {
  ingredients: TIngredient[];
  isLoading: boolean;
  error: string | null;
};

const initialState: TIngredientsState = {
  ingredients: [],
  isLoading: false,
  error: null,
};

export const fetchIngredients = createAsyncThunk<
  TIngredient[],
  void,
  { rejectValue: string }
>('ingredients/fetch', async (_, { rejectWithValue }) => {
  try {
    return await getIngredientsApi();
  } catch (err) {
    return rejectWithValue(
      err instanceof Error ? err.message : 'Не удалось загрузить ингредиенты'
    );
  }
});

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ingredients = action.payload;
      })

      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Ошибка загрузки';
      });
  },
});

export default ingredientsSlice.reducer;

export const selectIngredients = (state: RootState) => state.ingredients.ingredients;
export const selectIsLoading = (state: RootState) => state.ingredients.isLoading;
export const selectError = (state: RootState) => state.ingredients.error;
