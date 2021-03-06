import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import noticeBg from '@/assets/img/kmf/bg/notice-bg-img.jpg';
import kmfLogo from '@/assets/img/kmf/kmf-logo.svg';
import useService from '@/hooks/useService';
import { NoticeInfo, NoticeListResponse } from '@/services/types/Notice';
import { dateFormat } from '@/utils/dateUtils';
import InfiniteScroll from '@/views/components/common/InfiniteScroll';
import KmfListWrapper from '@/views/components/common/listView/KmfListWrapper';
import NoticeHead from '@/views/components/notice/NoticeHead';
import useScrollMove from '@/hooks/useScrollMove';
import KmfFooter from '@/views/components/layouts/KmfFooter';
import BasicInput from '@/views/components/common/input/TextInput';

const NoticeList = () => {
  const services = useService();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [list, setList] = useState<NoticeInfo[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState(
    searchParams.get('searchKeyword') || ''
  );
  const { scrollInfos, scrollRemove } = useScrollMove({
    page: 'notice-list',
    path: '/notice',
  });

  const getNotice = async (offset: number = 0) => {
    if (offset && list.length === totalCount) return;

    const { notices, notices_count }: NoticeListResponse =
      await services.notice.getNoticeList({
        searchKeyword,
        offset,
        limit: 30,
      });

    if (totalCount !== notices_count) setTotalCount(notices_count);
    if (!offset) {
      window.scrollY = 0;
      setList(notices);
    } else setList([...list, ...notices]);
  };

  useEffect(() => {
    getNotice(0);
  }, [searchKeyword]);

  useEffect(() => {
    getNotice(list.length);
  }, []);

  useEffect(() => {
    if (scrollInfos) {
      if (window.isBack) {
        window.scrollTo(0, scrollInfos);
      } else {
        scrollRemove();
      }
      const scrollTop = Math.max(
        document.documentElement.scrollTop,
        document.body.scrollTop
      );
      //??????????????? ??????????????? ?????????
      if (scrollTop == scrollInfos) {
        scrollRemove();
        window.isBack = false;
      }
    } else window.isBack = false;

    //????????? ????????? fetching ????????? ???????????? ????????????.
  }, [scrollInfos, scrollRemove, list]);

  return (
    <NoticeListStyle>
      <div className="noti-hd">
        <div className="logo"></div>
        {list[0] ? (
          <Link to={`/notice/${list[0].no_id}`}>
            <div className="first-noti">
              <h2 className="tit">{list[0].no_title}</h2>
              <span className="date">
                {dateFormat(new Date(list[0].created_at), 'yyyy - MM- dd')}
              </span>
            </div>
          </Link>
        ) : (
          ''
        )}
      </div>
      <div className="list-holder">
        <div className="search-box">
          <BasicInput
            name="search"
            type="search"
            value={searchKeyword}
            reset={true}
            className="search-inp"
            placeholder="???????????? ??????"
            onInput={setSearchKeyword}
            onEnter={() => getNotice(0)}
          />
        </div>
        <InfiniteScroll loadMore={() => getNotice(list.length)}>
          {list.map((notice) => (
            <KmfListWrapper key={notice.no_id} className="no-list">
              <Link to={`/notice/${notice.no_id}`}>
                <NoticeHead
                  id={notice.no_id}
                  type={notice.no_type}
                  title={notice.no_title}
                  date={notice.created_at}
                />
              </Link>
            </KmfListWrapper>
          ))}
        </InfiniteScroll>
      </div>
      <KmfFooter />
    </NoticeListStyle>
  );
};

const NoticeListStyle = styled.div`
  padding-bottom: 70px;
  .noti-hd {
    position: relative;
    height: 250px;
    padding: 16px;
    background-image: url(${noticeBg});
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;

    .logo {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      width: 100%;
      height: 46px;
      background-color: rgba(53, 53, 53, 0.5);
      background-image: url(${kmfLogo});
      background-repeat: no-repeat;
      background-size: 66px;
      background-position: center;
    }

    .first-noti {
      position: absolute;
      bottom: 0;
      left: 0;
      z-index: 1;
      width: 100%;
      padding: 16px;

      .tit {
        font-size: 21px;
        font-weight: 600;
        color: #fff;
        line-height: 30px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        word-wrap: break-word;
      }

      .date {
        margin-top: 4px;
        font-size: 12px;
        color: #fff;
      }
    }
  }

  .list-holder {
    padding: 0 16px;
    margin-bottom: 20px;

    .search-box {
      > div {
        width: 100%;
        margin: 16px 0;
      }
    }

    .no-list {
      padding-top: 16px;
      padding-bottom: 0;
      background-position: right center;
      border-bottom: 1px solid #f1f1f1;
      &:nth-last-child(2) {
        border-bottom: none;
      }
    }
  }
`;

export default NoticeList;
