import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  updateUserApi,
} from '@api';
import { deleteCookie, setCookie } from '@/utils/cookie';

import type { TUser } from '@utils/types';
import type { TLoginData, TRegisterData } from '@api';

type TUserState = {
  user: TUser | null;
  isAuthChecked: boolean;
  isLoading: boolean;
  error: string | null;
};

const initialState: TUserState = {
  user: null,
  isAuthChecked: false,
  isLoading: false,
  error: null,
};

export const fetchUser = createAsyncThunk<TUser, void, { rejectValue: string }>(
  'user/fetchUser',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getUserApi();
      return data.user;
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : 'Не удалось получить данные пользователя'
      );
    }
  }
);

export const loginUser = createAsyncThunk<TUser, TLoginData, { rejectValue: string }>(
  'user/loginUser',
  async (data, { rejectWithValue }) => {
    try {
      const res = await loginUserApi(data);
      setCookie('accessToken', res.accessToken);
      localStorage.setItem('refreshToken', res.refreshToken);
      return res.user;
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : 'Ошибка при входе в систему'
      );
    }
  }
);

export const registerUser = createAsyncThunk<TUser, TRegisterData, { rejectValue: string }>(
  'user/registerUser',
  async (data, { rejectWithValue }) => {
    try {
      const reg = await registerUserApi(data);
      setCookie('accessToken', reg.accessToken);
      localStorage.setItem('refreshToken', reg.refreshToken);
      return reg.user;
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : 'Ошибка регистрации'
      );
    }
  }
);

export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  'user/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
      localStorage.removeItem('refreshToken');
      deleteCookie('accessToken');
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : 'Не удалось выйти из системы'
      );
    }
  }
);

export const updateUser = createAsyncThunk<TUser, Partial<TRegisterData>, { rejectValue: string }>(
  'user/updateUser',
  async (data, { rejectWithValue }) => {
    try {
      const upd = await updateUserApi(data);
      return upd.user;
    } catch (err) {
      return rejectWithValue(
        err instanceof Error ? err.message : 'Не удалось обновить профиль'
      );
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
        state.isLoading = false;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.user = null;
        state.isAuthChecked = true;
        state.isLoading = false;
        state.error = action.payload ?? 'Не удалось проверить авторизацию';
      })

      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
        state.isLoading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Ошибка входа';
      })

      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
        state.isLoading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Ошибка регистрации';
      })

      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthChecked = true;
        state.isLoading = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Не удалось выйти';
      })

      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Не удалось обновить данные';
      });
  },
});

export default userSlice.reducer;
