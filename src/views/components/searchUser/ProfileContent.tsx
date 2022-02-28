import React from 'react';
import styled from 'styled-components';

interface PropsType {
  title: string;
  content: string;
  status?: number;
}

const getMemberStatus = (status: number) => {
  switch (status) {
    case 1:
      return '준회원';
    case 2:
      return '정회원';
    case 3:
      return '관계자';
    default:
      return '';
  }
};
const ProfileContent = ({ title, content, status }: PropsType) => {
  return (
    <ContainerStyle>
      <div className="title">{title}</div>
      <div className="content">
        {status ? (
          <div className="status-wrapper">
            <div className={`status status-${status}`}>
              {getMemberStatus(status)}
            </div>
            <div>{content}</div>
          </div>
        ) : (
          <div>{content}</div>
        )}
      </div>
    </ContainerStyle>
  );
};

const ContainerStyle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  height: 70px;
  width: 100%;
  border-bottom: 1px solid #f1f1f1;

  .title {
    color: #828282;
  }

  .status-wrapper {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  .content {
    width: 60%;
    margin-top: 4px;
    text-align: end;
    display: -webkit-box !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    -webkit-box-orient: vertical !important;
    -webkit-line-clamp: 2 !important;
    font-size: 16px;
  }

  .status {
    color: white;
    border-radius: 3px;
    padding: 2px 12px;
    margin-right: 1rem;
    font-size: 14px;
  }

  .status-1 {
    background-color: #f8b327;
  }

  .status-2 {
    background-color: #73a462;
  }

  .status-3 {
    background-color: gray;
  }
`;

export default ProfileContent;
