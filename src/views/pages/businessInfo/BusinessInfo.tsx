import React, { useEffect, useRef, useState } from 'react';
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
import {
  isWithinInterval,
  add,
  sub,
  eachDayOfInterval,
  addMonths,
  subMonths,
  endOfMonth,
  startOfMonth,
  isBefore,
  isAfter,
} from 'date-fns';
import { useParams, useLocation, useNavigate } from 'react-router';
import businessInfo from '@/router/businessInfo';
import arrowImg from '@/assets/img/kmf/kmfArrow.png';

const ddd = styled.div`
  color: #a7cd10;
  color: #828282;
`;

const color = [
  '#828282',
  '#1574BD',
  '#A7CD10',
  '#828282',
  '#1574BD',
  '#A7CD10',
];

interface calendarContentPropsType {
  type: number;
  date: string;
}

interface calendarContentDatesPropsType {
  contents: calendarContentPropsType[];
}

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
  dates?: string[];
}

const closestNumber = 3;

function BusinessInfo() {
  const locale = 'ko-KR';
  const service = useService();
  const [businessData, setBusinessData] = useState<businessInfoType[]>();
  const [currentDate, setCurrentDate] = useState(
    dateFormat(new Date(), 'yyyy-MM-dd')
  );
  const navigate = useNavigate();
  const location = useLocation();
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const formatDate = (calendarLocale: string, date: Date) => {
    return dateFormat(date, 'd');
  };

  const getBusinessData = async () => {
    const { notices, notices_count } =
      await service.business.getBusinessInfoList({
        limit: 100,
        offset: 0,
      });

    const businessAllDateResult = notices
      .filter((item: businessInfoType) => String(item.no_type) !== String(1))
      .filter((item: businessInfoType) => {
        const current = stringToDate(currentDate);
        return isWithinInterval(current, {
          start: startOfMonth(current),
          end: endOfMonth(current),
        });
      })
      .map((item: any) => {
        const dates = eachDayOfInterval({
          start: stringToDate(
            item.no_date_start ? item.no_date_start : '1970-01-01'
          ),
          end: stringToDate(item.no_date_end ? item.no_date_end : '1970-01-01'),
        }).map((item) => dateFormat(item, 'yyyy-MM-dd'));
        const result = item;
        result.dates = dates;
        return result;
      });
    setBusinessData(businessAllDateResult);
  };

  const setTileContent = (date: Date, view: string) => {
    const dataResult = businessData
      ? businessData
          .filter((item: businessInfoType) => {
            return item && item.dates?.includes(dateFormat(date, 'yyyy-MM-dd'));
          })
          .map((item: businessInfoType) => {
            const current = dateFormat(date, 'yyyy-MM-dd');
            const currentData: any = {};
            if (!currentData.hasOwnProperty(current)) {
              currentData[current] = [];
              currentData[current].push(item.no_type);
            } else {
              currentData[current].push(item.no_type);
            }
            return currentData;
          })
      : null;

    return dataResult ? (
      dataResult.length > 0 ? (
        <div className="tileWrapper">
          {dataResult.map((item, index) => {
            return index > 5 ? null : (
              <TileContent
                dotColor={color[item[dateFormat(date, 'yyyy-MM-dd')][0]]}
                key={index}
              />
            );
          })}
        </div>
      ) : null
    ) : null;
  };

  const setPrevMonth = () => {
    const prevMonth = dateFormat(
      subMonths(stringToDate(currentDate), 1),
      'yyyy-MM-dd'
    );
    // location.search = `/info?date=${currentDate}`;
    setCurrentDate(prevMonth);
    getBusinessData();
    const el = document.querySelector(
      '.react-calendar__navigation__prev-button'
    );
    el?.dispatchEvent(new Event('click', { bubbles: true }));
  };

  const setNextMonth = () => {
    const nextMonth = dateFormat(
      addMonths(stringToDate(currentDate), 1),
      'yyyy-MM-dd'
    );
    // location.search = `/info?date=${currentDate}`;
    setCurrentDate(nextMonth);
    getBusinessData();
    const el = document.querySelector(
      '.react-calendar__navigation__next-button'
    );
    el?.dispatchEvent(new Event('click', { bubbles: true }));
  };

  const onDateChange = (value: Date, event: React.ChangeEvent) => {
    const date = dateFormat(value, 'yyyy-MM-dd');
    setCurrentDate(date);
    navigate(`/info?date=${date}`);
  };

  useEffect(() => {
    if (!location.search) {
      const date = dateFormat(new Date());
      location.search = `/info?date=${date}`;
      setCurrentDate(date);
    } else {
      const date = location.search.split('=')[1];
      setCurrentDate(date);
    }
  }, []);

  const onMonthChange = (active: any) => {
    setCurrentDate(dateFormat(active.activeStartDate, 'yyyy-MM-dd'));
    getBusinessData();
    navigate(`/info?date=${dateFormat(active.activeStartDate)}`);
  };

  useEffect(() => {
    getBusinessData();
  }, [currentDate]);

  const onScrollClick = () => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const businessScheduleLists =
    businessData &&
    businessData.map((item: businessInfoType) => {
      const current = stringToDate(currentDate);
      const nowDate = new Date();
      const start = startOfMonth(current);
      const end = endOfMonth(current);
      const isInInterval = (date: string) => {
        return isWithinInterval(stringToDate(date), { start: start, end: end });
      };
      const isIn = item.dates ? item.dates.some(isInInterval) : false;
      if (!isIn) return;
      const onGoing = isWithinInterval(nowDate, {
        start: stringToDate(item.no_date_start),
        end: stringToDate(item.no_date_end),
      });
      const planned = sub(stringToDate(item.no_date_start), { days: 7 });
      const isPlannedTo =
        isBefore(planned, stringToDate(item.no_date_start)) &&
        isWithinInterval(nowDate, {
          start: planned,
          end: stringToDate(item.no_date_start),
        });
      // console.log(
      //   // currentDate, dateFormat(nowDate),
      // );

      const endPlusOne = add(stringToDate(item.no_date_end), {
        days: 1,
      });
      const closest = sub(endPlusOne, { days: 3 });
      const isClosestTo = isWithinInterval(nowDate, {
        start: closest,
        end: endPlusOne,
      });

      return (
        <KmfListWrapper key={item.no_id} className="business-list">
          <KmfLinkedList
            title={item.no_title}
            to={`/notice/${item.no_id}`}
            progress={
              isClosestTo && onGoing
                ? '임박'
                : onGoing
                ? '진행중'
                : isPlannedTo
                ? '예정'
                : ''
            }
            progressColor={
              isClosestTo && onGoing
                ? 'red'
                : onGoing
                ? 'green'
                : isPlannedTo
                ? '#1b83bd'
                : ''
            }
            paddingRight={
              onGoing || isPlannedTo || isClosestTo ? '75px' : '24px'
            }
          />
        </KmfListWrapper>
      );
    });

  return (
    <ContainerStyle>
      <div ref={scrollRef} />
      <KmfHeader headerText={'캘린더'} />
      <CalendarWrapperStyle
        locale={locale}
        calendarType="US"
        defaultView="month"
        value={stringToDate(currentDate)}
        // defaultActiveStartDate={stringToDate(currentDate)}
        formatDay={formatDate}
        onChange={onDateChange}
        tileContent={({ date, view }) => setTileContent(date, view)}
        onActiveStartDateChange={onMonthChange}
      />
      <div className="list-holder">
        <CurrentMonthStyle onClick={onScrollClick}>
          {currentDate.slice(0, 7).replaceAll('-', '.')}
          <div className="month-change">
            <ArrowBtn
              className="month-change_prev"
              revert={false}
              onClick={setPrevMonth}
            />
            <ArrowBtn
              className="month-change_next"
              revert
              onClick={setNextMonth}
            />
          </div>
        </CurrentMonthStyle>
        <SupportListWrapperStyle>
          {businessScheduleLists?.some((item) => item) ? (
            businessScheduleLists
          ) : (
            <NoList>일정이 없습니다.</NoList>
          )}
        </SupportListWrapperStyle>
      </div>
      <KmfFooter />
    </ContainerStyle>
  );
}

const NoList = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  //height: 100%;
  padding-top: 48px;
  padding-bottom: 48px;
`;

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
    top: 30px;
    left: 0;
    z-index: 2;
    margin-bottom: 70px;
    background: #fff;
    scroll-behavior: smooth;
    height: 100%;
  }
`;

const CurrentMonthStyle = styled.div`
  width: 100%;
  padding: 24px 15px 24px 20px;
  border-top: 2px solid #eeeeee;
  border-bottom: 1px solid #eee;
  position: sticky;
  top: 45px;
  left: 0;
  z-index: 1;
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  color: #1574bd;

  .month-change {
    display: flex;
    width: 48px;
    justify-content: space-between;
    align-items: center;
    padding-right: 8px;
  }
`;

const ArrowBtn = styled.button<{ revert: boolean }>`
  background-image: url(${arrowImg});
  width: 7px;
  height: 10px;
  background-size: 7px;
  //background-size: 14px;
  background-repeat: no-repeat;
  background-position: center;
  transform: ${(props) => (props.revert ? 'scaleX(-1)' : '')};
  border: none;
  object-fit: contain;

  &:hover {
    // background-color: #000;
  }
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
