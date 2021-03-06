import React from 'react';
import styled from 'styled-components';
import create from 'zustand';
import { combine } from 'zustand/middleware';
import { TABLES } from '../dummy_data/tables';
import { TableView } from './data';
import { EditorView } from './editorView';
import { SplitIcon, TableIcon, ViewIcon } from './icons';
import { HeaderBar, HeaderOptions, LoadingSpinner } from './misc';

export interface TabData {
  name: string;
  type: 'table' | 'view' | 'code';
}

type TabState = {
  tabs: TabData[];
  activeTab: TabData | null;
};

const initalState: TabState = {
  tabs: [],
  activeTab: null,
};

export const Pane: React.FC = () => {
  const tabs = useTabStore((item) => item.tabs);
  const activeTab = useTabStore((item) => item.activeTab);
  return (
    <>
      <HeaderBar>
        <Tabs />
        {/* todo build panel splitting  */}
        <HeaderOptions>
          <SplitIcon />
        </HeaderOptions>
      </HeaderBar>
      {tabs.length > 0 ? (
        tabs.map((tab, index) => (
          <div
            key={index}
            style={{
              display: tab == activeTab ? 'contents' : 'none',
            }}>
            {tab.type === 'table' ? (
              <TableView table={TABLES[tab.name as keyof typeof TABLES]} />
            ) : tab.type === 'code' ? (
              <div style={{ overflow: 'auto' }}>
                <EditorView />
              </div>
            ) : (
              <div> view view ... </div>
            )}
          </div>
        ))
      ) : (
        <div
          style={{
            display: 'flex',
            height: '100%',
          }}>
          <LoadingSpinner style={{ margin: 'auto' }} />
        </div>
      )}
    </>
  );
};

const tabIsEqual = (a: TabData, b: TabData) => a.name === b.name && a.type === b.type;

export const useTabStore = create(
  combine(initalState, (set) => ({
    // todo should this be not tabToAdd but name & type ?
    addTab: (tabToAdd: TabData, focus = true, force = false) =>
      set((state) => {
        let tabs = state.tabs;
        let activeTab = state.activeTab;
        let tab: TabData | undefined;
        if (force === false) {
          tab = state.tabs.find((tab) => tabIsEqual(tab, tabToAdd));

          if (tab === undefined) {
            tab = tabToAdd;
            tabs = [...tabs, tabToAdd];
          }
        } else {
          tabs = [...tabs, tabToAdd];
          tab = tabToAdd;
        }

        if (focus && tab !== undefined) {
          activeTab = tab;
        }
        return { tabs, activeTab };
      }),
    removeTab: (tabToRemove: TabData) =>
      set((state) => {
        const index = state.tabs.findIndex((tab) => tab === tabToRemove);
        if (index === -1) {
          return {};
        }
        const tabs = [...state.tabs.slice(0, index), ...state.tabs.slice(index + 1)];
        let activeTab = state.activeTab;
        if (activeTab === tabToRemove) {
          activeTab = tabs.length === 0 ? null : index === 0 ? tabs[0] : tabs[index - 1];
        }
        return { tabs, activeTab };
      }),
    setActive: (activeTab: TabData) => set(() => ({ activeTab })),
  })),
);

export const Tabs: React.FC = () => {
  const state = useTabStore();
  // middle mouse on tab -> close
  const mouseDownHandler = (e: React.MouseEvent, tab: TabData) => {
    if (e.button === 1) {
      state.removeTab(tab);
    }
  };
  //  Main tabs scroll
  const onWheel = (e: React.WheelEvent) => {
    e.currentTarget.scrollTo({
      left: e.currentTarget.scrollLeft + e.deltaY,
    });
  };

  return (
    <TabGroup onWheel={onWheel}>
      {state.tabs.map((tab) => (
        <Tab
          key={tab.name}
          className={tab === state.activeTab ? 'active' : ''}
          onClick={() => state.setActive(tab)}
          onMouseDown={(e) => mouseDownHandler(e, tab)}>
          {tab.type === 'table' ? (
            <TableIcon />
          ) : tab.type === 'view' ? (
            <ViewIcon />
          ) : null}
          {tab.name}
          <Close title="Close" onClick={() => state.removeTab(tab)} />
        </Tab>
      ))}
    </TabGroup>
  );
};

export const TabGroup = styled.div`
  flex: 1;
  background: #252525;
  display: flex;
  overflow: hidden;
  :hover {
    overflow-x: auto;
  }
  height: 2.5rem;
`;

export const Close = styled.span`
  width: 1rem;
  position: absolute;
  top: 0;
  height: 2.5rem;
  right: 0.25rem;
  display: none;
  :before,
  :after {
    position: absolute;
    left: 50%;
    top: calc(50% - 0.75rem / 2);
    content: ' ';
    height: 0.75rem;
    width: 0.05rem;
    background-color: #ccc;
  }
  :before {
    transform: rotate(45deg);
  }
  :after {
    transform: rotate(-45deg);
  }
`;

export const Tab = styled.div`
  background-color: #2d2d2d;
  color: #cccccc;
  padding: 0.75rem 1.75rem 0.75rem 0.75rem;
  margin: 0 0.05rem;
  position: relative;
  white-space: nowrap;
  :hover,
  &.active {
    ${Close} {
      display: inline-block;
    }
  }
  &.active {
    background-color: #1e1e1e;
    color: #ffffff;
  }
  svg {
    height: 1rem;
    width: 1rem;
    vertical-align: bottom;
    display: inline-block;
    margin-right: 0.5rem;
  }
`;
