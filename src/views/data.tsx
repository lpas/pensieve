import React from 'react';
import styled from 'styled-components';
import { DATA1, HEADER } from '../dummy_data/data1';

export const Data = React.memo(() => {
  return (
    <Table>
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

export const DataWrapper = styled.div`
  border-top: 0.05rem solid #555;
  overflow: auto;
`;

const Table = styled.table`
  white-space: nowrap;
  border-collapse: collapse;
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
