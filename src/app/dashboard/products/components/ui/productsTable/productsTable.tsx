import React, { useState } from 'react'
import { productsTagsType, productsType } from '../../../types/products.type'
import { upperLowerCase } from '@/utils/upperLowerCase.util';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { createColumnHelper, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import ProductDialog from '../dialogs/productsDialog';
import useToggle from '@/hooks/useToggle.hook';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';

type productsTableProps = {
  globalProducts: productsType[]
}

const ProductsTable = ({ globalProducts }: productsTableProps) => {
  const [ selecteProductId, setSelectProductId ] = useState<string>("");
  const toggle = useToggle()
  const onSelectProduct = (productId: string) => {
    setSelectProductId(productId)
    toggle.onOpen()
  }
  const columnHelper = createColumnHelper<productsType>()
  const columns = [
    // columnHelper.accessor("id", {
    //   header: "ID",
    //   cell: (info) => (
    //     <div className="flex w-full items-center justify-center">
    //       <Badge
    //         variant="secondary"
    //         className="max-w-24 overflow-hidden truncate text-ellipsis"
    //       >
    //         <p className="overflow-hidden text-ellipsis">{info.getValue()}</p>
    //       </Badge>
    //     </div>
    //   ),
    // }),
    columnHelper.accessor("name", {
      header: "Nombre",
      cell: (info) => upperLowerCase(info.getValue()),
    }),
    columnHelper.accessor("description", {
      header: "Descripción",
      cell: (info) => info.getValue(),
    }),
    // columnHelper.accessor("brand", {
    //   header: "Marca",
    //   cell: (info) => info.getValue(),
    // }),
    columnHelper.accessor("PRODUCTS_TAG", {
      header: "CATEGORÍA",
      cell: (info) => (
        <div>
          {info.getValue().map((tag: productsTagsType, index: number) => (
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
    columnHelper.accessor("PRODUCTS_TAG", {
      header: "SUB CATEGORÍAS",
      cell: (info) => (
        <div>
          {info.getValue().map((tag: productsTagsType, index: number) => (
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
    columnHelper.accessor("id", {
      header: "Acciones",
      cell: (info) => <ProductDialog product={info.row.original} />,
    }),
  ];

  const table = useReactTable({
    data: globalProducts as productsType[],
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
  );
};

export default ProductsTable