import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import styled from 'styled-components';
import FooterButton from '@/views/components/common/FooterButton';
import KmfHeader from '@/views/components/layouts/KmfHeader';
import useService from '@/hooks/useService';
import NoticeHead from '@/views/components/notice/NoticeHead';
import { NoticeInfo } from '@/services/types/Notice';
import icoDownload from '@/assets/img/kmf/ico/ico-download.svg';

const NoticeView = () => {
  const navigate = useNavigate();
  const services = useService();
  let { no_id } = useParams();
  const [info, setInfo] = useState<NoticeInfo | null>(null);
  const [noticeType, setNoticeType] = useState('');
  const [files, setFiles] = useState([]);
  const [fileList, setFileList] = useState([]);

  const getNotice = async () => {
    if (!no_id || info) return;
    const result = await services.notice.getNoticeInfo({ no_id });
    setFiles(JSON.parse(result.notice.no_file ?? '[]'));

    const fileList = JSON.parse(result.notice.no_file ?? '[]').map(
      (filePath: string) => {
        const fileArr = filePath.split('/');
        return fileArr[fileArr.length - 1];
      }
    );

    result.notice.no_content = transformContent(result.notice.no_content);

    setInfo(result.notice);
    setFileList(fileList);

    switch (result.notice.no_type) {
      case 1:
        setNoticeType('공지사항');
        break;
      case 2:
        setNoticeType('사업안내');
        break;
      case 3:
        setNoticeType('경조사');
        break;
    }
  };

  const transformContent = (htmlContent: string) :string => {
    const oembed = htmlContent.split('</oembed>');
    let body = '';
    oembed.forEach((item, index) => {
      body += oembed[index] + '</oembed>';
      const oembed1 = item.split('url="')[1];
      if (oembed1) {
        const oembed2 = oembed1.split('">')[0];
        if (oembed2) {
          const youtube = oembed2.split('https://www.youtube.com/watch?v=')[1] || oembed2.split('https://youtu.be/')[1];
          if (youtube) {
            body += '<div class="iframe-container"><iframe src="https://youtube.com/embed/' + youtube + '" frameborder="0"; scrolling="no"; allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>';
          }
        }
      }
    });
    return body.replace('\n', '<br />');
  }

  const fileDownload = (index: number) => {
    services.reference.download(files, JSON.parse(info?.no_filename ?? '[]'), index);
  };

  useEffect(() => {
    getNotice();
  }, []);

  return info ? (
    <NoticeViewStyle>
      <KmfHeader headerText={noticeType} prev />
      <div className="notice-cont">
        <NoticeHead
          type={info.no_type}
          date={info.created_at}
          title={info.no_title}
        />
        {info.no_type !== 1 && (
          <div className="date-range">
            <span>진행기간</span>
            <p>
              {info.no_date_start} ~ {info.no_date_end}
            </p>
          </div>
        )}
        <div className="body">
          <div
            className="contents ck-content"
            dangerouslySetInnerHTML={{
              __html: info.no_content.replace('\n', '<br />'),
            }}></div>
          {fileList.length ? (
            <ul className="files-cont">
              <span>첨부파일</span>
              {fileList.map((file, index) => (
                <li key={file} onClick={() => fileDownload(index)}>
                  {file}
                </li>
              ))}
            </ul>
          ) : (
            ''
          )}
          <span>KMF 화이팅!</span>
        </div>
      </div>
      <FooterButton shared onClick={() => navigate(-1)}>
        목록으로
      </FooterButton>
    </NoticeViewStyle>
  ) : (
    <></>
  );
};

const NoticeViewStyle = styled.div`
  .notice-cont {
    overflow: hidden;
    padding: 16px;

    .label {
      min-width: 70px;
      margin-right: 8px;
      padding: 4px 13px;
      font-size: 12px;
      line-height: 17px;
      color: #fff;
      text-align: center;
      border-radius: 3px;
    }

    .date {
      font-size: 12px;
      color: #828282;
      line-height: 17px;
    }

    .title {
      margin-bottom: 16px;
      border-bottom: 1px solid #f1f1f1;
      padding-top: 8px;
      padding-bottom: 16px;
      font-size: 14px;
      line-height: 20px;
      color: #353535;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      word-wrap: break-word;
    }

    .date-range {
      padding: 10px 13px;
      background-color: rgba(21, 116, 189, 0.05);
      border-radius: 5px;

      > span {
        font-size: 12px;
        font-weight: 400;
        color: #828282;
      }

      > p {
        margin-top: 5px;
        font-size: 14px;
        font-weight: 700;
        color: #000;
      }
    }

    .body {
      margin-bottom: 100px;
      padding-top: 16px;
      .contents {
        min-height: 100px;
        padding: 8px;
        background: #f9f9f9;
        border-radius: 5px;
        /* font-size: 12px; */
        line-height: 1.5;

        h1,
        h2,
        h3,
        h4,
        h5,
        h6,
        .h1,
        .h2,
        .h3,
        .h4,
        .h5,
        .h6 {
          font-family: inherit;
          font-weight: 600;
          line-height: 1.5;
          margin-bottom: 0.5rem;
          color: #32325d;
        }

        h2,
        .h2 {
          font-size: 1.25rem;
        }

        h3,
        .h3 {
          font-size: 1.0625rem;
        }

        h4,
        .h4 {
          font-size: 0.9375rem;
        }

        p {
          margin-top: 0;
          margin-bottom: 1rem;
          font-size: 1rem;
          font-weight: 400;
          line-height: 1.7;
        }

        a {
          /* font-size: 12px; */
          color: #1574bd;
          text-decoration: underline;
        }

        .text-huge {
          font-size: 1.8em;
        }

        .text-big {
          font-size: 1.4em;
        }

        .text-small {
          font-size: 0.85em;
        }

        .text-tiny {
          font-size: 0.7em;
        }

        img {
          max-width: 100%;
        }

        ol,
        ul,
        dl {
          margin-top: 0;
          margin-bottom: 1rem;
        }

        ol {
          display: block;
          list-style-type: decimal;
          margin-block-start: 1em;
          margin-block-end: 1em;
          margin-inline-start: 0px;
          margin-inline-end: 0px;
          padding-inline-start: 40px;
        }

        ul {
          display: block;
          list-style-type: disc;
          margin-block-start: 1em;
          margin-block-end: 1em;
          margin-inline-start: 0px;
          margin-inline-end: 0px;
          padding-inline-start: 40px;
        }

        .ck-content blockquote {
          overflow: hidden;
          padding-right: 1.5em;
          padding-left: 1.5em;
          margin-left: 0;
          margin-right: 0;
          font-style: italic;
          border-left: 5px solid #ccc;
        }

        .ck-editor__editable .ck-horizontal-line {
            display: flow-root;
        }

        iframe{
          width:100%;
        }
      }

      .files-cont {
        margin-top: 16px;
        span {
          display: block;
          margin-bottom: 8px;
          font-weight: 400;
          font-size: 12px;
          color: #828282;
          line-height: 17px;
        }
        > li {
          cursor: pointer;
          background: rgba(21, 116, 189, 0.05);
          padding: 16px 15px;
          margin-bottom: 20px;
          padding-right: 35px;
          font-size: 14px;
          color: #353535;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-bottom: 10px;
          background-image: url(${icoDownload});
          background-repeat: no-repeat;
          background-position: calc(100% - 10px) center;
          background-size: 20px;
          border-radius: 5px;

          &:last-child {
            margin-bottom: 0;
          }
        }
      }

      > span {
        display: block;
        margin-top: 32px;
        font-size: 12px;
        line-height: 17px;
        text-align: center;
        color: #bfbfbf;
      }
    }
  }
`;

export default NoticeView;
