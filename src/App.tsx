import { ThemeProvider } from 'styled-components';
import GlobalStyle from '@/assets/styles/global-styles';
import RouterView from '@/router';
import ModalContainer from '@/views/components/common/modal/ModalContainer';
import DialogContainer from '@/views/components/common/dialog/DialogContainer';
import ToastContainer from '@/views/components/common/toast/ToastContainer';
import useRouteMeta from '@/hooks/useRouteMeta';
import { useTypedSelector } from './store';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';

function App() {
  const theme = useRouteMeta('theme');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userData = useTypedSelector((state) => state.authSlice.user, (a,b) => a?.id === b?.id);

  const moveUrl = searchParams.get('to');

  useEffect(() => {
    if (moveUrl) {
      navigate(location.pathname, { replace: true });
      navigate(moveUrl);
    }
  }, []);


  useEffect(() => {
    if(userData && userData.status === 0){
      navigate('/mypage');
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
