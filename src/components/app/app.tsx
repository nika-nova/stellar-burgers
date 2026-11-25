import { AppHeader, Modal, OrderInfo, IngredientDetails } from '@components';
import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404,
} from '@pages';
import { Preloader } from '@ui';
import { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, useParams } from 'react-router-dom';

import {
  fetchIngredients,
  selectIngredients,
  selectIsLoading,
  selectError,
} from '@services/slices/ingredientsSlice';
import { fetchUser } from '@services/slices/userSlice';
import { useDispatch, useSelector } from '@services/store';

import { ProtectedRoute } from '../../routing/ProtectedRoute';

import type { AppContentProps } from './type';

import '../../index.css';

import styles from './app.module.css';

const App = (): React.JSX.Element => {
  const dispatch = useDispatch();

  useEffect(() => {
    void dispatch(fetchIngredients());
    void dispatch(fetchUser());
  }, [dispatch]);

  const ingredients = useSelector(selectIngredients);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);

  return (
    <div className={styles.app}>
      <AppHeader />
      <AppContent
        ingredients={ingredients}
        isLoading={isLoading}
        error={error ? { message: error } : null}
      />
    </div>
  );
};

export default App;

/* Маршруты показываются только когда ингредиенты загружены: без них не
   отрисовать ни конструктор, ни состав заказа. */
const AppContent = ({
  ingredients,
  isLoading,
  error,
}: AppContentProps): React.JSX.Element => {
  if (isLoading) {
    return <Preloader />;
  }

  if (error) {
    return (
      <p className={`${styles.message} text text_type_main-medium`}>
        Не удалось загрузить ингредиенты
        {error.message ? `: ${error.message}` : '.'}
      </p>
    );
  }

  if (!ingredients.length) {
    return (
      <p className={`${styles.message} text text_type_main-medium`}>Нет ингредиентов</p>
    );
  }

  return <RouteComponent />;
};

const RouteComponent = (): React.JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation();
  const { number } = useParams<{ number: string }>();

  const backgroundLocation = (location.state as { background?: Location } | null)
    ?.background;

  const handleCloseModal = (): void => {
    void navigate(-1);
  };

  const modalTitle = number ? `Заказ №${number}` : '';

  return (
    <>
      <Routes location={backgroundLocation ?? location}>
        <Route path="/" element={<ConstructorPage />} />
        <Route path="/feed" element={<Feed />} />

        <Route
          path="/login"
          element={
            <ProtectedRoute mode="public">
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path="/register"
          element={
            <ProtectedRoute mode="public">
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <ProtectedRoute mode="public">
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reset-password"
          element={
            <ProtectedRoute mode="public">
              <ResetPassword />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/orders"
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />

        <Route path="/feed/:number" element={<OrderInfo />} />
        <Route
          path="/ingredients/:id"
          element={
            <div className={styles.detailPageWrap}>
              <h1 className={`${styles.detailHeader} text text_type_main-large`}>
                Детали ингредиента
              </h1>
              <IngredientDetails />
            </div>
          }
        />
        <Route
          path="/profile/orders/:number"
          element={
            <ProtectedRoute>
              <OrderInfo />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound404 />} />
      </Routes>

      {backgroundLocation && (
        <Routes>
          <Route
            path="/ingredients/:id"
            element={
              <Modal title="Детали ингредиента" onClose={handleCloseModal}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path="/feed/:number"
            element={
              <Modal title={modalTitle} onClose={handleCloseModal}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path="/profile/orders/:number"
            element={
              <ProtectedRoute mode="private">
                <Modal title={modalTitle} onClose={handleCloseModal}>
                  <OrderInfo />
                </Modal>
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </>
  );
};
