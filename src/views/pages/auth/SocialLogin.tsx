import useService from '@/hooks/useService';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useSearchParams } from 'react-router-dom';

const SocialLogin = () => {
  const navigate = useNavigate();
  const services = useService();
  const [searchParams] = useSearchParams();

  const email = searchParams.get('email');
  const access_token = searchParams.get('access_token');
  const flag = searchParams.get('flag');


  useEffect(() => {
    if(access_token) {
      services.cookie.setAccessToken(access_token);
      services.user.getMyInfo();
  
      if(flag === 'register'){
        navigate('/register');
      }else {
        navigate('/notice');
      }
    }
  }, []);
  return <></>;
};

export default SocialLogin;
