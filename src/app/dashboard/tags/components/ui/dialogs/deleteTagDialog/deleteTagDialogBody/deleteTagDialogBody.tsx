import { TagsType } from '@/app/dashboard/tags/types/tags.type'
import React from 'react'
import { Tooltip, TooltipTrigger, TooltipProvider, TooltipContent } from '@/components/ui/tooltip';
import Icon from '@/components/ui/icon';
import { DialogContent, DialogHeader, DialogTitle, DialogDescription, Dialog, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui';
import useToggle from '@/hooks/useToggle.hook';
import { Separator } from '@/components/ui/separator';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from "@/redux/store";
import { deleteTagFeature } from '@/app/dashboard/tags/feature/tags.feature';

type DeleteTagDialogBodyProps = {
  tag: TagsType
} 

const DeleteTagDialogBody = ( { tag }: DeleteTagDialogBodyProps) => {
  const toggle = useToggle()
  const dispatch = useDispatch<AppDispatch>()
  const { loadingDeleteTag } = useSelector((state:RootState) => state.tags)
  const onDeleteTag = async () => {
    try{
      if (!tag) return;
      const tagToDelete = await dispatch(
        deleteTagFeature({ tagId: Number(tag.id) }),
      );
      if (!tagToDelete) return;
      toggle.onClose();
    }catch(e){
      return
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
          <DialogTitle>Eliminar Categoría</DialogTitle>
          <DialogDescription className="text-sm font-normal">
            ¿Estás seguro de que deseas eliminar la categoría seleccionada?
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <DialogDescription className="text-sm font-normal">
          Esta acción no se puede deshacer.
        </DialogDescription>
        <p>
          Tag: <span className="font-light">{tag.name}</span>
        </p>
        <DialogFooter>
          <Button
            onClick={onDeleteTag}
            className="hover:text-whte mt-2 flex flex-row items-center gap-2 border-atomic-tangerine-100 bg-atomic-tangerine-500 text-xs hover:bg-atomic-tangerine-600 hover:shadow-md"
          >
            <span>Eliminar categoría</span>
            {loadingDeleteTag ? (
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

export default DeleteTagDialogBody
