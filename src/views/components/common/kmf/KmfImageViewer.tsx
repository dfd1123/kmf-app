import React from 'react';
import styled from 'styled-components';
import useModal from '@/hooks/useModal';
import ModalViewImage from '@/views/components/common/modal/ModalViewImage';

interface PropsType {
  imgUrl: string;
  children?: React.ReactNode;
  width?: string;
  height?: string;
}

const KmfImageViewer = ({imgUrl, children, width, height}: PropsType) => {
  const {openModal} = useModal();

  const imageViewModal = () => {
    openModal(ModalViewImage, {props:{image: imgUrl}});
  }
  return (
    <ImageContainer width={width} height={height} onClick={imageViewModal}>
      <img src={imgUrl} />
      {children}
    </ImageContainer>
  )
}

const ImageContainer = styled.div<{width?: string, height?: string}>`
  width: ${props => props.width ? props.width : '100px'};
  height: ${props => props.height ? props.height : '100px'};
  position: relative;
  background: #d8d8d8;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export default KmfImageViewer;
