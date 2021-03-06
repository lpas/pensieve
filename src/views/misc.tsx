import React from 'react';
import styled, { keyframes } from 'styled-components';
import { TABLES } from '../dummy_data/tables';
import { TableIcon, ViewIcon } from './icons';
import { useTabStore } from './tabs';

export const Wrapper = styled.div`
  display: flex;
  height: 100vh;
  user-select: none;
  max-width: 100vw;
`;

export const ActivityBar = styled.div`
  width: 3rem;
  background-color: #333333;
`;

export const SideBar = styled.div`
  min-width: 6rem;
  background-color: #252525;
  color: #cccccc;
  padding: 1rem 0;
  overflow: hidden;
  :hover {
    overflow: auto;
  }
  ul {
    margin: 0;
    padding: 0;
  }
`;

export const Main = styled.div`
  flex: 1;
  background-color: #1e1e1e;
  min-width: 20rem; /** need at least 0 here for overflow to work */
  position: relative;
  display: flex;
  flex-direction: column;
`;

export const Li = styled.li`
  padding: 0.25rem 1rem;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: 100%;
  overflow: hidden;
  &.active {
    background: #094771;
    color: #fff;
  }
  &:not(.active):hover {
    background: rgba(55, 55, 55, 0.5);
  }
  svg {
    width: 1rem;
    height: 1rem;
    vertical-align: bottom;
    display: inline-block;
    margin-right: 0.5rem;
  }
`;

export const Item = styled.div`
  color: #fff;
  height: 3rem;
  svg {
    width: 60%;
    height: 60%;
    margin: 20%;
  }
  opacity: 0.5;
  position: relative;
  &.active,
  :hover {
    opacity: 1;
  }

  &.active:after {
    content: '';
    position: absolute;
    left: 0;
    width: 0.1rem;
    height: 100%;
    background: #fff;
  }
`;

export const Dragger = styled.div`
  background-color: transparent;
  height: 100%;
  width: 0.5rem;
  position: absolute;
  z-index: 100;
  left: -0.25rem;
  cursor: ew-resize;
`;

export const HeaderOptions = styled.div`
  cursor: not-allowed;
  color: #fff;
  svg {
    height: 1rem;
    width: 1rem;
    display: inline-block;
  }
  margin: 0 0.5rem;
  line-height: 2.5rem;
`;

export const HeaderBar = styled.div`
  height: 2.5rem;
  display: flex;
  & ::-webkit-scrollbar {
    width: 12px;
    height: 2px;
    background-color: transparent;
  }
`;

export const TableWrapper = styled.div`
  color: #fff;
  overflow: auto;
`;

export const TableSideBar: React.FC = () => {
  const [tables] = React.useState(Object.keys(TABLES));
  const [views] = React.useState(['view1', 'view2', 'view3']);

  const activeTab = useTabStore((state) => state.activeTab);
  const addTab = useTabStore((state) => state.addTab);

  const tableSideBarClick = (name: string, type: 'table' | 'view') => {
    addTab({ name, type });
  };
  const [active, setActive] = React.useState({ tables: true, views: false });

  return (
    <>
      <TableViewSwitch>
        <button
          className={active.tables === true ? 'active' : ''}
          onClick={() => setActive({ ...active, tables: !active.tables })}>
          Tables
        </button>
        <button
          className={active.views === true ? 'active' : ''}
          onClick={() => setActive({ ...active, views: !active.views })}>
          Views
        </button>
      </TableViewSwitch>
      <ul>
        {active.tables
          ? tables.map((table) => (
              <Li
                key={table}
                className={
                  activeTab?.type === 'table' && table === activeTab.name ? 'active' : ''
                }
                onClick={() => tableSideBarClick(table, 'table')}>
                <TableIcon /> {table}
              </Li>
            ))
          : null}
        {active.views
          ? views.map((view, index) => (
              <Li
                key={index}
                className={
                  activeTab?.type === 'view' && view === activeTab.name ? 'active' : ''
                }
                onClick={() => tableSideBarClick(view, 'view')}>
                <ViewIcon />
                {view}
              </Li>
            ))
          : null}
      </ul>
    </>
  );
};

const TableViewSwitch = styled.div`
  width: 100%;
  display: flex;
  background: #1e1e1e;
  padding: 0.25rem;
  gap: 0.25rem;
  & button {
    display: inline-block;
    font-weight: 400;
    line-height: 1.5;
    flex: 1;
    border: 0;
    height: 1.5rem;
    outline: none;
    font-size: 1rem;
    transition: filter 0.15s ease-in-out;
    color: #e2e2e2e2;
    :hover {
      filter: brightness(0.8);
    }
    background: #1e1e1e;
  }
  & .active {
    background-color: #008a19;
    color: #e2e2e2;
  }
`;

export const CodeSideBar: React.FC = () => {
  const addTab = useTabStore((state) => state.addTab);
  return (
    <div>
      <LoadingSpinner />
      <button onClick={() => addTab({ name: 'query', type: 'code' }, true, true)}>
        NEW ONE
      </button>
    </div>
  );
};

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

export const LoadingSpinner = styled.span`
  width: 3rem;
  height: 3rem;
  display: inline-block;
  border-radius: 50%;
  border: 0.25rem solid rgb(55, 154, 246, 0.5);
  position: relative;
  &:after {
    content: '';
    display: block;
    position: absolute;
    position: absolute;
    left: -0.25rem;
    top: -0.25rem;
    bottom: -0.25rem;
    right: -0.25rem;
    border-right: 0.25rem solid rgb(55, 154, 246);
    border-top: 0.25rem solid rgb(55, 154, 246);
    border-radius: 50%;
    border-bottom-color: transparent;
    animation: ${rotate} 1.5s linear infinite;
  }
`;
