import React from 'react';
import styled from 'styled-components';
import { DATA1, HEADER } from '../dummy_data/data1';
import { Button } from './connectView';

export const Data = React.memo(() => {
  const [sort, setSort] = React.useState<{ index: number; order: 'asc' | 'desc' }>({
    index: 0,
    order: 'asc',
  });
  return (
    <Table>
      <thead>
        <tr>
          {HEADER.map((line, index) => (
            <SortTH
              $order={index === sort.index ? sort.order : undefined}
              onClick={() =>
                setSort({
                  index,
                  order: index === sort.index && sort.order === 'asc' ? 'desc' : 'asc',
                })
              }
              key={index}>
              {line}
            </SortTH>
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

const SortTH = styled.th<{ $order?: 'asc' | 'desc' }>`
  position: relative;
  padding-right: 1.25rem !important;
  &:after,
  &:before {
    content: '';
    display: block;
    position: absolute;
    right: 0.25rem;
    border: 0.4rem solid transparent;
    top: 50%;
  }

  &:before {
    border-bottom-color: rgba(
      220,
      220,
      220,
      ${(props) => (props.$order === 'asc' ? 1 : 0.1)}
    );
    margin-top: -0.85rem;
  }
  &:after {
    border-top-color: rgba(
      220,
      220,
      220,
      ${(props) => (props.$order === 'desc' ? 1 : 0.1)}
    );
    margin-top: 0.05rem;
  }

  ${(props) =>
    props.$order === 'desc' || props.$order == null
      ? `&:hover:before {
        border-bottom-color: rgba(220, 220, 220, 0.5);
      }`
      : `&:hover:after {
        border-top-color: rgba(220, 220, 220, 0.5);
      }`}
`;

Data.displayName = 'Data';

export const TableView: React.FC = () => (
  <>
    <Filter />
    <DataWrapper>
      <Data />
    </DataWrapper>
  </>
);

export const DataWrapper = styled.div`
  border-top: 0.05rem solid #555;
  overflow: auto;
`;

const queryOperators = ['=', '<>', '>', '<', '>=', '<='];

const Filter: React.FC = () => {
  const [activeCol, setActiveCol] = React.useState(HEADER[0]);
  const [activeOpertator, setActiveOperator] = React.useState(queryOperators[0]);
  return (
    <div style={{ display: 'flex' }}>
      <Select
        style={{ flex: '1 1 15%', margin: '0.25rem 0 0.25rem' }}
        value={activeCol}
        onChange={(e) => setActiveCol(e.target.value)}>
        {HEADER.map((col, index) => (
          <option key={index}>{col}</option>
        ))}
      </Select>
      <Select
        style={{ flex: '1 1 5rem', margin: '0.25rem 0 0.25rem 0.25rem' }}
        value={activeOpertator}
        onChange={(e) => setActiveOperator(e.target.value)}>
        {queryOperators.map((operator, index) => (
          <option key={index}>{operator}</option>
        ))}
      </Select>
      <Input type="text" style={{ margin: '0.25rem' }}></Input>
      <Button style={{ margin: '0.25rem 0' }}>Apply</Button>
    </div>
  );
};

const Select = styled.select`
  /* &:not([size]):not([multiple]) {
    height: 2.25rem;
  } */
  display: block;
  width: 100%;
  padding: 0.25rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  color: #eee;
  background-color: #1e1e1e;
  background-clip: padding-box;
  border: 0.1rem solid #3c3c43;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  overflow: visible;

  &:focus {
    border-color: #094771;
    outline: 0;
    /* box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25); */
  }
`;

const Input = styled.input`
  display: block;
  width: 100%;
  padding: 0.25rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  color: #eee;
  background-color: #1e1e1e;
  background-clip: padding-box;
  border: 0.1rem solid #3c3c43;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  overflow: visible;
  &:hover {
    border-color: #888;
  }
  &:focus {
    border-color: #094771;
    outline: 0;
    /* box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25); */
  }
  &[type='number']::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  &[type='color'] {
    -webkit-appearance: none;
    /* border: none; */
  }
  &[type='color']::-webkit-color-swatch-wrapper {
    padding: 0;
  }
  &[type='color']::-webkit-color-swatch {
    border: none;
  }
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
