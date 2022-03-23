import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { RefrenceDataType } from '@/services/types/Reference';
import { dateFormat } from '@/utils/dateUtils';
import useService from '@/hooks/useService';
import useScrollMove from '@/hooks/useScrollMove';
import KmfListWrapper from '@/views/components/common/listView/KmfListWrapper';
import KmfFooter from '@/views/components/layouts/KmfFooter';
import KmfHeader from '@/views/components/layouts/KmfHeader';
import SearchBox from '@/views/components/referenceRoom/SearchBox';
import ReferenceList from '@/views/components/referenceRoom/ReferenceList';
import { useNavigate, useSearchParams } from 'react-router-dom';
import InfiniteScroll from '@/views/components/common/InfiniteScroll';

const ReferenceRoom = () => {
  const services = useService();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [list, setList] = useState<RefrenceDataType[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState(
    searchParams.get('searchKeyword') || ''
  );
  const { scrollInfos, scrollRemove } = useScrollMove({
    page: 'ref-list',
    path: '/ref',
  });

  const getRefList = async (offset: number = 0) => {
    if (offset && list.length === totalCount && offset) return;

    const { archives, archives_count } =
      await services.reference.getReferenceList({
        searchKeyword,
        limit: 30,
        offset: 0,
      });

    if (totalCount !== archives_count) setTotalCount(archives_count);
    if (!offset) {
      window.scrollY = 0;
      setList(archives);
    } else setList([...list, ...archives]);
  };

  useEffect(() => {
    navigate(`/ref?searchKeyword=${searchKeyword}`, { replace: true });
    getRefList(0);
  }, [searchKeyword]);

  useEffect(() => {
    getRefList(list.length);
  }, []);

  useEffect(() => {
    if (scrollInfos) {
      if(window.isBack){
        window.scrollTo(0, scrollInfos);
      }else{
        scrollRemove();
      }
      const scrollTop = Math.max(
        document.documentElement.scrollTop,
        document.body.scrollTop
      );
      //현재위치와 복구위치가 같다면
      if (scrollTop == scrollInfos) {
        scrollRemove();
        window.isBack = false;
      }
    } else window.isBack = false;
    //의존성 배열에 fetching 해오는 데이터를 넣어준다.
  }, [scrollInfos, scrollRemove, list]);

  return (
    <ReferenceRoomStyle>
      <KmfHeader headerText="자료실" />
      <SearchBox value={searchKeyword} search={setSearchKeyword} />
      <span className="item-cnt">총 {list.length} 건</span>
      <div className="list-holder">
        <InfiniteScroll loadMore={() => getRefList(list.length)}>
          {list.map((item) => (
              <ReferenceList key={`ref-${item.ar_id}`} info={item} />
          ))}
        </InfiniteScroll>
      </div>
      <KmfFooter />
    </ReferenceRoomStyle>
  );
};

const ReferenceRoomStyle = styled.div`
  overflow: hidden;

  .item-cnt {
    display: block;
    width: 100%;
    height: 22px;
    font-size: 12px;
    margin: 20px 16px 0px 16px;
    color: #828282;
  }

  .list-holder {
    margin-bottom: 100px;
    > div {
      width: calc(100% - 32px);
      margin: 0 auto;
      border-bottom: 1px solid #f1f1f1;
      background-image: none;
    }
  }
`;

export default ReferenceRoom;
