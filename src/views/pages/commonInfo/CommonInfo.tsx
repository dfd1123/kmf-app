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
      ? setBodyText(result.setting.use_terms)
      : setBodyText(result.setting.service_policy);
  };

  useEffect(() => {
    const result = getSetting();
  }, []);

  return (
    <ContainerStyle>
      <KmfHeader headerText={header} prev />
      <ContentWrapperStyle
        dangerouslySetInnerHTML={{ __html: bodyText }}></ContentWrapperStyle>
    </ContainerStyle>
  );
};

const ContainerStyle = styled.div`
  display: flex;
  flex-direction: column;
  /* height: 100vh; */
`;

const ContentWrapperStyle = styled.section`
  padding: 16px;
  height: calc(100vh - 46px);
  overflow: scroll;
  font-size: 14px;
  line-height: 20px;
`;

export default CommonInfo;
