import { Route } from '@/types/Route';
import ProfilePage from '@/views/pages/profilePage/ProfilePage';

const notice: Route[] = [
  {
    path: '/user/:no_id',
    element: <ProfilePage />,
    meta: {
      isAuth: true,
    },
  },
];

export default notice;
