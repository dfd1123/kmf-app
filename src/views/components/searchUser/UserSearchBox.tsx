import { useState } from 'react';
import styled from 'styled-components';
import { BasicInput } from '@/views/components/common/input/TextInput';
import { useNavigate } from 'react-router';

interface PropsType {
  value?: string;
  search: (text: string) => void;
}

const UserSearchBox = ({ value = '', search }: PropsType) => {
  const [searchValue, setSearchValue] = useState(value);

  const handleSearch = (str: string) => {
    setSearchValue(str);
    search(str);
  }

  return (
    <UserSearchBoxStyle>
      <BasicInput
        name="search"
        type="search"
        value={searchValue}
        reset={true}
        className="search-inp"
        placeholder="회원명, 소속사명, 가수로 검색"
        onInput={handleSearch}
        onEnter={handleSearch}
        // onEnter={search}
      />
    </UserSearchBoxStyle>
  );
};

const UserSearchBoxStyle = styled.div`
  position: sticky;
  top: 0;
  left: 0;
  z-index: 3;
  width: 100%;
  background-color: #1574bd;
  padding: 16px;

  .search-inp {
    width: 100%;
  }
`;

export default UserSearchBox;
