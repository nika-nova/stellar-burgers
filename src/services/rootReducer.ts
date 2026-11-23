import { combineReducers } from '@reduxjs/toolkit';

import userReducer from '@slices/userSlice';
import ingredientsReducer from '@slices/ingredientsSlice';
import constructorReducer from '@slices/constructorSlice';
import ordersReducer from '@slices/orderSlice';
import feedReducer from '@/services/slices/feedSlice';

export const rootReducer = combineReducers({
  user: userReducer,
  ingredients: ingredientsReducer,
  burgerConstructor: constructorReducer,
  orders: ordersReducer,
  feed: feedReducer,
});
