import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import { setAuth } from '@/store/auth/auth';
import useToast from '@/hooks/useToast';
import useService from '@/hooks/useService';
import TextInput from '@/views/components/common/input/TextInput';
import AddressInput from '@/views/components/common/input/AddressInput';
import FooterButton from '@/views/components/common/FooterButton';
import DateSelectInput from '@/views/components/common/input/DateSelectInput';
import { useSearchParams } from 'react-router-dom';
import { RegisterInput } from '@/services/types/User';

const intialInput: RegisterInput = {
  name: '',
  email: '',
  birth: '',
  phone: '',
  company: '',
  address1: '',
  address2: '',
  password: '',
  password_confirmation: '',
};

const RegisterForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const services = useService();
  const [inputs, setInputs] = useState<RegisterInput>(intialInput);
  const [correct, setCorrect] = useState(false);
  const [validate, setValidate] = useState(false);
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const social = Boolean(searchParams.get('social'));

  if (social) inputs.email = searchParams.get('email') || '';

  const checkValidate = () => {
    const keyArr = Object.keys(inputs).filter((key, index) => {
      if (social) {
        if (
          key !== 'email' &&
          key !== 'password' &&
          key !== 'password_confirmation'
        ) {
          return key;
        }
      }

      return key;
    });

    let check =
      keyArr.filter((key) => {
        return !Boolean(inputs[key as keyof RegisterInput]);
      }).length === 0;
    check = !social
      ? check && inputs.password.length >= 8 && inputs.password.length <= 20
      : check;
    setValidate(check);
  };

  const handleInputChange = (value: any, name: string) => {
    setInputs({ ...inputs, [name]: value });
  };

  const submitHandler = async () => {
    let result = null;
    if (social) {
      result = await services.user.socialRegister(inputs);
    } else {
      result = await services.user.register(inputs);
    }

    if (result?.access_token) {
      dispatch(setAuth(result));
      toast('??????????????? ?????????????????????. ????????? ?????? ??? ?????? ??????????????????.', {
        type: 'success',
      });
      navigate('/mypage');
    }
  };

  useEffect(() => {
    checkValidate();
    setCorrect(
      !social
        ? inputs.password === inputs.password_confirmation &&
            Boolean(inputs.password && inputs.password_confirmation)
        : true
    );
  }, [inputs]);

  return (
    <PasswordResetFormStyle>
      <div className="article">
        <h6>????????????</h6>
        <TextInput
          type="text"
          name="name"
          label="??????"
          placeholder="????????? ??????????????????."
          reset
          onChange={handleInputChange}
        />
        <DateSelectInput
          name="birth"
          label="????????????"
          placeholder="????????? ??????????????????."
          reset
          onChange={handleInputChange}
        />
        <TextInput
          type="tel"
          name="phone"
          label="?????????"
          placeholder="????????? ??????????????????."
          number
          reset
          onChange={handleInputChange}
        />
      </div>
      <div className="article">
        <h6>???????????????</h6>
        <TextInput
          type="text"
          name="company"
          label="?????? ?????????"
          reset
          onChange={handleInputChange}
        />
        <AddressInput
          name="address1"
          label="????????? ??????"
          placeholder="????????? ???????????????."
          reset
          onChange={handleInputChange}
        />
        <TextInput
          type="text"
          name="address2"
          placeholder="??????????????? ??????????????????."
          reset
          onChange={handleInputChange}
        />
      </div>
      {!social && (
        <div className="article">
          <h6>????????????</h6>
          <TextInput
            type="email"
            name="email"
            label="?????????"
            placeholder="abc@mail.com"
            reset
            onChange={handleInputChange}
          />
          <TextInput
            type="password"
            name="password"
            label="????????????"
            placeholder="8~20????????? ????????????, ?????? ??????"
            reset
            onChange={handleInputChange}
          />
          {inputs.password &&
          (inputs.password.length < 8 || inputs.password.length > 20) ? (
            <span className={`status incorrect`}>
              8???????????? 20?????? ????????? ??????????????????.
            </span>
          ) : (
            ''
          )}
          <TextInput
            type="password"
            name="password_confirmation"
            label="???????????? ??????"
            reset
            onChange={handleInputChange}
            onEnter={submitHandler}
          />
          {inputs.password_confirmation ? (
            <span className={`status ${correct ? 'correct' : 'incorrect'}`}>
              {correct ? '??????????????? ???????????????' : '??????????????? ??????????????????.'}
            </span>
          ) : (
            ''
          )}
        </div>
      )}
      <div className="agree-cont"></div>
      <FooterButton disabled={!correct || !validate} onClick={submitHandler}>
        KMF ????????? ????????????
      </FooterButton>
    </PasswordResetFormStyle>
  );
};

const PasswordResetFormStyle = styled.div`
  padding-bottom: 80px;

  .article {
    margin-bottom: 56px;

    h6 {
      margin-bottom: 16px;
      font-size: 13px;
      font-weight: 500;
      color: #000;
      line-height: 17px;
    }

    ${TextInput} {
      width: 100%;
      margin-bottom: 13px;
    }

    .status {
      display: block;
      margin-top: -5px;
      padding: 0 3px;
      font-size: 12px;

      &.correct {
        color: blue;
      }

      &.incorrect {
        color: red;
      }
    }
  }
`;

export default RegisterForm;
