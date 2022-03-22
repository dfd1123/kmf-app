import { useState } from 'react';
import styled from 'styled-components';
import { BasicInput } from '@/views/components/common/input/TextInput';

interface PropsType {
  value?: string;
  search: (text: string) => void;
}

const SearchBox = ({ value = '', search }: PropsType) => {
  const [searchValue, setSearchValue] = useState(value);

  const handleChange = (str: string) => {
    setSearchValue(str);
    search(str);
  }

  return (
    <SearchBoxStyle>
      <BasicInput
        name="search"
        type="search"
        value={searchValue}
        reset={true}
        className="search-inp"
        placeholder="키워드로 검색"
        onInput={handleChange}
        onEnter={handleChange}
      />
    </SearchBoxStyle>
  );
};

const SearchBoxStyle = styled.div`
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

export default SearchBox;
