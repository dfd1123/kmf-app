import useService from '@/hooks/useService';
import {RefrenceDataType} from '@/services/types/Reference';
import FooterButton from '@/views/components/common/FooterButton';
import KmfHeader from '@/views/components/layouts/KmfHeader';
import NoticeHead from '@/views/components/notice/NoticeHead';
import {useState, useEffect} from 'react';
import {useNavigate, useParams} from 'react-router';
import styled from 'styled-components';
import icoDownload from '@/assets/img/kmf/ico/ico-download.svg';

const ReferenceView = () => {
  const navigate = useNavigate();
  const services = useService();
  let {ar_id} = useParams();
  const [info, setInfo] = useState<RefrenceDataType | null>(null);
  const [files, setFiles] = useState([]);
  const [fileList, setFileList] = useState([]);

  const getReference = async () => {
    if (!ar_id || info) return;
    const result = await services.reference.getReferenceDetail({ar_id});
    setFiles(JSON.parse(result.archive.ar_file ?? '[]'));
    const fileList = JSON.parse(result.archive.ar_file ?? '[]').map(
      (filePath: string) => {
        const fileArr = filePath.split('/');
        return fileArr[fileArr.length - 1];
      }
    );

    setInfo(result.archive);
    setFileList(fileList);
  };

  const fileDownload = (index: number) => {
    services.reference.download(files, index);
  };

  useEffect(() => {
    getReference();
  }, []);

  return info ? (
    <ReferenceViewStyle>
      <KmfHeader headerText="자료실" prev />
      <div className="notice-cont">
        <NoticeHead date={info.created_at} title={info.ar_title} />
        <div className="body">
          <div
            className="contents ck-content"
            dangerouslySetInnerHTML={{
              __html: info.ar_content.replace('\n', '<br />')
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
    </ReferenceViewStyle>
  ) : (
    <></>
  );
};

const ReferenceViewStyle = styled.div`
  .notice-cont {
    overflow: hidden;
    padding: 16px;

    .hd {
      .label {
        min-width: 70px;
        margin-right: 8px;
        padding: 4px 13px;
        font-size: 12px;
        line-height: 17px;
        color: #fff;
        text-align: center;
        border-radius: 3px;
        background-color: #28a8e1;
      }

      .date {
        font-size: 12px;
        color: #828282;
        line-height: 17px;
      }

      .title {
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
    }

    .body {
      margin-bottom: 100px;
      padding-top: 16px;
      border-top: 1px solid #f1f1f1;

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
      }

      .files-cont {
        margin-top:16px;
        span {
          display:block;
          margin-bottom:8px;
          font-weight: 400;
          font-size: 12px;
          color:#828282;
          line-height: 17px;
        }
        > li {
          cursor:pointer;
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

export default ReferenceView;
