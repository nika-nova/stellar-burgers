import { AppHeaderUI } from '@ui';

import { useSelector } from 'react-redux';
import type { RootState } from '@services/store';

export const AppHeader = (): React.JSX.Element => {
  const userName = useSelector((state: RootState) => state.user.user?.name);

  return <AppHeaderUI userName={userName} />;
};
