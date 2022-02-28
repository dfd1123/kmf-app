import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

interface KmfLinkedListProps {
  date?: string;
  title: string;
  type?: string;
  to?: string;
  fontColor?: string;
  fontSize?: string;
  progress?: string;
  progressColor?: string;
}

const KmfLinkedList = ({
  title,
  date,
  type = 'none',
  to = '',
  fontColor = '#000',
  fontSize = '14px',
  progress,
  progressColor,
}: KmfLinkedListProps) => {
  to = to ?? window.location.href;
  return (
    <Container progressColor={progressColor ? progressColor : ''}>
      {to ? (
        <Link className={'link'} to={to}>
          {date && <DateViewer>{date}</DateViewer>}
          <Title fontColor={fontColor} fontSize={fontSize}>
            {title}
          </Title>
          <div className="progress">{progress}</div>
        </Link>
      ) : (
        <div className={'link'}>
          {date && <DateViewer>{date}</DateViewer>}
          <Title fontColor={fontColor} fontSize={fontSize}>
            {title}
          </Title>
        </div>
      )}
    </Container>
  );
};

export default KmfLinkedList;

const Container = styled.div<{ progressColor?: string }>`
  padding: 10px 0;
  height: 100%;

  .link {
    display: flex;
    justify-content: flex-start;
    align-content: space-between;
    height: 100%;
    position: relative;
  }

  .progress {
    position: absolute;
    right: 12%;
    align-self: center;
    color: ${(props) => props.progressColor};
  }
`;

const Title = styled.p<{ fontColor: string; fontSize: string }>`
  font-size: 14px;
  font-weight: 400;
  width: 60%;
  line-height: 1.4rem;
  display: -webkit-box !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  -webkit-box-orient: vertical !important;
  -webkit-line-clamp: 2 !important;
  color: ${(props) => props.fontColor};
  font-size: ${(props) => props.fontSize};
`;

const DateViewer = styled.div`
  color: #828282;
  font-size: 12px;
  margin-bottom: 12px;
`;

const LinkContainerStyle = styled(Link)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
`;
