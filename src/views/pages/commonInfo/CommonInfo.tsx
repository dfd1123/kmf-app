import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import KmfFooter from '@/views/components/layouts/KmfFooter';
import KmfHeader from '@/views/components/layouts/KmfHeader';
import { useLocation } from 'react-router-dom';
import useService from '@/hooks/useService';

const loremContent = `Nisi reprehenderit nulla est elit velit adipisicing eu voluptate ut et aute. Culpa sunt velit ipsum nostrud. Cillum ea proident occaecat excepteur eiusmod ad commodo adipisicing adipisicing cillum proident. Ipsum cupidatat fugiat ullamco duis dolore laborum proident reprehenderit sunt amet ex nostrud. Velit excepteur aute aute tempor.\n\n

Minim mollit et fugiat consequat consectetur Lorem nostrud voluptate nisi dolore reprehenderit eu aliquip veniam. Fugiat aliqua cillum mollit dolor exercitation consectetur mollit ea sit deserunt eu fugiat cupidatat. Laboris commodo eiusmod qui deserunt fugiat. Culpa anim aliqua minim amet. Laboris ut consectetur sunt id do sunt. Fugiat non esse velit ad dolore laboris occaecat irure in. Eu aute consectetur occaecat velit.

Ipsum est minim quis ut anim mollit occaecat ipsum Lorem. Labore minim proident id dolore id eiusmod adipisicing Lorem minim quis. Ullamco aliqua ea do aute officia voluptate.

Eu duis ex veniam qui ullamco aute laboris nostrud nisi duis elit veniam tempor. Ea cillum magna sit consequat velit aute ex consectetur officia sit ut laborum id ut. Consectetur mollit reprehenderit magna velit commodo magna mollit deserunt mollit dolor adipisicing. Excepteur elit ipsum officia ipsum nostrud.

Et laboris ut quis proident do ipsum aliqua ex cillum tempor sit dolor. Nostrud elit ullamco commodo aliqua ipsum voluptate incididunt magna dolor cupidatat amet aliqua deserunt labore. Elit non occaecat aliqua id consequat fugiat excepteur incididunt ipsum commodo incididunt excepteur. Nulla veniam eiusmod consectetur laboris aliquip tempor proident ex do culpa laboris amet et. Proident Lorem eu officia aliquip elit Lorem magna dolore. Aute ad labore et commodo commodo dolore esse cupidatat. Amet non deserunt anim commodo.

Et laboris ut quis proident do ipsum aliqua ex cillum tempor sit dolor. Nostrud elit ullamco commodo aliqua ipsum voluptate incididunt magna dolor cupidatat amet aliqua deserunt labore. Elit non occaecat aliqua id consequat fugiat excepteur incididunt ipsum commodo incididunt excepteur. Nulla veniam eiusmod consectetur laboris aliquip tempor proident ex do culpa laboris amet et. Proident Lorem eu officia aliquip elit Lorem magna dolore. Aute ad labore et commodo commodo dolore esse cupidatat. Amet non deserunt anim commodo.

Et laboris ut quis proident do ipsum aliqua ex cillum tempor sit dolor. Nostrud elit ullamco commodo aliqua ipsum voluptate incididunt magna dolor cupidatat amet aliqua deserunt labore. Elit non occaecat aliqua id consequat fugiat excepteur incididunt ipsum commodo incididunt excepteur. Nulla veniam eiusmod consectetur laboris aliquip tempor proident ex do culpa laboris amet et. Proident Lorem eu officia aliquip elit Lorem magna dolore. Aute ad labore et commodo commodo dolore esse cupidatat. Amet non deserunt anim commodo.\n

Mollit sunt in esse nostrud. Amet ullamco deserunt veniam irure occaecat ullamco tempor ullamco exercitation quis in. Proident nulla exercitation adipisicing nisi fugiat. Nostrud consequat excepteur aute id consectetur fugiat occaecat anim ex aliquip deserunt nisi. Officia laborum cillum adipisicing sit cillum mollit adipisicing eiusmod. Id reprehenderit amet voluptate enim eu officia magna ad amet. Veniam dolor et ullamco ea.`;

interface PropTypes {
  content: string;
  headerText: string;
}

const CommonInfo = () => {
  const location = useLocation();
  const services = useService();
  const [header, setHeader] = useState('');
  const [bodyText, setBodyText] = useState('');

  const getSetting = async () => {
    const result = await services.setting.getSetting();
    location.pathname.includes('term')
      ? setHeader('개인정보 수집 및 활용지침')
      : setHeader('서비스 이용약관');
    location.pathname.includes('term')
      ? setBodyText(transformContent(result.setting.use_terms))
      : setBodyText(transformContent(result.setting.service_policy));
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

  useEffect(() => {
    const result = getSetting();
  }, []);

  return (
    <ContainerStyle>
      <KmfHeader headerText={header} prev />
      <ContentWrapperStyle className="contents"
        dangerouslySetInnerHTML={{ __html: bodyText }}></ContentWrapperStyle>
    </ContainerStyle>
  );
};

const ContainerStyle = styled.div`
  display: flex;
  flex-direction: column;
  /* height: 100vh; */

  .contents {


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
`;

const ContentWrapperStyle = styled.section`
  padding: 16px;
  height: calc(100vh - 46px);
  overflow: scroll;
  line-height: 1.5;
`;

export default CommonInfo;
