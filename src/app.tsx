import React from 'react';
import { StyleSheetManager } from 'styled-components';
import { GlobalStyle } from './globalStyle';
import {
  ConnectSideBar,
  ConnectView,
  initialConnection,
  useConnectionStore,
} from './views/connectView';
import { AddIcon, CodeIcon, TableIcon } from './views/icons';
import { LogPanel } from './views/logPanel';
import {
  ActivityBar,
  CodeSideBar,
  Dragger,
  Item,
  Main,
  SideBar,
  TableSideBar,
  Wrapper,
} from './views/misc';
import { Pane } from './views/tabs';

type ActivityItemTypes = 'table' | 'code' | 'add';

const activityBarItems: Array<{ key: ActivityItemTypes; icon: React.ReactElement }> = [
  { key: 'table', icon: <TableIcon /> },
  { key: 'code', icon: <CodeIcon /> },
  { key: 'add', icon: <AddIcon /> },
];

// todo scroll to new active tab
export const App: React.FC = () => {
  const [showSideBar, setShowSideBar] = React.useState(true);
  const [activeItem, setActiveItem] = React.useState<ActivityItemTypes>('table');
  const resizing = React.useRef<null | { startPos: number; startWidth: number }>(null);
  const [width, setWidth] = React.useState(300);
  const addConnection = useConnectionStore((state) => state.add);
  // todocheck if this is needed in electron move this
  //////////////
  //  global disable right click
  //////////////
  // React.useEffect(() => {
  //   window.oncontextmenu = () => false;
  // }, []);

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
    // init some connections
    addConnection({
      ...initialConnection,
      name: 'somename',
      host: 'localhost',
      color: '#f37736',
    });
    addConnection({
      ...initialConnection,
      name: '',
      host: 'localhost',
      color: '#fed766',
    });
    addConnection({
      ...initialConnection,
      name: 'this is a long name or something like this',
      host: 'localhost',
      color: '#2ab7ca',
    });
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

  return (
    <StyleSheetManager disableVendorPrefixes>
      <>
        <Wrapper>
          <ActivityBar>
            {activityBarItems.map((item) => (
              <Item
                key={item.key}
                className={showSideBar && activeItem === item.key ? 'active' : ''}
                onClick={() => {
                  setShowSideBar(activeItem !== item.key ? true : !showSideBar);
                  setActiveItem(item.key);
                }}>
                {item.icon}
              </Item>
            ))}
          </ActivityBar>
          {showSideBar ? (
            <SideBar style={{ width }}>
              {activeItem === 'table' ? (
                <TableSideBar />
              ) : activeItem === 'code' ? (
                <CodeSideBar />
              ) : (
                <ConnectSideBar />
              )}
            </SideBar>
          ) : null}
          <Main>
            <Dragger onMouseDown={onMouseDown} />
            {activeItem === 'add' ? (
              <div style={{ overflow: 'auto' }}>
                <ConnectView />
              </div>
            ) : (
              <Pane />
            )}
            <LogPanel />
          </Main>
        </Wrapper>
        <GlobalStyle />
      </>
    </StyleSheetManager>
  );
};
