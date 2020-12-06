import React from 'react';
import styled from 'styled-components';
import create from 'zustand';
import { combine } from 'zustand/middleware';
import { PostgresIcon } from './icons';

// todo
// different style for new connection
// show last/recent connections up top
// allow connection ordering?
// allow connection grouping?
// todo make real input components

export interface ConnectionData {
  type: 'postgres';
  name: string;
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  color: string;
}

type ConnectionState = {
  connections: ConnectionData[];
  active: ConnectionData | null;
};

const initialState: ConnectionState = {
  connections: [],
  active: null,
};

export const useConnectionStore = create(
  combine(initialState, (set) => ({
    add: (itemToAdd: ConnectionData, focus = true) =>
      set((state) => {
        const connections = [...state.connections, itemToAdd];
        const active = focus ? itemToAdd : state.active;
        return { connections, active };
      }),
    remove: (itemToRemove: ConnectionData) =>
      set((state) => {
        const connections = state.connections.filter((item) => item !== itemToRemove);
        const active = state.active === itemToRemove ? null : state.active;
        return { connections, active };
      }),
    setActive: (active: ConnectionData) => set(() => ({ active })),
    setActiveData: (item: ConnectionData) =>
      set((state) => {
        // const connections = [...state.connections];
        const index = state.connections.findIndex((item) => item == state.active);
        const connections = [
          ...state.connections.slice(0, index),
          item,
          ...state.connections.slice(index + 1),
        ];

        return { connections, active: item };
      }),
  })),
);

export const initialConnection: ConnectionData = {
  type: 'postgres',
  name: '',
  host: '',
  port: 5432,
  user: '',
  password: '',
  database: '',
  color: '#008a19',
};

export const ConnectView: React.FC = () => {
  const refName = React.useRef<HTMLInputElement>(null);
  const [current, setCurrent] = React.useState<ConnectionData>({ ...initialConnection });
  const active = useConnectionStore((state) => state.active);
  const save = useConnectionStore((state) => state.setActiveData);
  React.useEffect(() => {
    if (active !== null) {
      setCurrent({ ...active });
      refName.current?.focus();
    }
  }, [active]);
  return (
    <WrapperX>
      <Wrapper>
        <select>
          <option>Postgres</option>
        </select>

        <fieldset style={{ border: 0 }}>
          <div style={{ position: 'relative' }}>
            <ColorPicker
              color={current.color}
              onChange={(color) => setCurrent({ ...current, color })}
            />
            <label>
              <div>Name</div>
              <input
                ref={refName}
                type="text"
                value={current.name}
                onChange={(e) => setCurrent({ ...current, name: e.target.value })}
              />
            </label>
          </div>
          <div style={{ display: 'flex' }}>
            <label style={{ flex: '1 1 100%' }}>
              <div>Host</div>
              <input
                type="text"
                value={current.host}
                onChange={(e) => setCurrent({ ...current, host: e.target.value })}
              />
            </label>
            <label>
              <div>Port</div>
              <input
                type="number"
                value={current.port == 0 ? '' : '' + current.port}
                onChange={(e) =>
                  setCurrent({
                    ...current,
                    port: e.target.value == '' ? 0 : +e.target.value,
                  })
                }
              />
            </label>
          </div>
          <div>
            <label>
              <div>User</div>
              <input
                type="text"
                value={current.user}
                onChange={(e) => setCurrent({ ...current, user: e.target.value })}
              />
            </label>
          </div>
          <div>
            <label>
              <div>Password</div>
              <input
                type="password"
                value={current.password}
                onChange={(e) => setCurrent({ ...current, password: e.target.value })}
              />
            </label>
          </div>
          <div>
            <label>
              <div>Database</div>
              <input
                type="text"
                value={current.database}
                onChange={(e) => setCurrent({ ...current, database: e.target.value })}
              />
            </label>
          </div>
          <ButtonLine>
            <SecondaryButton onClick={() => save(current)}>Save</SecondaryButton>
            <SecondaryButton>Test</SecondaryButton>
            <Button onClick={() => save(current)}>Connect & Save</Button>
          </ButtonLine>
        </fieldset>
      </Wrapper>
    </WrapperX>
  );
};

const colors = [
  '#1b9e77',
  '#d95f02',
  '#7570b3',
  '#e7298a',
  '#66a61e',
  '#e6ab02',
  '#a6761d',
  '#666666',
];

const ColorInput = styled.input`
  padding: 0 !important;
  height: 1.5rem !important;
  width: 3rem !important;
  margin: 0.1rem 0.1rem !important;
  outline: 0 !important;
  margin-left: auto !important;
`;

interface ColorProps {
  color: string;
  onChange?: (color: string) => void;
}

const ColorPicker: React.FC<ColorProps> = (props) => (
  <div style={{ position: 'absolute', right: 0, top: '0.25rem' }}>
    <datalist id="ice-cream-flavors">
      {colors.map((color) => (
        <option key={color} value={color} />
      ))}
    </datalist>
    <ColorInput
      type="color"
      list="ice-cream-flavors"
      value={props.color}
      onChange={(e) => props.onChange?.(e.target.value)}
    />
  </div>
);

const WrapperX = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: repeat(3, 1fr);
  gap: 0px 0px;
  max-height: 100%;
  grid-row-start: 2;
`;

const Wrapper = styled.div`
  grid-row-start: 2;
  margin: auto;
  background: #2d2d2d;
  color: #eee;
  width: 35rem;
  label {
    display: block;
    padding: 0.25rem 0;
  }
  label > div {
    padding: 0.5rem;
  }

  min-height: 2rem;

  select:not([size]):not([multiple]) {
    height: 2.25rem;
  }

  input,
  select {
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
  }
  input:hover {
    border-color: #888;
  }
  input:focus,
  select:focus {
    border-color: #094771;
    outline: 0;
    /* box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25); */
  }
  input[type='number']::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  input[type='color'] {
    -webkit-appearance: none;
    /* border: none; */
  }
  input[type='color']::-webkit-color-swatch-wrapper {
    padding: 0;
  }
  input[type='color']::-webkit-color-swatch {
    border: none;
  }
`;

const Button = styled.button`
  border: 0;
  color: #e2e2e2;
  background-color: #008a19;
  display: inline-block;
  font-weight: 400;
  line-height: 1.5;
  text-align: center;
  text-decoration: none;
  vertical-align: middle;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  transition: filter 0.15s ease-in-out;
  border: 1px solid #3c3c43;
  :hover {
    border-color: #888;
  }
  :active {
    border-color: #ccc;
    color: #f1f1f1;
    background-color: #00450c;
  }
  :focus {
    border-color: #094771;
  }
  outline: 0;
`;

const SecondaryButton = styled(Button)`
  background-color: #1e1e1e;
  border: 0.1rem solid #3c3c43;
`;

const ButtonLine = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 2rem;
  ${Button} {
    margin: 0 0.25rem;
  }
`;

export const ConnectSideBar: React.FC = () => {
  const connections = useConnectionStore((state) => state.connections);
  const active = useConnectionStore((state) => state.active);
  const addConnection = useConnectionStore((state) => state.add);
  const setActive = useConnectionStore((state) => state.setActive);

  return (
    <WrapperUl>
      <Li $color="" onClick={() => addConnection({ ...initialConnection })}>
        <Full>New Connection</Full>
      </Li>
      {connections.map((connection, index) => (
        <Li
          key={index}
          className={connection === active ? 'active' : ''}
          $color={connection.color}
          onClick={() => setActive(connection)}>
          <Label>{connection.name}</Label>
          <Underline>
            {connection.host} {connection.database == '' ? '' : `/${connection.database}`}
          </Underline>
          <Type>
            {connection.type === 'postgres' ? <PostgresIcon /> : connection.type}
          </Type>
        </Li>
      ))}
    </WrapperUl>
  );
};

const WrapperUl = styled.ul``;

const Li = styled.li<{ $color: string }>`
  grid: 1.5rem 1.5rem / 2fr 1fr;
  display: grid;
  grid-template-areas:
    'left right'
    'left right';
  margin: 0.25rem 1rem;
  padding: 0.25rem;
  padding-left: 0.5rem;
  position: relative;
  &:before {
    position: absolute;
    content: '';
    left: -0.25rem;
    background: ${(props) => props.$color};
    width: 0.25rem;
    height: 100%;
  }
  &.active {
    background: #094771;
    color: #fff;
  }
  &:not(.active):hover {
    background: rgba(55, 55, 55, 0.5);
  }
  & > * {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  svg {
    width: 40px;
    height: 40px;
    filter: saturate(0);
    opacity: 0.3;
  }
`;

const Label = styled.span`
  grid-column-start: left;
`;
const Underline = styled.span`
  font-size: 0.7rem;
  opacity: 0.7;
  grid-column-start: left;
`;
const Type = styled.span`
  grid-column-start: 2;
  grid-column-end: 2;
  grid-row-start: 1;
  grid-row-end: 3;
  margin: auto;
`;

const Full = styled.div`
  grid-column-start: 1;
  grid-column-end: 3;
  grid-row-start: 1;
  grid-row-end: 3;
  margin: auto;
`;
