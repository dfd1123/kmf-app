import useService from '@/hooks/useService';
import { RefrenceDataType } from '@/services/types/Reference';
import FooterButton from '@/views/components/common/FooterButton';
import KmfHeader from '@/views/components/layouts/KmfHeader';
import NoticeHead from '@/views/components/notice/NoticeHead';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import styled from 'styled-components';
import icoDownload from '@/assets/img/kmf/ico/ico-download.svg';

const ReferenceView = () => {
  const navigate = useNavigate();
  const services = useService();
  let { ar_id } = useParams();
  const [info, setInfo] = useState<RefrenceDataType | null>(null);
  const [files, setFiles] = useState([]);
  const [fileList, setFileList] = useState([]);

  const getReference = async () => {
    if (!ar_id || info) return;
    const result = await services.reference.getReferenceDetail({ ar_id });
    setFiles(JSON.parse(result.archive.ar_file ?? '[]'));
    const fileList = JSON.parse(result.archive.ar_file ?? '[]').map((filePath: string) => {
      const fileArr = filePath.split('/');
      return fileArr[fileArr.length - 1];
    });

    setInfo(result.archive);
    setFileList(fileList);
  };

  const fileDownload = (index: number) => {
    services.reference.download(files, index);
  }

  useEffect(() => {
    getReference();
  }, []);

  return info ? (
    <ReferenceViewStyle>
      <KmfHeader headerText="자료실" prev />
      <div className="notice-cont">
        <NoticeHead
          date={info.created_at}
          title={info.ar_title}
        />
        <div className="body">
        {fileList.length ? (
          <ul className="files-cont">
          {fileList.map((file, index) => (
            <li key={file} onClick={() => fileDownload(index)}>
              {file}
            </li>
          ))}
        </ul>
        ) : ('')}
          <div
            className="contents ck-content"
            dangerouslySetInnerHTML={{
              __html: info.ar_content.replace('\n', '<br />'),
            }}></div>
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
      padding-top: 16px;
      border-top: 1px solid #f1f1f1;
      
      .files-cont{
        background: #f9f9f9;
        padding: 15px 15px;
        margin-bottom: 20px;

        >li{
          padding-right: 20px;
          font-size: 13px;
          color: #555;
          margin-bottom: 10px;
          background-image: url(${icoDownload});
          background-repeat: no-repeat;
          background-position: right center;
          background-size: 12px;

          &:last-child{
            margin-bottom:0;
          }
        }
      }

      .contents {
        min-height: 100px;
        padding: 8px;
        background: #f9f9f9;
        border-radius: 5px;
        /* font-size: 12px; */
        line-height: 1.5;

        p {
          word-break: break-all;
        }


        a {
          /* font-size: 12px; */
          color: #1574bd;
          text-decoration: underline;
        }

        img{
          max-width:100%;
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
