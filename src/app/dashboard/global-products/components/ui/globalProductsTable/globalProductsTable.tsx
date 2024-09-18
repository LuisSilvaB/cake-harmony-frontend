import React from 'react'
import { GlobalProductsTagsType, GlobalProductsType } from '../../../types/global-products.type'
import { createColumnHelper, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { upperLowerCase } from '@/utils/upperLowerCase.util';
import moment from 'moment';
import { Button } from '@/components/ui';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type GlobalProductsTableProps = {
  globalProducts: GlobalProductsType[]
}

const GlobalProductsTable = ({ globalProducts }: GlobalProductsTableProps) => {
  const columnHelper = createColumnHelper<GlobalProductsType>()
  const columns = [
    columnHelper.accessor("id", {
      header: "ID",
      cell: (info) => (
        <div className="flex w-full items-center justify-center">
          <Badge
            variant="secondary"
            className="max-w-24 overflow-hidden truncate text-ellipsis"
          >
            <p className="overflow-hidden text-ellipsis">{info.getValue()}</p>
          </Badge>
        </div>
      ),
    }),
    columnHelper.accessor("name", {
      header: "Nombre",
      cell: (info) => upperLowerCase(info.getValue()),
    }),
    columnHelper.accessor("description", {
      header: "Descripción",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("brand", {
      header: "Marca",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("GLOBAL_PRODUCTS_TAG", {
      header: "CATEGORÍA",
      cell: (info) => (
        <div>
          {info.getValue().map((tag: GlobalProductsTagsType, index: number) => (
            <div key={index}>
              {tag.type === "CATEGORY" ? (
                <Badge
                  style={{
                    backgroundColor: tag.TAG.color,
                  }}
                >
                  {tag.TAG.name}
                </Badge>
              ) : null}
            </div>
          ))}
        </div>
      ),
    }),
    columnHelper.accessor("GLOBAL_PRODUCTS_TAG", {
      header: "SUB CATEGORÍAS",
      cell: (info) => (
        <div>
          {info.getValue().map((tag: GlobalProductsTagsType, index: number) => (
            <div key={index}>
              {tag.type === "SUB-CATEGORY" ? (
                <Badge
                  style={{
                    backgroundColor: tag.TAG.color,
                  }}
                >
                  {tag.TAG.name}
                </Badge>
              ) : null}
            </div>
          ))}
        </div>
      ),
    }),
    columnHelper.accessor("image_url", {
      header: "Imágenes",
      cell: (info) => (
        <div className="flex w-full flex-row items-center justify-center gap-4">
          {info.getValue().map((url: string, index: number) => (
            <Avatar key={index}>
              <AvatarImage src={url} alt="product img" />
              <AvatarFallback>PI</AvatarFallback>
            </Avatar>
          ))}
        </div>
      ),
    }),
    columnHelper.accessor("created_at", {
      header: "Creado el",
      cell: (info) => moment(info.getValue()).format("DD/MM/YYYY"),
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
    data: globalProducts as GlobalProductsType[],
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
    <table className="table-fixed">  
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
};

export default GlobalProductsTable