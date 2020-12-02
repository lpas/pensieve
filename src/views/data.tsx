import React from 'react';
import styled from 'styled-components';
import { DATA1, HEADER } from '../dummy_data/data1';

export const Data = React.memo(() => {
  return (
    <Table onScroll={() => console.log('jo')}>
      <thead>
        <tr>
          {HEADER.map((line, index) => (
            <th key={index}>{line}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {DATA1.map((line, index) => (
          <tr key={index}>
            {line.map((item, index) => (
              <td key={index}>{item}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  );
});

Data.displayName = 'Data';

const DataWrapper2 = styled.div`
  border-top: 0.05rem solid #555;
  overflow: auto;
  &.sticky th:after {
    content: '';
    display: block;
    background: linear-gradient(0, transparent, black);
    width: 100%;
    position: absolute;
    height: 0.5rem;
    z-index: 2;
    bottom: -0.5rem;
    left: -0;
  }
`;

export const DataWrapper: React.FunctionComponent = (props) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [atTop, setAtTop] = React.useState(true);
  React.useEffect(() => {
    console.log('new scroll');
    const scrollX = (e: Event) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const top = e.currentTarget.scrollTop;
      setAtTop(top === 0); // todo debounce
    };
    const options = { capture: true, passive: true };
    ref.current?.addEventListener('scroll', scrollX, options);
    return () => {
      ref.current?.removeEventListener('scroll', scrollX, options);
    };
  }, []);

  return (
    <DataWrapper2 ref={ref} className={!atTop ? 'sticky' : ''}>
      {props.children}
    </DataWrapper2>
  );
};

const Table = styled.table`
  white-space: nowrap;
  border-collapse: separate;
  border-spacing: 0;
  width: 100%;
  max-width: 100%;
  color: #dcdcdc;
  td,
  th {
    text-align: inherit;
    user-select: text;
    padding: 0.3rem 0.75rem; /* TODO .75 for bigger size make this optional */
    vertical-align: top;
    border: 0.05rem solid #555;
    border-top: none;
    border-right: none;
  }
  th {
    border-top: none;
    padding: 0.75rem;
    position: sticky;
    top: 0;
    /** todo add some indication that table is scrolled */
    background-color: #1e1e1e; /* rgba(0,0,0,.25); */
  }
  thead tr {
    background-color: #1e1e1e; /* rgba(0,0,0,.25); */
    font-weight: bold;
    border-top: none;
  }

  tbody tr:nth-of-type(odd) {
    background-color: rgba(255, 255, 255, 0.05);
  }
  tbody tr:hover {
    background-color: rgba(255, 255, 255, 0.075);
  }
  margin-bottom: 1rem;
`;
