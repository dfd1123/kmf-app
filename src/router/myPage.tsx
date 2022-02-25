import {Route} from '@/types/Route';
import CommonInfo from '@/views/pages/commonInfo/CommonInfo';
import ManageProfile from '@/views/pages/myPage/manageProfile/ManageProfile';
import MyPage from '@/views/pages/myPage/MyPage'
import PasswordChange from '@/views/pages/myPage/passwordChange/PasswordChange';

const myPage : Route[] = [
    {
        path: '/mypage',
        element: <MyPage/>,
        meta: {
            isAuth: true,
        }
    },
    {
        path: '/manageProfile',
        element: <ManageProfile />,
        meta: {
          isAuth: true,
        },
      },
      {
        path: '/passwordChange',
        element: <PasswordChange />,
        meta: {
          isAuth: true,
        },
      },
      {
        path: '/serviceInfo',
        element: <CommonInfo />,
        meta: {
          isAuth: true,
        },
      },
      {
        path: '/term',
        element: <CommonInfo />,
        meta: {
          isAuth: true,
        },
      },
]

export default myPage;