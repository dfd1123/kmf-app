import styled from 'styled-components';
import defaultProfileImg from '@/assets/img/kmf/default_profile.png';
import { UserListInfo } from '@/services/types/User';

interface PropsType {
  user: UserListInfo;
  onClick: () => void;
}

const UserList = ({ user, onClick }: PropsType) => {
  let image = JSON.parse(user.profile_img || '[]');
  image = image.length > 0 && image[0]
    ? (image[0].includes('http') ? image[0] : import.meta.env.VITE_STORAGE_URL + image[0])
    : defaultProfileImg;
  return (
    <UserListStyle className={`type-${user.status}`} onClick={onClick}>
      <div className="info">
        <div className="name">
          {user.name || '알수없음'} {user.cardinal_num}
        </div>
        <span className="company">{user.company || '-'}</span>
      </div>
      <div className="image">
        <img src={image} alt={user.name || '알수없음'} />
      </div>
    </UserListStyle>
  );
};

const UserListStyle = styled.div`
  position: relative;
  margin-bottom: 8px;
  padding: 8px;
  background-color: #fbffea;
  box-shadow: 0px 2px 4px rgba(167, 205, 16, 0.15);
  border-radius: 5px;

  &.type-${1} {
    background-color: #fbffea;
    box-shadow: 0px 2px 4px rgba(167, 205, 16, 0.15);
  }

  &.type-${2} {
    background-color: #e8f5ff;
    box-shadow: 0px 2px 4px rgba(21, 116, 189, 0.15);
  }

  &.type-${3} {
    background-color: #f3f3f3;
    box-shadow: 0px 2px 4px rgba(21, 116, 189, 0.15);
  }

  .info {
    padding: 8px 0;
    padding-left: 4px;
    padding-right: 78px;

    .name {
      margin-bottom: 4px;
      font-size: 17px;
      font-weight: 600;
      color: #000;
      line-height: 25px;
    }

    .company {
      font-size: 12px;
      color: #828282;
      line-height: 17px;
    }
  }

  .image {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 1;
    width: 62px;
    height: 62px;
    margin: 9px;
    border-radius: 50%;
    background-color: #d8d8d8;
    overflow: hidden;

    > img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
      vertical-align: middle;
    }
  }
`;

export default UserList;
