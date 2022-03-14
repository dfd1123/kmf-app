import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
// https://github.com/wojtekmaj/react-calendar
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { dateFormat, stringToDate } from '@/utils/dateUtils';
import KmfFooter from '@/views/components/layouts/KmfFooter';
import KmfHeader from '@/views/components/layouts/KmfHeader';
import KmfListWrapper from '@/views/components/common/listView/KmfListWrapper';
import KmfLinkedList from '@/views/components/common/listView/KmfLinkedList';
import TileContent from '@/views/components/businessInfo/TileContet';
import useService from '@/hooks/useService';
import { isWithinInterval, sub, eachDayOfInterval } from 'date-fns';

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

const closestNumber = 3;

function BusinessInfo() {
  const locale = 'ko-KR';
  const service = useService();
  const [businesses, setBusinesses] = useState<businessInfoType[]>();
  const [dates, setDates] = useState<string[]>([]);
  const [currentDate, setCurrentDate] = useState(
    dateFormat(new Date(), 'yyyy-MM-dd')
  );
  const formatDate = (calendarLocale: string, date: Date) => {
    return dateFormat(date, 'd');
  };

  const getBusinessData = async () => {
    const { notices, notices_count } =
      await service.business.getBusinessInfoList({
        limit: 100,
        offset: 0,
        no_type: '2',
      });

    const businessInfoDates: string[] = [];
    notices.forEach((item: any) => {
      eachDayOfInterval({
        start: stringToDate(item.no_date_start),
        end: stringToDate(item.no_date_end),
      }).forEach((item) =>
        businessInfoDates.push(dateFormat(item, 'yyyy-MM-dd'))
      );
    });
    setDates(businessInfoDates);

    setBusinesses(
      notices
        .filter(
          (item: businessInfoType) =>
            item.no_date_start.slice(0, 7) === currentDate.slice(0, 7)
        )
        .sort((a: businessInfoType, b: businessInfoType) => {
          if (
            a.no_date_start <= b.no_date_start &&
            a.no_date_end <= b.no_date_end
          )
            return -1;
          if (a.no_date_start > b.no_date_start) return 1;
        })
    );

    // const dateArr = notices.map((item: any) => item.no_date_start);
    // setDates(dateArr);
  };

  const setTileContent = (date: Date, view: string) => {
    const result = dates.filter(
      (item) => dateFormat(date, 'yyyy-MM-dd') === item
    );
    return result.length > 0 ? (
      <div className="tileWrapper">
        {result.map((item, index) => {
          return index > 4 ? null : (
            <TileContent dotColor={color[index]} key={index} />
          );
        })}
      </div>
    ) : null;
  };

  const onDateChange = (value: Date, event: React.ChangeEvent) => {
    setCurrentDate(dateFormat(value, 'yyyy-MM-dd'));
  };

  const onMonthChange = (active: any) => {
    setCurrentDate(dateFormat(active.activeStartDate, 'yyyy-MM-dd'));
  };

  useEffect(() => {
    getBusinessData();
  }, [currentDate]);

  const businessScheduleLists =
    businesses &&
    businesses.map((item: businessInfoType) => {
      const current = stringToDate(currentDate);
      const start = stringToDate(item.no_date_start);
      const end = stringToDate(item.no_date_end);
      const isIn = isWithinInterval(current, {
        start: start,
        end: end,
      });
      const closest = sub(start, { days: closestNumber });
      const isCloseTo = isWithinInterval(current, {
        start: closest,
        end: start,
      });
      const progress = isIn ? '진행중' : '임박';
      return (
        <KmfListWrapper key={item.no_id} className="business-list">
          <KmfLinkedList
            title={item.no_title}
            to={`/notice/${item.no_id}`}
            progress={isIn ? '진행중' : isCloseTo ? '임박' : ''}
            progressColor={isIn ? 'green' : isCloseTo ? 'red' : ''}
          />
        </KmfListWrapper>
      );
    });

  return (
    <ContainerStyle>
      <KmfHeader headerText={'사업안내'} />
      <CalendarWrapperStyle
        locale={locale}
        calendarType="US"
        defaultView="month"
        // maxDetail="year"
        defaultActiveStartDate={stringToDate(
          dateFormat(new Date(), 'yyyy-MM-dd')
        )}
        formatDay={formatDate}
        onChange={onDateChange}
        tileContent={({ date, view }) => setTileContent(date, view)}
        onActiveStartDateChange={onMonthChange}
      />
      <div className="list-holder">
        <CurrentMonthStyle>
          {currentDate.slice(0, 7).replaceAll('-', '.')}
        </CurrentMonthStyle>
        <SupportListWrapperStyle>
          {businessScheduleLists}
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

    > button {
      background-color: #1574bd !important;
    }

    & > * {
      color: white;
    }

    //.react-calendar__navigation__arrow {
    //  font-size: 20px;
    //}

    .react-calendar__navigation__prev2-button,
    .react-calendar__navigation__next2-button {
      display: none;
    }

    .react-calendar__navigation__prev-button {
      order: 1;
      font-size: 30px;

      &:enabled {
        background-color: #1574bd;
      }

      &:active {
        background-color: #59bdff;
      }
    }

    .react-calendar__navigation__next-button {
      font-size: 30px;

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
      display: none;
      flex-direction: row-reverse;
      justify-content: flex-start;
      width: 30px;
      flex-wrap: wrap-reverse;
      padding-top: 4px;
    }

    &.react-calendar__month-view__days__day {
      .tileWrapper {
        display: flex;
      }
    }
  }
`;

const ContainerStyle = styled.div`
  display: flex;
  flex-direction: column;

  .list-holder {
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
  max-height: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 8px 16px;

  .business-list {
    :not(last-child) {
      margin-bottom: 4px;
    }
  }
`;

export default BusinessInfo;
