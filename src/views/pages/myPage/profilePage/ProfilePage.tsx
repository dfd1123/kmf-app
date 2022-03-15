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
    const result = await services.user.getUser({ id: no_id ? no_id : '' });
    let image = JSON.parse(result.profile_img || '[]');
    image = image.length
      ? image[0].includes('http')
        ? image[0]
        : import.meta.env.VITE_STORAGE_URL + image[0]
      : basicProfile;
    setImgUrl(image);
    setUserInfo(result.user);
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <ContainerStyle className={`type-${userInfo?.status || 0}`}>
      <KmfHeader headerText={'회원상세'} prev />
      <ContentWrapperStyle>
        <KmfImageViewer
          imgUrl={imgUrl}
          width="100%"
          height="262px"></KmfImageViewer>
        <div className="content-wrapper">
          {userInfo?.association && (
            <div className="association">
              <div className="association-title">협회관련정보</div>
              <div className="association-content">{userInfo.association}</div>
            </div>
          )}
          <ProfileContent
            title="이름(기수)"
            content={userInfo?.name ? userInfo.name : ''}
            status={userInfo?.status}
          />
          <ProfileContent
            title="생년월일"
            content={userInfo?.birth ? userInfo.birth : ''}
          />
          <ProfileContent
            title="연락처"
            content={
              userInfo?.phone
                ? userInfo.phone.replace(
                    /^(\d{2,3})(\d{3,4})(\d{4})$/,
                    `$1-$2-$3`
                  )
                : ''
            }
          />
          <ProfileContent
            title="주소"
            content={
              userInfo?.address1
                ? `${userInfo.address1}, ${userInfo.address2}`
                : ''
            }
          />
          <ProfileContent
            title="현재소속사"
            content={userInfo?.company ? userInfo.company : ''}
          />
          <ProfileContent
            title="담당아티스트"
            content={userInfo?.manage_artist ? userInfo.manage_artist : ''}
          />
        </div>
        <div className="kmf-fighting">KMF 화이팅!</div>
      </ContentWrapperStyle>
      <FooterButton className="ft-btn">
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

  &.type- {
    &1 {
      header,
      .ft-btn button {
        background-color: #a7cd10;
      }
    }
    &2 {
      header,
      .ft-btn button {
        background-color: #28a8e1;
      }
    }
    &3 {
      header,
      .ft-btn button {
        background-color: #828282;
      }
    }
  }

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

  .association {
    margin: 1rem 0;
    padding: 6px 14px;
    height: 70px;
    border-radius: 8px;
    background-color: #ececec;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    font-size: 16px;
    font-weight: 600;

    .association-title {
      font-size: 14px;
      font-weight: 500;
      margin-bottom: 8px;
    }
  }
`;

export default ProfilePage;
