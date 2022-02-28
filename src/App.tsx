import { ThemeProvider } from 'styled-components';
import GlobalStyle from '@/assets/styles/global-styles';
import RouterView from '@/router';
import ModalContainer from '@/views/components/common/modal/ModalContainer';
import DialogContainer from '@/views/components/common/dialog/DialogContainer';
import ToastContainer from '@/views/components/common/toast/ToastContainer';
import useRouteMeta from '@/hooks/useRouteMeta';
import useService from '@/hooks/useService';

function App() {
  const theme = useRouteMeta('theme');
  const services = useService();
  services.user.getMyInfo();

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
