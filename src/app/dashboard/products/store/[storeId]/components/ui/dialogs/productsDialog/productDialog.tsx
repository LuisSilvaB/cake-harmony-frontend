import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { AppDispatch, RootState } from '@/redux/store'
import { Dialog, DialogContent, DialogTrigger, DialogPortal, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import Icon from '@/components/ui/icon'
import useToggle from '@/hooks/useToggle.hook'
import { productsTagsType, productsType, productsVariantsType } from '../../../../types/products.type'
import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { upperLowerCase } from '../../../../../../../../../utils/upperLowerCase.util';

interface ProductDialogProps { 
  product: productsType
}

const ProductDialog = ({ product }: ProductDialogProps) => {
  const { isOpen, onToggle, onClose } = useToggle(false)

  return (
    <Dialog modal open={isOpen} onOpenChange={onToggle}>
      <DialogTrigger asChild>
        <button className="h-8 min-w-8 rounded-lg bg-atomic-tangerine-500 hover:bg-atomic-tangerine-600">
          <Icon remixIconClass="ri-pencil-line" size="xs" color="white" />
        </button>
      </DialogTrigger>
      <DialogPortal>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agrega productos a tu tienda</DialogTitle>
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
              <div className="flex w-full flex-row justify-between">
                <div className="flex">
                  <p className='text-sm font-medium'>Categorias:</p>
                </div>
                <div className="flex flex-col items-end gap-[1.2px]">
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
            <CardFooter className="flex w-full justify-between">
              <div>
                <p className='text-sm font-medium'>Variantes:</p>
              </div>
              <div className="rounded-lg px-2 py-1 shadow-lg border">
                {product.PRODUCT_VARIANTS.length
                  ? product.PRODUCT_VARIANTS.map(
                      (variant: productsVariantsType, index: number) => (
                        <div key={index} className="flex flex-row gap-4">
                          <p className="text-sm font-medium">
                            {upperLowerCase(variant.size.toString())}
                          </p>
                        </div>
                      ),
                    )
                  : null}
              </div>
            </CardFooter>
          </Card>
          <DialogFooter>
            <div className="flex w-full justify-end">
              <Button
                size="sm"
                className="bg-atomic-tangerine-600 hover:bg-atomic-tangerine-700"
              >
                Agregar producto a tienda
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}

export default ProductDialog