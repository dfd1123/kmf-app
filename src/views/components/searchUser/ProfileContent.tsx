import React from 'react';
import styled from 'styled-components';

interface PropsType {
  title: string;
  content: string;
}

const ProfileContent = ({ title, content }: PropsType) => {
  return (
    <ContainerStyle>
      <div className="title">{title}</div>
      <div className="content">{content}</div>
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

  .content {
    width: 60%;
    margin-top: 4px;
    text-align: end;
    display: -webkit-box !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    -webkit-box-orient: vertical !important;
    -webkit-line-clamp: 2 !important;
  }
`;

export default ProfileContent;
