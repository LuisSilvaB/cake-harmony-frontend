import React from 'react'
import { TagsType } from '../../../types/tags.type'
import {
  useReactTable,
  getCoreRowModel,
  createColumnHelper,
  getPaginationRowModel,
  flexRender,
  getFilteredRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import moment from 'moment'
import { Button } from '@/components/ui';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';
import { upperLowerCase } from '../../../../../../utils/upperLowerCase.util';

type TagsTableProps = {
  tags: TagsType[]
  mainTags: TagsType[]
}

const TagsTable = ( { tags, mainTags }: TagsTableProps) => { 

  const columnHelper = createColumnHelper<TagsType>()
  const columns = [
    columnHelper.accessor("id", {
      header: "ID",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("name", {
      header: "Nombre",
      cell: (info) => upperLowerCase(info.getValue()),
    }),
    columnHelper.accessor("color", {
      header: "Color",
      cell: (info) => (
        <div className="flex w-full items-center justify-center lowercase">
          <Badge style={{ backgroundColor: info.getValue() }}>
            {info.getValue()}
          </Badge>
        </div>
      ),
    }),
    columnHelper.accessor("created_at", {
      header: "Nombre",
      cell: (info) => moment(info.getValue()).format("DD/MM/YYYY"),
    }),
    columnHelper.accessor("id_main_tag", {
      header: "ID principal",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("id", {
      header: "Acciones",
      cell: (info) => (
        <div className="flex w-full items-center justify-center gap-2">
          <Button size="xs" variant="secondary">
            <Icon remixIconClass="ri-edit-2-line" />
          </Button>
          <Button size="xs" variant="destructive">
            <Icon remixIconClass="ri-delete-bin-2-line" color="white" />
          </Button>
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data: tags as TagsType[],
    columns,
    getPaginationRowModel: getPaginationRowModel(),
    getCoreRowModel: getCoreRowModel(), 
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true, 
    debugHeaders: true,
    debugColumns: false,
  })
  return (
    <table className="w-full overflow-hidden rounded-lg"> 
      <thead>
        {table.getHeaderGroups().map((headerGroups, index) => (
          <tr key={index} className="text-center text-sm uppercase text-gray-700">
            {headerGroups.headers.map((header, index) => (
              <th
                key={index}
                colSpan={header.colSpan}
                className=" border-gray-200 bg-gray-100 px-6 py-3 text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr
            key={row.id}
            className="text-center text-xs text-gray-700 font-medium"
          >
            {row.getVisibleCells().map((cell, index) => (
              <td
                key={index}
                className="whitespace-nowrap border-b border-gray-200 px-6 py-1.5 text-gray-900"
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default TagsTable