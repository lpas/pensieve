import React from 'react';
import { StyleSheetManager } from 'styled-components';
import { TABLES, VIEWS } from './dummy_data/misc';
import { GlobalStyle } from './globalStyle';
import { Data } from './views/data';
import { CodeIcon, SplitIcon, TableIcon, ViewIcon } from './views/icons';
import {
  ActivityBar,
  Dragger,
  Editor,
  HeaderBar,
  HeaderOptions,
  Item,
  Li,
  Main,
  SideBar,
  TableWrapper,
  Wrapper,
} from './views/misc';
import { Tabs, useTabStore } from './views/Tabs';

// todo scroll to new active tab
export const App: React.FC = () => {
  const [tables] = React.useState(TABLES.slice(0, 40));
  const [views] = React.useState(VIEWS);
  const [showSideBar, setShowSideBar] = React.useState(true);
  const [sideBarItem, setSideBarItem] = React.useState<'table' | 'code'>('table');
  const resizing = React.useRef<null | { startPos: number; startWidth: number }>(null);
  const [width, setWidth] = React.useState(300);

  const activeTab = useTabStore((state) => state.activeTab);
  const addTab = useTabStore((state) => state.addTab);

  // todocheck if this is needed in electron move this
  //////////////
  //  global disable right click
  //////////////
  React.useEffect(() => {
    window.oncontextmenu = () => false;
  }, []);

  //////////////
  //  SideBar sizing
  //////////////
  const resizePanel = React.useCallback((e: MouseEvent) => {
    if (resizing.current !== null) {
      const delta = e.clientX - resizing.current.startPos;
      const newWidth = resizing.current.startWidth + delta;
      if (newWidth < 150) {
        setShowSideBar(false);
      } else {
        setShowSideBar(true);
      }
      setWidth(Math.max(newWidth, 200));
    }
  }, []);

  const stopResize = React.useCallback(() => {
    resizing.current = null;
  }, []);

  React.useEffect(() => {
    // todo remove this just random init to see some tabs
    addTab({ name: tables[0], type: 'table' });
    addTab({ name: tables[3], type: 'table' });
    addTab({ name: views[0], type: 'view' });
  }, []);

  React.useEffect(() => {
    // todo only add event listerner if dragging
    const body = document.getElementsByTagName('body')[0];
    body.addEventListener('mousemove', resizePanel, { passive: true });
    body.addEventListener('mouseup', stopResize, { passive: true });
    body.addEventListener('mouseleave', stopResize, { passive: true });
  }, []);

  const onMouseDown = (e: React.MouseEvent) => {
    resizing.current = { startPos: e.clientX, startWidth: width };
  };

  const tableSideBarClick = (name: string, type: 'table' | 'view') => {
    addTab({ name, type });
  };

  return (
    <StyleSheetManager disableVendorPrefixes>
      <>
        <Wrapper>
          <ActivityBar>
            <Item
              className={showSideBar && sideBarItem === 'table' ? 'active' : ''}
              onClick={() => {
                setShowSideBar(sideBarItem !== 'table' ? true : !showSideBar);
                setSideBarItem('table');
              }}>
              <TableIcon />
            </Item>
            <Item
              className={showSideBar && sideBarItem === 'code' ? 'active' : ''}
              onClick={() => {
                setShowSideBar(sideBarItem !== 'code' ? true : !showSideBar);
                setSideBarItem('code');
              }}>
              <CodeIcon />
            </Item>
          </ActivityBar>
          {showSideBar ? (
            <SideBar style={{ width }}>
              <ul>
                {tables.map((table) => (
                  <Li
                    key={table}
                    className={
                      activeTab?.type === 'table' && table === activeTab.name
                        ? 'active'
                        : ''
                    }
                    onClick={() => tableSideBarClick(table, 'table')}>
                    <TableIcon /> {table}
                  </Li>
                ))}
                {views.map((view, index) => (
                  <Li
                    key={index}
                    className={
                      activeTab?.type === 'view' && view === activeTab.name
                        ? 'active'
                        : ''
                    }
                    onClick={() => tableSideBarClick(view, 'view')}>
                    <ViewIcon />
                    {view}
                  </Li>
                ))}
              </ul>
            </SideBar>
          ) : null}
          <Main>
            <Dragger onMouseDown={onMouseDown} />
            <HeaderBar>
              <Tabs />
              {/* todo build panel splitting  */}
              <HeaderOptions>
                <SplitIcon />
              </HeaderOptions>
            </HeaderBar>
            <TableWrapper>
              {sideBarItem === 'table' ? (
                activeTab === null ? null : (
                  <Data />
                )
              ) : (
                <Editor />
              )}
            </TableWrapper>
          </Main>
        </Wrapper>
        <GlobalStyle />
      </>
    </StyleSheetManager>
  );
};
