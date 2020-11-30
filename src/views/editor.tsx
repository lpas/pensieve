import { autocompletion, completionKeymap } from '@codemirror/next/autocomplete';
import { EditorState, EditorView } from '@codemirror/next/basic-setup';
import { closeBrackets, closeBracketsKeymap } from '@codemirror/next/closebrackets';
import { defaultKeymap } from '@codemirror/next/commands';
import { commentKeymap } from '@codemirror/next/comment';
import { lineNumbers } from '@codemirror/next/gutter';
import { defaultHighlighter, highlighter } from '@codemirror/next/highlight';
import { highlightActiveLine } from '@codemirror/next/highlight-selection';
import { history, historyKeymap } from '@codemirror/next/history';
import { PostgreSQL, sql } from '@codemirror/next/lang-sql';
import { bracketMatching } from '@codemirror/next/matchbrackets';
import { rectangularSelection } from '@codemirror/next/rectangular-selection';
import { Extension } from '@codemirror/next/state';
import {
  drawSelection,
  highlightSpecialChars,
  indentOnInput,
  keymap,
} from '@codemirror/next/view';
import React from 'react';

// todo this is just a basic hacky setup

// todo this needs to be filled for auto complete
const schema = {
  users: ['name', 'id', 'address'],
  products: ['name', 'cost', 'description'],
};

const lightWhite = '#D4D4D4',
  background = '#1e1e1e',
  selection = '#ADD6FF26',
  cursor = '#aeaeae';

const oneDarkTheme = EditorView.theme(
  {
    $: {
      flex: 1,
      color: lightWhite,
      backgroundColor: background,
      '& ::selection': { backgroundColor: selection },
      caretColor: cursor,
      '&$focused': {
        outline: 'none',
      },
    },

    '$$focused $cursor': { borderLeftColor: cursor },
    '$$focused $selectionBackground': { backgroundColor: selection },

    $panels: { backgroundColor: background, color: lightWhite },
    '$panels.top': { borderBottom: '2px solid black' },
    '$panels.bottom': { borderTop: '2px solid black' },

    $searchMatch: {
      backgroundColor: '#72a1ff59',
      outline: '1px solid #457dff',
    },
    '$searchMatch.selected': {
      backgroundColor: '#6199ff2f',
    },

    $activeLine: { backgroundColor: '#2c313c' },
    $selectionMatch: { backgroundColor: '#aafe661a' },

    '$matchingBracket, $nonmatchingBracket': {
      color: 'inherit',
      // backgroundColor: '#bad0f847',
      outline: '1px solid #515a6b',
    },

    $gutters: {
      backgroundColor: background,
      color: '#545868',
      border: 'none',
    },
    '$gutterElement.lineNumber': { color: 'inherit' },

    $foldPlaceholder: {
      backgroundColor: 'none',
      border: 'none',
      color: '#ddd',
    },

    $tooltip: {
      border: '1px solid #555',
      backgroundColor: '#252525',
    },
    '$tooltip.autocomplete': {
      '& > ul': {
        '& > li[aria-selected]': { backgroundColor: '#094771', color: '#fff' },
      },
    },
  },
  { dark: true },
);

// todo this changes with a new release
// look at theme-one-dark
const oneDarkHighlighter = highlighter({
  invalid: { color: lightWhite },
  comment: { color: '#6a8a3f' },
  keyword: { color: '#C586C0' },
  'name, deleted': { color: '#9CDCFE' },
  'operator, operatorKeyword, regexp': { color: lightWhite },
  'string, inserted': { color: '#ce9178' },
  propertyName: { color: lightWhite },
  'color, name constant, name standard': { color: lightWhite },
  'name definition': { color: lightWhite },
  'typeName, className, number, changed': { color: '#b5cea8' },
  meta: { color: lightWhite },
  strong: { fontWeight: 'bold' },
  emphasis: { fontStyle: 'italic' },
  link: { color: lightWhite, textDecoration: 'underline' },
  heading: { fontWeight: 'bold', color: lightWhite },
  'atom, bool': { color: '#2c7ad5' },
});

// const oneDarkHighlighter = highlightStyle(
//   { tag: t.comment, color: lightDark },
//   { tag: t.keyword, color: purple },
//   { tag: [t.name, t.deleted], color: coral },
//   { tag: [t.operator, t.operatorKeyword, t.regexp], color: fountainBlue },
//   { tag: [t.string, t.inserted], color: green },
//   { tag: t.propertyName, color: malibu },
//   { tag: [t.color, t.constant(t.name), t.standard(t.name)], color: whiskey },
//   { tag: t.definition(t.name), color: lightWhite },
//   { tag: [t.typeName, t.className, t.number, t.changed], color: chalky },
//   { tag: t.meta, color: dark },
//   { tag: t.strong, fontWeight: 'bold' }, // FIXME export a template for this from highlight
//   { tag: t.emphasis, fontStyle: 'italic' },
//   { tag: t.link, color: dark, textDecoration: 'underline' },
//   { tag: t.heading, fontWeight: 'bold', color: coral },
//   { tag: [t.atom, t.bool], color: whiskey },
//   { tag: t.invalid, color: invalid },
// );

/// Extension to enable the One Dark theme.
const oneDark: Extension = [oneDarkTheme, oneDarkHighlighter];

const basicSetup = [
  lineNumbers(),
  highlightSpecialChars(),
  history(),
  drawSelection(),
  EditorState.allowMultipleSelections.of(true),
  indentOnInput(),
  defaultHighlighter,
  bracketMatching(),
  closeBrackets(),
  autocompletion(),
  rectangularSelection(),
  highlightActiveLine(),
  keymap([
    ...closeBracketsKeymap,
    ...defaultKeymap,
    // ...searchKeymap, // todo
    ...historyKeymap,
    ...commentKeymap,
    ...completionKeymap,
  ]),
  oneDark,
];

const state = EditorState.create({
  doc: `SELECT
  e.employee_id AS "Employee #"
  , e.first_name || ' ' || e.last_name AS "Name"
  , e.email AS "Email"
  , e.phone_number AS "Phone"
  , TO_CHAR(e.hire_date, 'MM/DD/YYYY') AS "Hire Date"
  , TO_CHAR(e.salary, 'L99G999D99', 'NLS_NUMERIC_CHARACTERS = ''.,'' NLS_CURRENCY = ''$''') AS "Salary"
  , e.commission_pct AS "Comission %"
  , 'works as ' || j.job_title || ' in ' || d.department_name || ' department (manager: '
    || dm.first_name || ' ' || dm.last_name || ') and immediate supervisor: ' || m.first_name || ' ' || m.last_name AS "Current Job"
  , TO_CHAR(j.min_salary, 'L99G999D99', 'NLS_NUMERIC_CHARACTERS = ''.,'' NLS_CURRENCY = ''$''') || ' - ' ||
      TO_CHAR(j.max_salary, 'L99G999D99', 'NLS_NUMERIC_CHARACTERS = ''.,'' NLS_CURRENCY = ''$''') AS "Current Salary"
  , l.street_address || ', ' || l.postal_code || ', ' || l.city || ', ' || l.state_province || ', '
    || c.country_name || ' (' || r.region_name || ')' AS "Location"
  , jh.job_id AS "History Job ID"
  , 'worked from ' || TO_CHAR(jh.start_date, 'MM/DD/YYYY') || ' to ' || TO_CHAR(jh.end_date, 'MM/DD/YYYY') ||
    ' as ' || jj.job_title || ' in ' || dd.department_name || ' department' AS "History Job Title"
  
`,
  extensions: [basicSetup, sql({ schema, dialect: PostgreSQL })],
});

export const Editor: React.FC = () => {
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (ref.current == null) return;
    new EditorView({ state, parent: ref.current });
  }, []);

  return <div ref={ref} style={{ display: 'flex' }} />;
};
