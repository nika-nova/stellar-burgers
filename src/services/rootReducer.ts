import feedReducer from '@/services/slices/feedSlice';
import { combineReducers } from '@reduxjs/toolkit';
import constructorReducer from '@slices/constructorSlice';
import ingredientsReducer from '@slices/ingredientsSlice';
import ordersReducer from '@slices/orderSlice';
import userReducer from '@slices/userSlice';

export const rootReducer = combineReducers({
  user: userReducer,
  ingredients: ingredientsReducer,
  burgerConstructor: constructorReducer,
  orders: ordersReducer,
  feed: feedReducer,
});
