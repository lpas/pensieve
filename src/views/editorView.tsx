import React from 'react';
import styled from 'styled-components';
import { DATA1, HEADER } from '../dummy_data/data1';
import { Data, DataWrapper } from './data';
import { Editor } from './editor';
import { SuccessIcon } from './icons';

// todo option to run all queries?

export const EditorView: React.FC = () => {
  return (
    <Wrapper>
      <Editor />
      <ButtonLine>
        <RunButton>Run</RunButton>
      </ButtonLine>
      <DataWrapper>
        <Data data={DATA1} header={HEADER} />
      </DataWrapper>
      <NotificationBar>
        <SuccessIcon /> Returned in 34 ms
      </NotificationBar>
    </Wrapper>
  );
};

const NotificationBar = styled.div`
  background: #008a19;
  color: #e2e2e2;
  padding: 0.25rem;
  svg {
    width: 1rem;
    height: 1rem;
    padding: 0 0.25rem;
  }
  align-items: center;
  display: flex;
`;

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 300px auto 4fr auto; // todo make panels resizable
  gap: 0px 0px;
  max-height: 100%;
`;

const ButtonLine = styled.div`
  padding: 0.25rem 1rem;
  display: flex;
`;

const Button = styled.button`
  border: 0;
  color: #e2e2e2;
  background-color: #008a19;
  display: inline-block;
  font-weight: 400;
  line-height: 1.5;
  text-align: center;
  text-decoration: none;
  vertical-align: middle;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  transition: filter 0.15s ease-in-out;
  :hover {
    filter: brightness(0.8);
  }
  outline: 0;
`;

const RunButton = styled(Button)`
  margin-left: auto;
`;
