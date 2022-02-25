import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
// https://github.com/wojtekmaj/react-calendar
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { dateFormat } from '@/utils/dateUtils';
import KmfFooter from '@/views/components/layouts/KmfFooter';
import KmfHeader from '@/views/components/layouts/KmfHeader';
import KmfListWrapper from '@/views/components/common/listView/KmfListWrapper';
import KmfLinkedList from '@/views/components/common/listView/KmfLinkedList';
import TileContent from '@/views/components/businessInfo/TileContet';
import useService from '@/hooks/useService';

const color = ['#1574BD', '#A7CD10', '#828282', '#1574BD', '#A7CD10'];

interface businessInfoType {
  created_at: '';
  deleted: 0;
  no_content: '';
  no_date_end: '';
  no_date_start: '';
  no_file: null;
  no_hit: 0;
  no_id: 0;
  no_title: '';
  no_type: 0;
  updated_at: '';
}

function BusinessInfo() {
  const locale = 'ko-KR';
  const service = useService();
  const [businesses, setBusinesses] = useState<businessInfoType[]>();
  const [dates, setDates] = useState<string[]>([]);
  const [currentDate, setCurrentDate] = useState(dateFormat(new Date(), 'yyyy-MM-dd'));
  const formatDate = (calendarLocale: string, date: Date) => {
    return dateFormat(date, 'd');
  };

  const stringToDate = (date: string) => {
    const dateArr = date.split('-');
    return new Date(parseInt(dateArr[0]), parseInt(dateArr[1]), parseInt(dateArr[2]));
  }

  const getBusinessData = async () => {
    const { notices, notices_count } =
      await service.business.getBusinessInfoList({
        limit: 30,
        offset: 0,
        no_type: '2',
      });
    setBusinesses(notices);
    const dateArr = notices.map((item: any) => item.no_date_start);
    setDates(dateArr);
  };

  const setTileContent = (date: Date, view: string) => {
    const result = dates.filter(
      (item) => dateFormat(date, 'yyyy-MM-dd') === item
    );
    return result.length > 0 ? (
      <div className="tileWrapper">
        {result.map((item, index) => {
          return index > 4 ? null : <TileContent dotColor={color[index]} key={index} />;
        })}
      </div>
    ) : null;
  };

  const onDateChange = (value: Date, event: React.ChangeEvent) => {
    console.log('date changed',value, event)
    setCurrentDate(dateFormat(value, 'yyyy-MM-dd'))
  }

  const onMonthChange = (active: any) => {
    console.log('month changed', dateFormat(active.activeStartDate, 'yyyy-MM-dd'));
    setCurrentDate(dateFormat(active.activeStartDate, 'yyyy-MM-dd'));
  }

  useEffect(() => {
    getBusinessData();
  }, [currentDate]);

  return (
    <ContainerStyle>
      <KmfHeader headerText={'사업안내'} />
      <CalendarWrapperStyle
        locale={locale}
        calendarType="US"
        defaultView="month"
        maxDetail="month"
        view="month"
        defaultActiveStartDate={stringToDate(dateFormat(new Date(), 'yyyy-MM-dd'))}
        formatDay={formatDate}
        onChange={onDateChange}
        tileContent={({ date, view }) => setTileContent(date, view)}
        onActiveStartDateChange={onMonthChange}
      />
      <div className="list-holder">
      <CurrentMonthStyle>{currentDate.slice(0, 7).replaceAll('-', '.')}</CurrentMonthStyle>
        <SupportListWrapperStyle>
          {businesses &&
            businesses.map((item: businessInfoType) => {
              return (
                <KmfListWrapper key={item.no_id}>
                  <KmfLinkedList
                    title={item.no_title}
                    to={`/notice/${item.no_id}`}
                  />
                </KmfListWrapper>
              );
            })}
        </SupportListWrapperStyle>
      </div>
      <KmfFooter />
    </ContainerStyle>
  );
}

const CalendarWrapperStyle = styled(Calendar)`
  width: 100%;
  border: none;
  .react-calendar__navigation {
    background-color: #1574bd;

    & > * {
      color: white;
    }

    .react-calendar__navigation__prev2-button,
    .react-calendar__navigation__next2-button {
      display: none;
    }

    .react-calendar__navigation__prev-button {
      order: 1;

      &:enabled {
        background-color: #1574bd;
      }

      &:active {
        background-color: #59bdff;
      }
    }

    .react-calendar__navigation__next-button {
      &:enabled {
        background-color: #1574bd;
      }

      &:active {
        background-color: #59bdff;
      }

      order: 2;
      margin-right: 6px;
    }

    .react-calendar__navigation__label {
      text-align: start;
      padding-left: 24px;
    }
  }

  .react-calendar__viewContainer {
    /* padding: 0 2px; */
  }

  .react-calendar__tile--now {
    background-color: #a7d6ff;
  }

  & .react-calendar__tile {
    height: 50px;
    display: flex;
    flex-direction: column;
    align-items: center;

    .tileWrapper {
      display: flex;
      flex-direction: row-reverse;
      justify-content: flex-start;
      width: 30px;
      flex-wrap: wrap-reverse;
      padding-top: 4px;
    }
  }
`;

const ContainerStyle = styled.div`
  display: flex;
  flex-direction: column;

  .list-holder{
    position: sticky;
    top: 30px;
    left: 0;
    z-index: 2;
    background: #fff;
  }
`;

const CurrentMonthStyle = styled.div`
      width: 100%;
    padding: 12px 20px;
    border-top: 2px solid #eeeeee;
    border-bottom: 1px solid #eee;
    position: sticky;
    top: 45px;
    left: 0;
    z-index: 1;
    background-color: #fff;
`;

const SupportListWrapperStyle = styled.ul`
  /* overflow-y: auto; */
  max-height: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 8px 16px;
`;

export default BusinessInfo;
