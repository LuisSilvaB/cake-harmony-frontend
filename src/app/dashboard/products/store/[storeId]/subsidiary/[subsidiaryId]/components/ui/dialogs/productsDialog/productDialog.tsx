import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { AppDispatch, RootState } from '@/redux/store'
import { getProductBySubsidiaryId } from '@/app/dashboard/products/store/[storeId]/subsidiary/[subsidiaryId]/feature/products.feature'
import { Dialog, DialogContent, DialogTrigger, DialogPortal, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import Icon from '@/components/ui/icon'
import useToggle from '@/hooks/useToggle.hook'
import { productsTagsType, productsType } from '../../../../types/products.type'
import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

interface ProductDialogProps { 
  product: productsType
}

const ProductDialog = ({ product }: ProductDialogProps) => {
  const selectedSubsidiary = useSelector((state: RootState) => state.subsidiary.selectedSubsidiary)
  const dispatch = useDispatch<AppDispatch>()
  const { isOpen, onToggle, onClose } = useToggle(false)

  const handleOpenChange = async (isOpen: boolean) => {
    onToggle()
  }

  console.log(product)

  return (
    <Dialog modal open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button className="h-8 min-w-8 rounded-lg bg-atomic-tangerine-500 hover:bg-atomic-tangerine-600">
          <Icon remixIconClass="ri-pencil-line" size="xs" color="white" />
        </button>
      </DialogTrigger>
      <DialogPortal>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar producto a tu tienda</DialogTitle>
            <DialogDescription>
              Realiza los cambios necesarios en el producto. Haz clic en guardar
              cuando termines.
            </DialogDescription>
          </DialogHeader>
          <Card>
            <CardHeader className="flex flex-row justify-between">
              <div>
                <CardTitle>{product.name}</CardTitle>
                <CardDescription>{product.description}</CardDescription>
              </div>
              <div>
                <Avatar>
                  <AvatarImage src={product.image_url[0]} alt="product img" />
                  <AvatarFallback>PI</AvatarFallback>
                </Avatar>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex">
                <div className="flex flex-col gap-[1.2px]">
                  {product.PRODUCTS_TAG.map(
                    (tag: productsTagsType, index: number) => (
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
                    ),
                  )}
                  {product.PRODUCTS_TAG.map(
                    (tag: productsTagsType, index: number) => (
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
                    ),
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        <DialogFooter>
          <div className="flex w-full justify-end">
            <Button size="xs">Agregar producto</Button>
          </div>
        </DialogFooter>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}

export default ProductDialog