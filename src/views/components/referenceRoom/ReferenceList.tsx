import styled from 'styled-components';
import { useTypedSelector } from '@/store';
import { dateFormat } from '@/utils/dateUtils';
import BasicButton from '@/views/components/common/Button';
import { Link } from 'react-router-dom';
import { RefrenceDataType } from '@/services/types/Reference';
import useService from '@/hooks/useService';
import icoArrowImg from '@/assets/img/kmf/arrow.png';

interface PropsType {
  info: RefrenceDataType;
}

const ReferenceList = ({ info }: PropsType) => {
  const services = useService();
  const unreadRefList = useTypedSelector(
    (state) => state.noticeSlice.unreadRefList
  );
  const unread = unreadRefList.includes(info.ar_id ?? -1);
  const date = dateFormat(new Date(info.created_at), 'yyyy - MM - dd');
  const existFile = JSON.parse(info?.ar_file ?? '[]').length > 0;

  const fileDownload = () => {
    services.reference.download(JSON.parse(info?.ar_file ?? '[]'));
  };

  return (
    <Container>
      <Link to={`/ref/${info.ar_id}`}>
        <p className="title">{info.ar_title}</p>
        <span className="date">{date || '-'}</span>
        {unread ? <span className="new">new</span> : ''}
      </Link>
    </Container>
  );
};

const Container = styled.div`
  > a {
    position: relative;
    display: block;
    width: 100%;
    padding: 10px 16px;
    padding-left: 0;
    height: 100%;
    background-image: url(${icoArrowImg});
    background-position: 100% center;
    background-size: 16px;
    background-repeat: no-repeat;
  }

  .date {
    color: #828282;
    font-size: 12px;
    margin-bottom: 12px;
  }

  .new {
    margin-left: 8px;
    font-size: 12px;
    color: red;
  }

  .title {
    font-size: 14px;
    font-weight: 400;
    width: 80%;
    line-height: 1.4rem;
    display: -webkit-box !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    -webkit-box-orient: vertical !important;
    -webkit-line-clamp: 2 !important;
    font-size: 14px;
  }

  ${BasicButton} {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 1;
    height: 100%;
    border: none;
    margin: 0;
    text-align: start;
  }
`;

export default ReferenceList;
