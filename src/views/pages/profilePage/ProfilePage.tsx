import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import useService from '@/hooks/useService';
import KmfHeader from '@/views/components/layouts/KmfHeader';
import KmfImageViewer from '@/views/components/common/kmf/KmfImageViewer';
import FooterButton from '@/views/components/common/FooterButton';
import { useNavigate, useParams } from 'react-router';
import { ProfileInput } from '@/services/types/User';
import ProfileContent from '@/views/components/searchUser/ProfileContent';
import call from '@/assets/img/kmf/call.svg';
import basicProfile from '@/assets/img/kmf/default_profile.png';

const ProfilePage = () => {
  const services = useService();
  let { no_id } = useParams();
  const [userInfo, setUserInfo] = useState<ProfileInput | null>();
  const [imgUrl, setImgUrl] = useState(basicProfile);

  const getUser = async () => {
    const result = await services.user.getUser({ id: no_id });
    setImgUrl(
      result.user.profile_img
        ? `${process.env.VITE_STORAGE_URL}${result.user.profile_img.slice(
            2,
            result.user.profile_img.length - 2
          )}`
        : basicProfile
    );
    setUserInfo(result.user);
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <ContainerStyle>
      <KmfHeader headerText={'회원상세'} prev />
      <ContentWrapperStyle>
        <KmfImageViewer
          imgUrl={imgUrl}
          width="100%"
          height="262px"></KmfImageViewer>
        <div className="content-wrapper">
          <ProfileContent
            title="이름(기수)"
            content={userInfo?.name}
            status={userInfo?.status}
          />
          <ProfileContent title="생년월일" content={userInfo?.birth} />
          <ProfileContent title="연락처" content={userInfo?.phone} />
          <ProfileContent title="주소" content={userInfo?.address1} />
          <ProfileContent title="현재소속사" content={userInfo?.company} />
          <ProfileContent
            title="담당아티스트"
            content={userInfo?.manage_artist}
          />
        </div>
        <div className="kmf-fighting">KMF 화이팅!</div>
      </ContentWrapperStyle>
      <FooterButton>
        <a className="phone-call" href={`tel:${userInfo?.phone}`}>
          <img className="call-icon" src={call} />
          통화하기
        </a>
      </FooterButton>
    </ContainerStyle>
  );
};

const ContainerStyle = styled.div`
  display: flex;
  flex-direction: column;

  .call-icon {
    width: 20px;
    height: 20px;
    margin-right: 10px;
  }
`;

const ContentWrapperStyle = styled.section`
  height: calc(100vh - 46px - 78px);
  overflow: scroll;
  font-size: 14px;
  line-height: 20px;

  .content-wrapper {
    padding: 0 16px;
  }

  .kmf-fighting {
    padding: 20px;
    text-align: center;
    color: #acacac;
    margin-top: auto;
  }
`;

export default ProfilePage;
