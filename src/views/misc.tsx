import React from 'react';
import styled from 'styled-components';
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
`;

export const TableWrapper = styled.div`
  color: #fff;
  overflow: auto;
`;

export const TableSideBar: React.FC = () => {
  const [tables] = React.useState(Object.keys(TABLES));
  const [views] = React.useState([]);

  const activeTab = useTabStore((state) => state.activeTab);
  const addTab = useTabStore((state) => state.addTab);

  const tableSideBarClick = (name: string, type: 'table' | 'view') => {
    addTab({ name, type });
  };

  return (
    <ul>
      {tables.map((table) => (
        <Li
          key={table}
          className={
            activeTab?.type === 'table' && table === activeTab.name ? 'active' : ''
          }
          onClick={() => tableSideBarClick(table, 'table')}>
          <TableIcon /> {table}
        </Li>
      ))}
      {views.map((view, index) => (
        <Li
          key={index}
          className={
            activeTab?.type === 'view' && view === activeTab.name ? 'active' : ''
          }
          onClick={() => tableSideBarClick(view, 'view')}>
          <ViewIcon />
          {view}
        </Li>
      ))}
    </ul>
  );
};

export const CodeSideBar: React.FC = () => <div />;
