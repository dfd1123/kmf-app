import styled from 'styled-components';
import {FullScreenModalStyle} from '@/views/components/common/modal/ModalTemplate';
import {ModalComponentPropsType} from '@/store/modal/types/modal';
import {useEffect} from 'react';

interface PropsType extends ModalComponentPropsType {
  image?: string;
}

const ModalViewImage = ({image, close}: PropsType) => {
  window.onpopstate = () => {
    popClose();
  }

  const popClose = async () => {
    window.history.go(1);
    close && await close();
    window.history.go(-1);
  }

  useEffect(() => {
    window.history.pushState(null, '', window.location.href);
  }, []);

  return (
    <ModalViewImageStyle close={close}>
      <button onClick={popClose}>
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
             viewBox="0 0 1000 1000" enableBackground="new 0 0 1000 1000" >
<metadata> Svg Vector Icons : http://www.onlinewebfonts.com/icon </metadata>
          <g><path d="M500,990C229.8,990,10,770.2,10,500S229.8,10,500,10s490,219.8,490,490S770.2,990,500,990z M500,80.3C268.6,80.3,80.3,268.6,80.3,500c0,231.4,188.3,419.7,419.7,419.7c231.4,0,419.7-188.3,419.7-419.7C919.7,268.6,731.4,80.3,500,80.3z M549.3,501.5l151.3-149.7c13.8-13.6,13.9-35.7,0.3-49.5c-13.6-13.8-35.8-13.9-49.5-0.3L499.9,451.9L350.6,302.2c-13.7-13.7-35.8-13.8-49.5-0.1c-13.7,13.6-13.7,35.8-0.1,49.5l149,149.5L299.8,649.8c-13.8,13.6-13.9,35.7-0.3,49.5c6.9,6.9,15.9,10.4,24.9,10.4c8.9,0,17.8-3.4,24.6-10.1l150.5-148.8l151.7,152.2c6.8,6.9,15.8,10.3,24.8,10.3c9,0,17.9-3.4,24.7-10.2c13.7-13.7,13.7-35.8,0.1-49.5L549.3,501.5z"/></g>
</svg>
      </button>
      <img src={image} alt="" />
    </ModalViewImageStyle>
  );
};

const ModalViewImageStyle = styled(FullScreenModalStyle)`
  .dim .cont{
    display:flex;
    justify-content:center;
    align-items:center;
    background-color:#000;
    
    img{
      width:100%;
      height:100%;
      object-fit: contain;
      background-color:#000;
    }
    
    button{
      position: absolute;
      top: 10px;
      right: 10px;
      z-index: 10000000;
      width: 26px;
      
      svg{
        path{
          fill: #fff;
        }
      }
    }
  }
`;

export default ModalViewImage;
