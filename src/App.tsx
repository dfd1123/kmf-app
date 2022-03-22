import { ThemeProvider } from 'styled-components';
import GlobalStyle from '@/assets/styles/global-styles';
import RouterView from '@/router';
import ModalContainer from '@/views/components/common/modal/ModalContainer';
import DialogContainer from '@/views/components/common/dialog/DialogContainer';
import ToastContainer from '@/views/components/common/toast/ToastContainer';
import useRouteMeta from '@/hooks/useRouteMeta';
import useService from '@/hooks/useService';
import { useTypedSelector } from './store';
import { useEffect } from 'react';
import useDialog from './hooks/useDialog';

function App() {
  const theme = useRouteMeta('theme');
  const services = useService();
  const userData = useTypedSelector((state) => state.authSlice.user, (a,b) => a?.id === b?.id);

  const {alert} = useDialog();


  useEffect(() => {
    if(userData && userData.status === 0){
      services.user.logout();
      alert('KMF멤버스 가입신청이 완료되었습니다. 가입승인이 완료되면 SMS로 알려드립니다.');
    }else{
      services.user.getMyInfo();
    }
  }, [userData]);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <RouterView />
      <ModalContainer />
      <DialogContainer />
      <ToastContainer />
    </ThemeProvider>
  );
}

export default App;
