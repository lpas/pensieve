import React from 'react';
import styled from 'styled-components';
import create from 'zustand';
import { combine } from 'zustand/middleware';
import { CloseIcon } from './icons';

type LogLevel = 'debug' | 'info' | 'warning' | 'error';

type LogState = {
  logs: Array<{ date: Date; message: string; level: LogLevel }>;
};

const initalState: LogState = {
  logs: [
    { date: new Date(), message: 'error', level: 'error' },
    { date: new Date(), message: 'warning', level: 'warning' },
    { date: new Date(), message: 'info', level: 'info' },
    { date: new Date(), message: 'debug', level: 'debug' },
  ],
};

export const useLogStore = create(
  combine(initalState, (set) => ({
    addLog: (message: string, level: LogLevel = 'info') =>
      set((state) => ({ logs: [...state.logs, { date: new Date(), message, level }] })),
  })),
);

export const LogPanel: React.FC = () => {
  const resizing = React.useRef<null | { startPos: number; startHeight: number }>(null);
  const [height, setHeight] = React.useState(300);
  const [showPanel, setShowPanel] = React.useState(true);
  const logs = useLogStore((state) => state.logs);
  const resizePanel = React.useCallback((e: MouseEvent) => {
    if (resizing.current !== null) {
      const delta = e.clientY - resizing.current.startPos;
      const newHeight = resizing.current.startHeight - delta;
      if (newHeight < 150) {
        setShowPanel(false);
      } else {
        setShowPanel(true);
      }
      setHeight(Math.min(Math.max(newHeight, 200), 500));
    }
  }, []);

  const stopResize = React.useCallback(() => {
    resizing.current = null;
  }, []);

  const onMouseDown = (e: React.MouseEvent) => {
    resizing.current = { startPos: e.clientY, startHeight: height };
  };

  React.useEffect(() => {
    // todo only add event listerner if dragging
    const body = document.getElementsByTagName('body')[0];
    body.addEventListener('mousemove', resizePanel, { passive: true });
    body.addEventListener('mouseup', stopResize, { passive: true });
    body.addEventListener('mouseleave', stopResize, { passive: true });
  }, []);

  return (
    <div style={{ position: 'relative', marginTop: 'auto' }}>
      <Stash onMouseDown={onMouseDown} $closed={!showPanel} />
      {showPanel ? (
        <MainPanel height={height}>
          <CloseButton onClick={() => setShowPanel(false)}>
            <CloseIcon />
          </CloseButton>
          {logs.map((line, index) => (
            <Level key={index} $level={line.level}>
              [{line.level}] {line.date.toLocaleString()}: {line.message}
            </Level>
          ))}
        </MainPanel>
      ) : null}
    </div>
  );
};

const colors: Record<LogLevel, string> = {
  warning: '#ffc107',
  error: '#dc3545',
  info: '#17a2b8',
  debug: '#e2e2e2',
};

const Level = styled.div<{ $level: LogLevel }>`
  color: ${(props) => colors[props.$level]};
  margin: 0.25rem;
`;

export const Stash = styled.div<{ $closed: boolean }>`
  background-color: transparent;
  height: ${(props) => (props.$closed ? 0.25 : 0.5)}rem;
  position: absolute;
  z-index: 100;
  top: -0.25rem;
  cursor: ns-resize;
  left: 0;
  right: 0;
`;

const CloseButton = styled.div`
  position: absolute;
  right: 1rem;
  top: 0.25rem;
`;

const MainPanel = styled.div.attrs<{ height: number }>((props) => ({
  style: { minHeight: `${props.height}px` },
}))<{ height: number }>`
  background: #1e1e1e;
  border-top: 0.1rem solid #3c3c43;
  color: #e2e2e2;
  padding: 0.25rem;
  position: relative;
  svg {
    width: 1.5rem;
    height: 1.5rem;
  }
`;
