import React, { useState } from 'react'
import { ProductFilesType, productsTagsType, productsType } from '../../../types/products.type'
import { upperLowerCase } from '@/utils/upperLowerCase.util';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { createColumnHelper, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import ProductDialog from '../dialogs/productsDialog';
import useToggle from '@/hooks/useToggle.hook';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import { TagsType } from '@/app/dashboard/tags/types/tags.type';
import { StoreType } from '@/app/dashboard/store/types/store.type';

type productsTableProps = {
  tags: TagsType[]
  products: productsType[]
  selectedStore: StoreType | null
}

const ProductsTable = ({ products, selectedStore, tags }: productsTableProps) => {
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
    columnHelper.accessor("PRODUCTS_TAGS", {
      header: "CATEGORÍA",
      cell: (info) => (
        <div>
          {
            info.getValue().map((tag: TagsType, index: number) => {
              if(!tag.id_main_tag) return (<div key = {index}>
                <Badge
                  style={{
                    backgroundColor: tag.color,
                  }}
                >
                  {tag.name}  
                  </Badge>
              </div>)
              return null
            })
          }

        </div>
      ),
    }),
    columnHelper.accessor("PRODUCTS_TAGS", {
      header: "SUB CATEGORÍAS",
      cell: (info) => (
        <div>
          {info.getValue().map((tag: TagsType, index: number) => {
            
            if (tag.id_main_tag)
              return (
                <div key={index}>
                  <Badge
                    style={{
                      backgroundColor: tag.color,
                    }}
                  >
                    {tag.name}
                  </Badge>
                </div>
              );
              return null
          } 
          )}
        </div>
      ),
    }),
    columnHelper.accessor("PRODUCT_FILES", {
      header: "Imágenes",
      cell: (info) => {
        if(!info.getValue().length) return null
        return (
          <div className="flex w-full flex-row items-center justify-center gap-4">
            {info
              .getValue()
              .map((productFile: ProductFilesType, index: number) => (
                <Avatar key={index}>
                  <AvatarImage
                    src={
                      process.env.NEXT_PUBLIC_SUPABASE_URL! +
                      process.env.NEXT_PUBLIC_SUPABASE_BUCKET_ROUTE! +
                      "/stores/" +
                      selectedStore?.id +
                      "/products/" +
                      productFile.file_name
                    }
                    alt="product img"
                  />
                  <AvatarFallback>PI</AvatarFallback>
                </Avatar>
              ))}
          </div>
        );
      },
    }),
    columnHelper.accessor("id", {
      header: "Acciones",
      cell: (info) => <ProductDialog tags={tags} product={info.row.original} />,
    }),
  ];

  const table = useReactTable({
    data: products as productsType[],
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