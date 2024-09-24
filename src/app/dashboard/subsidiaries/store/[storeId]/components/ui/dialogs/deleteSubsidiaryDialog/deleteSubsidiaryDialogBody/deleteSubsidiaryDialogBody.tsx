import React from 'react'
import useToggle from '@/hooks/useToggle.hook';
import { Tooltip, TooltipTrigger, TooltipProvider, TooltipContent } from '@/components/ui/tooltip';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui';
import { DialogContent, DialogHeader, DialogTitle, DialogDescription, Dialog, DialogFooter } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { SubsidiaryType } from '../../../../../types/subsidiary.type';
import { deleteSubsidiaryFeature } from '../../../../../feature/subsidiary.feature';

type DeleteSubsidiaryDialogBodyProps = {
  subsidiary: SubsidiaryType;
}

const DeleteSubsidiaryDialogBody = ({ subsidiary } : DeleteSubsidiaryDialogBodyProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const { loadingDeleteStore } = useSelector((state:RootState) => state.store)

  const toggle = useToggle()
  
  const onDeleteSubsidiary = async () => {
    try {
      if (!subsidiary) return;
      const storeToDelete = await dispatch(
        deleteSubsidiaryFeature({ subsidiaryId: Number(subsidiary.id) }),
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
          <DialogTitle>Eliminar Sucursal</DialogTitle>
          <DialogDescription className="text-sm font-normal">
            ¿Estás seguro de que deseas eliminar la sucursal seleccionada?
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <DialogDescription className="text-sm font-normal">
          Esta acción no se puede deshacer.
        </DialogDescription>
        <p>
          Sucursal: <span className="font-light">{subsidiary.name}</span>
        </p>
        <DialogFooter>
          <Button
            onClick={onDeleteSubsidiary}
            className="hover:text-whte mt-2 flex flex-row items-center gap-2 border-atomic-tangerine-100 bg-atomic-tangerine-500 text-xs hover:bg-atomic-tangerine-600 hover:shadow-md"
          >
            <span>Eliminar sucursal</span>
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

export default DeleteSubsidiaryDialogBody