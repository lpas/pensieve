import React from 'react';
import styled from 'styled-components';
import { TABLES } from '../dummy_data/tables';
import { Button } from './connectView';
import { FKeyIcon } from './icons';

// todo keyboard nav in table

const getCompareFunc = <T extends { line: React.ReactText[] }>(
  operator: QueryOperator,
  index: number,
  queryString: string,
) => {
  switch (operator) {
    case '=':
      return (row: T) => row.line[index] == queryString;
    case '<>':
      return (row: T) => row.line[index] != queryString;
    case '>':
      return (row: T) => row.line[index] > queryString;
    case '>=':
      return (row: T) => row.line[index] >= queryString;
    case '<':
      return (row: T) => row.line[index] < queryString;
    case '<=':
      return (row: T) => row.line[index] <= queryString;
  }
};

export const Data: React.FC<{
  data: React.ReactText[][];
  header: string[];
  filter?: FilterType;
}> = (props) => {
  const [sort, setSort] = React.useState<{ index: number; order: 'asc' | 'desc' }>({
    index: 0,
    order: 'asc',
  });

  const [data, setData] = React.useState<
    { line: React.ReactText[]; active: boolean; index: number }[]
  >(props.data.map((line, index) => ({ line, index, active: false })));

  React.useEffect(() => {
    setData(props.data.map((line, index) => ({ line, index, active: false })));
  }, [props.data]);

  const filteredData = React.useMemo(() => {
    const filter = props.filter;
    if (filter == null) return data;
    const index = props.header.findIndex((item) => filter.col === item);
    if (index === -1) return data;
    const compare = getCompareFunc(filter.operator, index, filter.queryString);
    return data.filter(compare);
  }, [data, props.filter]);

  const sortedData = React.useMemo(
    () =>
      [...filteredData].sort((item1, item2) => {
        const a = item1.line[sort.index];
        const b = item2.line[sort.index];
        const m = sort.order === 'asc' ? 1 : -1;

        return (
          m *
          (a == null && b == null
            ? 0
            : a == null
            ? -1
            : typeof a === 'string' && (typeof b === 'string' || b == null)
            ? a.localeCompare(b)
            : typeof a === 'number' && typeof b === 'number'
            ? a - b
            : 1)
        );
      }),
    [sort, filteredData],
  );

  const [activeCell, setActiveCell] = React.useState<{ row: number; cell: number }>({
    row: -1,
    cell: -1,
  });
  return (
    <Table>
      <thead>
        <tr>
          {props.header.map((line, index) => (
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
        {sortedData.map((row) => (
          <tr
            key={row.index}
            onClick={(e) => {
              const ctrlKey = e.ctrlKey;
              setData(
                data.map((item) => ({
                  line: item.line,
                  active: ctrlKey
                    ? item.index === row.index
                      ? !item.active
                      : item.active
                    : item.index === row.index
                    ? !item.active
                    : false,
                  index: item.index,
                })),
              );
            }}
            className={row.active ? 'active' : ''}>
            {row.line.map((item, cellIndex) => (
              <td
                key={cellIndex}
                className={
                  activeCell.row === row.index && activeCell.cell === cellIndex
                    ? 'active'
                    : ''
                }
                onClick={() => setActiveCell({ row: row.index, cell: cellIndex })}>
                {item}{' '}
                {cellIndex === 4 ? (
                  <FKey>
                    <FKeyIcon />
                  </FKey>
                ) : null}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

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

type FilterType = { col: string; operator: QueryOperator; queryString: string } | null;

type TableType = typeof TABLES;

interface TableViewProps {
  table: TableType[keyof TableType];
}

export const TableView: React.FC<TableViewProps> = (props) => {
  const [filter, setFilter] = React.useState<FilterType>(null);
  return (
    <>
      <Filter header={props.table.data.header} onChange={setFilter} />

      {React.useMemo(
        () => (
          <DataWrapper>
            <Data
              data={props.table.data.rows}
              header={props.table.data.header}
              filter={filter}
            />
          </DataWrapper>
        ),
        [props.table, filter],
      )}
    </>
  );
};

export const DataWrapper = styled.div`
  border-top: 0.05rem solid #555;
  overflow: auto;
`;

const queryOperators = ['=', '<>', '>', '<', '>=', '<='] as const;
type QueryOperator = typeof queryOperators[number];

const Filter: React.FC<{ header: string[]; onChange: (filter: FilterType) => void }> = (
  props,
) => {
  const [activeCol, setActiveCol] = React.useState(props.header[0]);
  const [activeOperator, setActiveOperator] = React.useState<QueryOperator>(
    queryOperators[0],
  );
  const [activeQuery, setActiveQuery] = React.useState('');
  return (
    <div style={{ display: 'flex' }}>
      <Select
        style={{ flex: '1 1 15%', margin: '0.25rem 0 0.25rem' }}
        value={activeCol}
        onChange={(e) => setActiveCol(e.target.value)}>
        {props.header.map((col, index) => (
          <option key={index}>{col}</option>
        ))}
      </Select>
      <Select
        style={{ flex: '1 1 5rem', margin: '0.25rem 0 0.25rem 0.25rem' }}
        value={activeOperator}
        onChange={(e) => setActiveOperator(e.target.value as QueryOperator)}>
        {queryOperators.map((operator, index) => (
          <option key={index}>{operator}</option>
        ))}
      </Select>
      <Input
        value={activeQuery}
        onChange={(e) => setActiveQuery(e.target.value)}
        type="text"
        style={{ margin: '0.25rem' }}></Input>
      <Button
        style={{ margin: '0.25rem 0' }}
        onClick={() =>
          props.onChange({
            col: activeCol,
            queryString: activeQuery,
            operator: activeOperator,
          })
        }>
        Apply
      </Button>
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
    position: relative;
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
    z-index: 1;
  }
  thead tr {
    background-color: #1e1e1e; /* rgba(0,0,0,.25); */
    font-weight: bold;
    border-top: none;
  }

  tbody tr.active {
    background-color: #094771 !important;
  }

  tbody td.active {
    box-shadow: inset 0 0 0px 1px red;
  }

  tbody tr:nth-of-type(odd) {
    background-color: rgba(255, 255, 255, 0.05);
  }
  tbody tr:hover {
    background-color: rgba(255, 255, 255, 0.075);
  }
  margin-bottom: 1rem;
`;

const FKey = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  :hover {
    background: #094771;
  }
  padding: 0.25rem;
  margin: 0.1rem;
  svg {
    width: 1rem;
    height: 1rem;
  }

  ${Table} tr.active & {
    filter: brightness(1.5);
  }
`;
