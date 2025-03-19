import {useReactTable} from '@tanstack/react-table';

export const MinuvisTable = (columns, data) => {
  const table = useReactTable ({
    columns,
    data,
  });

  return table;
};
