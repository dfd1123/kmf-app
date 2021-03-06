import { useEffect, useState } from 'react';
import KmfHeader from '@/views/components/layouts/KmfHeader';
import UserSearchBox from '@/views/components/searchUser/UserSearchBox';
import { ButtonCheckBox } from '@/views/components/common/input/CheckBox';
import styled from 'styled-components';
import UserList from '@/views/components/searchUser/UserList';
import KmfFooter from '@/views/components/layouts/KmfFooter';
import useService from '@/hooks/useService';
import useScrollMove from '@/hooks/useScrollMove';
import { GetUserListResponse, UserListInfo } from '@/services/types/User';
import InfiniteScroll from '@/views/components/common/InfiniteScroll';
import { useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';

const SearchUser = () => {
  const services = useService();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [list, setList] = useState<UserListInfo[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState(searchParams.get('searchKeyword') || '');
  const [orderBy, setOrderBy] = useState(searchParams.get('orderBy') || 'name');
  const { scrollInfos, scrollRemove } = useScrollMove({
    page: 'search-user',
    path: '/search/user',
  });

  const getUserList = async (offset: number = 0, orderBy: string) => {
    if (offset && list.length === totalCount && offset) return;

    const { users, users_count }: GetUserListResponse =
      await services.user.getUserList({
        searchKeyword,
        orderBy,
        limit: 100,
        offset,
      });

    if (totalCount !== users_count) setTotalCount(users_count);
    if (!offset) {
      window.scrollY = 0;
      setList(users);
    } else setList([...list, ...users]);
  };

  // 일단 SearchBox에서 onChange 이벤트가 발생할때마다 검색되도록 했습니다.
  const onChange = async (keyword: string) => {
    setSearchKeyword(keyword);
  };

  useEffect(() => {
    getUserList(list.length, orderBy);
  }, []);

  useEffect(() => {
    navigate(`/search/user?searchKeyword=${searchKeyword}&orderBy=${orderBy}`, {replace: true});
    getUserList(0, orderBy);
  }, [searchKeyword, orderBy]);

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
    <SearchUserStyle>
      <KmfHeader headerText="회원검색" />
      <UserSearchBox value={searchKeyword} search={onChange} />
      <div className="cont">
        <div className="control-box">
          <span className="total-cnt">
            총 <em>{totalCount}</em>명
          </span>
          <div className="order-by">
            <ButtonCheckBox
              type="radio"
              label="기수순"
              name="orderBy"
              value="cardinal_num"
              data={orderBy}
              onChange={setOrderBy}
            />
            <ButtonCheckBox
              type="radio"
              label="이름순"
              name="orderBy"
              value="name"
              data={orderBy}
              onChange={setOrderBy}
            />
          </div>
        </div>
        <div className="list-holder">
          <InfiniteScroll loadMore={() => getUserList(list.length, orderBy)}>
            {list.length > 0 ? (
              list.map((user, index) => (
                <UserList
                  onClick={() => {
                    navigate(`/user/${user.id}`);
                  }}
                  key={`${user.id}-${index}`}
                  user={user}
                />
              ))
            ) : (
              <div className="no-user">검색 결과가 없습니다.</div>
            )}
          </InfiniteScroll>
        </div>
      </div>
      <KmfFooter />
    </SearchUserStyle>
  );
};

const SearchUserStyle = styled.div`
  padding-bottom: 100px;

  .cont {
    padding: 16px;
  }

  .control-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    .total-cnt {
      font-size: 12px;
      color: #353535;

      > em {
        color: #1574bd;
      }
    }

    .order-by {
      ${ButtonCheckBox} {
        margin-left: 8px;
        input {
          &:checked {
            ~ label {
              color: #fff;
              background-color: #828282;
            }
          }
        }

        label {
          width: auto;
          height: auto;
          padding: 4px 8px;
          margin-left: 0;
          font-size: 10px;
          color: #828282;
          line-height: 15px;
          background-color: transparent;
          border-radius: 3px;
        }
      }
    }
  }

  .no-user {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 8px;
    padding: 8px;
    background-color: #e8e8e8;
    color: #818181;
    box-shadow: 0px 2px 4px rgba(167, 205, 16, 0.15);
    border-radius: 5px;
    height: 79px;
  }
`;

export default SearchUser;
