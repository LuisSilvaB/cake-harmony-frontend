import React from 'react'
import { SubsidiaryType } from '../../../types/subsidiary.type'
import { createColumnHelper, flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table'
import moment from 'moment'
import SubsidiaryDialog from '../dialogs/subsidiaryDialog'

type SubsidiariesTableProps = {
  subsidiaries:SubsidiaryType[]
}

const SubsidiariesTable = ({ subsidiaries }: SubsidiariesTableProps) => {
  const columnHelper = createColumnHelper<SubsidiaryType>()
  const columns = [
    columnHelper.accessor("id", {
      header: "ID",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("name", {
      header: "Nombre",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("description", {
      header: "Descripción",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("created_at", {
      header: "Creado el",
      cell: (info) => moment(info.getValue()).format("DD/MM/YYYY"),
    }),
    columnHelper.accessor("id", {
      header: "ACCIONES",
      cell: (info) => (
        <div className="flex w-full items-center justify-center gap-2">
          <SubsidiaryDialog subsidiary={info.row.original} />
        </div>
      ),
    }),
  ]

  const table = useReactTable({
    data: subsidiaries,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
  })
  return (
    <table className="table-fixed">
    <thead>
      {table.getHeaderGroups().map((headerGroups, index) => (
        <tr
          key={index}
          className="text-center text-sm uppercase text-gray-700"
        >
          {headerGroups.headers.map((header, index) => (
            <th
              key={index}
              colSpan={header.colSpan}
              className="border-gray-200 bg-gray-100 px-6 py-3 text-xs font-medium uppercase tracking-wider text-gray-500"
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
          className="text-center text-xs font-medium text-gray-700"
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
  )
}

export default SubsidiariesTable