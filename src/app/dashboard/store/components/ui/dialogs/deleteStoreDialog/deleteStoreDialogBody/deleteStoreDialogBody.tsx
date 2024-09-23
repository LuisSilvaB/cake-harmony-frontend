import React from 'react'
import { StoreType } from '@/app/dashboard/store/types/store.type';
import useToggle from '@/hooks/useToggle.hook';
import { Tooltip, TooltipTrigger, TooltipProvider, TooltipContent } from '@/components/ui/tooltip';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui';
import { DialogContent, DialogHeader, DialogTitle, DialogDescription, Dialog, DialogFooter } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { deleteStoreFeature } from '@/app/dashboard/store/feature/store.feature';
import { FaSpinner } from 'react-icons/fa';

type DeleteStoreDialogBodyProps = {
  store: StoreType;
}

const DeleteStoreDialogBody = ({ store } : DeleteStoreDialogBodyProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const { loadingDeleteStore } = useSelector((state:RootState) => state.store)

  const toggle = useToggle()
  
  const onDeleteStore = async () => {
    try {
      if (!store) return;
      const storeToDelete = await dispatch(
        deleteStoreFeature({ storeId: Number(store.id) }),
      );
      if (!storeToDelete) return;
      toggle.onClose();
    } catch (error) {
      return;
    }
  }

  return (
    <Dialog open={toggle.isOpen} onOpenChange={toggle.onClose}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Button
              onClick={toggle.onOpen}
              size={"xs"}
              variant="destructive"
              className="items-center justify-center rounded-lg"
            >
              <Icon
                remixIconClass="ri-delete-bin-line"
                size="md"
                color="white"
              />
            </Button>
          </TooltipTrigger>
          <TooltipContent
            sideOffset={5}
            className="border bg-white text-xs font-normal text-gray-500 shadow-xl"
          ></TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Eliminar tienda</DialogTitle>
          <DialogDescription className="text-sm font-normal">
            ¿Estás seguro de que deseas eliminar la tienda seleccionada?
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <DialogDescription className="text-sm font-normal">
          Esta acción no se puede deshacer.
        </DialogDescription>
        <p>
          Tienda: <span className="font-light">{store.name}</span>
        </p>
        <DialogFooter>
          <Button
            onClick={onDeleteStore}
            className="hover:text-whte mt-2 flex flex-row items-center gap-2 border-atomic-tangerine-100 bg-atomic-tangerine-500 text-xs hover:bg-atomic-tangerine-600 hover:shadow-md"
          >
            <span>Eliminar tienda</span>
            {loadingDeleteStore ? (
              <div className="animate-spin">
                <Icon
                  remixIconClass="ri-loader-4-line"
                  color="white"
                  size="xl"
                />
              </div>
            ) : null}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteStoreDialogBody