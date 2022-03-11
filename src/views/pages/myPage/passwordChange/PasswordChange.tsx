import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import KmfHeader from '@/views/components/layouts/KmfHeader';
import { BasicInput } from '@/views/components/common/input/TextInput';
import BasicButton from '@/views/components/common/Button';
import useService from '@/hooks/useService';
import { useTypedSelector } from '@/store';
import useToast from '@/hooks/useToast';
import { useNavigate } from 'react-router';
import useDialog from '@/hooks/useDialog';

const PasswordChange = () => {
  const [beforePassword, setBeforePassword] = useState('');
  const [password, setPassword] = useState('');
  const [secondPassword, setSecondPassword] = useState('');
  const [match, setMatch] = useState(true);
  const [correctPwd, setCorrectPwd] = useState(true);
  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
  const service = useService();
  const userData = useTypedSelector((state) => state.authSlice.user);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { alert } = useDialog();

  const passwordOnChange = (value: string, name: string) => {
    setCorrectPwd(value.length >= 8 && value.length <= 20);
    setPassword(value);
  };

  const confirmCorrectPassword = (value: string, name: string) => {
    setMatch(value === password);
    setSecondPassword(value);
  };

  const passwordChangeOnSubmit = async () => {
    const email = userData?.email ? userData.email : '';
    const token = service?.cookie?.getAccessToken()
      ? service.cookie.getAccessToken()
      : '';
    if (
      password !== secondPassword ||
      !correctPwd ||
      email === '' ||
      token === '' ||
      beforePassword === ''
    ) {
      return;
    }

    const id = userData?.id ? userData?.id : 0;

    await service.user.pwChange({
      id: id,
      before_password: beforePassword,
      password: password,
      password_confirmation: password,
    });

    const result = await alert('비밀번호가 성공적으로 변경되었습니다.', {
      title: '비밀번호 변경',
    });
    navigate('/login');
  };

  useEffect(() => {
    password !== secondPassword && setMatch(false);
  }, [password, match]);

  return (
    <ContainerStyle>
      <KmfHeader headerText={'비밀번호 변경'} prev />
      <ContentWrapperStyle>
        <div className="input-form">
          <BasicInput
            className="password-input"
            name="prev"
            placeholder="기존 비밀번호를 입력해주세요."
            label="기존 비밀번호"
            type={'password'}
            onChange={(value, name) => setBeforePassword(value)}
          />
          <BasicInput
            className="password-input"
            name="current"
            placeholder="새로운 비밀번호를 입력해주세요."
            label="새로운 비밀번호"
            type={'password'}
            onChange={passwordOnChange}
          />
          <BasicInput
            className="password-input"
            name="current-check"
            placeholder="비밀번호 확인"
            label="비밀번호 확인"
            type={'password'}
            onChange={confirmCorrectPassword}
          />
          <div className={'pwd-validation'}>
            {!correctPwd &&
              '특수문자, 숫자, 영문자로 조합된 최소 8자로 입력해주세요.'}
          </div>
          {correctPwd && (
            <div className={'pwd-validation'}>
              {!match && '비밀번호가 일치하지 않습니다.'}
            </div>
          )}
          <div className="kmf-fighting">KMF 화이팅!</div>
        </div>
      </ContentWrapperStyle>
      <FooterStyle onClick={passwordChangeOnSubmit}>저장하기</FooterStyle>
    </ContainerStyle>
  );
};

const ContainerStyle = styled.div`
  display: flex;
  flex-direction: column;
`;

const ContentWrapperStyle = styled.section`
  height: calc(100vh - 106px);
  /* height: 100vh; */
  overflow: scroll;
  font-size: 14px;
  line-height: 20px;

  .input-form {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 16px;
  }

  .password-input {
    width: 100%;
    margin-bottom: 14px;

    input {
      width: 100%;
    }

    label {
      font-size: 14px;
      color: #1e1e1e;
    }

    input[name~='address'] {
      margin-bottom: -6px;
    }
  }

  .kmf-fighting {
    /* height: 128px; */
    padding: 20px;
    text-align: center;
    color: #acacac;
  }

  .pwd-validation {
    color: red;
    font-size: 12px;
    padding: 2px 4px;
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  height: 262px;
  position: relative;

  img {
    width: 100%;
    height: 262px;
    object-fit: cover;
  }
`;

const FooterStyle = styled(BasicButton)`
  display: flex;
  height: 60px;
  width: 100%;
  background-color: #1574bd;
  justify-content: center;
  align-items: center;
  border-radius: 0 !important;

  > button {
    color: white;
    font-size: 17px;
    font-weight: 500;
  }
`;

const FindImage = styled.div<{ imgUrl?: string }>`
  width: 80px;
  height: 80px;
  position: absolute;
  top: 111px;
  left: calc(50% - 20px);
  z-index: 1;
  display: flex;
  background-image: url(${(props) => props.imgUrl});
  background-size: 40px;
  background-repeat: no-repeat;
`;

export default PasswordChange;
