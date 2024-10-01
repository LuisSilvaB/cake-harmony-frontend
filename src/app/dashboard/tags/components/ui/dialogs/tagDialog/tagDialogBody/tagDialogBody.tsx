"use client"
import React, { useEffect, useRef } from 'react';
import { TagsType } from '@/app/dashboard/tags/types/tags.type';
import { Button, Input, Label } from '@/components/ui';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import Icon from '@/components/ui/icon';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from '@/hooks/useToast';
import useToggle from '@/hooks/useToggle.hook';
import useSession from '@/libs/supabase/use-session';
import { AppDispatch, RootState } from '@/redux/store';
import { FieldErrors, SubmitHandler, useFormContext } from 'react-hook-form';
import { FaSpinner } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/utils/cn';
import { createTagFeature, updateTagFeature } from '@/app/dashboard/tags/feature/tags.feature';


type TagDialogBodyProps = {
  tag?: TagsType
  mainTags: TagsType[]
  loadingMainTags: boolean
}

const TagDialogBody = ( { tag, mainTags, loadingMainTags }: TagDialogBodyProps) => {
  const toggle = useToggle(); 
  const toggleCombobox = useToggle()
  const colorPickerRef = useRef<HTMLInputElement>(null);

  const {
    control,
    formState: { isValid },
    handleSubmit,
    setValue,
    getValues,
  } = useFormContext<Omit<TagsType, "id" | "created_at">>(); 
  const session = useSession()
  const dispatch = useDispatch<AppDispatch>()
  const { loadingCreateTag, loadingUpdateTag } = useSelector((state: RootState) => state.tags)
  const onSubmitCreate: SubmitHandler<Omit<TagsType, "id" | "created_at">> = async (data) => {

    try {
      console.log("tratando de crear") 
      if (!isValid || !session?.user) {
        toast({
          title: "Error",
          description: "Complete los campos requeridos",
          duration: 5000,
        });
        return
      }
      const { color, name, id_main_tag } = data;
      const tag = await dispatch(
        createTagFeature({ color, name, id_main_tag }),
      );

      if (!tag) return;

      if (Array.isArray(tag.payload)) {
        toggle.onClose();
      };
      
    } catch (error) {
      return; 
    }
  }

  const onSubmitUpdate: SubmitHandler<Omit<TagsType, "id" | "created_at">> = async (data) => {
    try {
      if (!isValid || !session?.user) {
        toast({
          title: "Error",
          description: "Complete los campos requeridos test",
          duration: 5000,
        });
        return
      }
      const newTag = await dispatch(
        updateTagFeature({ tagToUpdate: data, tagId: Number(tag?.id ?? 0)}),
      );
      if (!tag) return;

      if (Array.isArray(newTag.payload)) {
        toggle.onClose();
      };
      
    } catch (error) {
      return; 
    }
  }

  const onError = (error: FieldErrors<Omit<TagsType, "id" | "created_at">>) => {
    console.log("Form error:", error);
    toast({
      title: "Vefifique los campos ingresados",
      description: "Error al registrar",
      duration: 5000,
      variant: "destructive"
    });
  }

  const onClose = () => {
    toggle.onClose();
  }

  useEffect(()=>{
    if(tag) {
      setValue("color", tag.color);
      setValue("name", tag.name);
      setValue("id_main_tag", tag.id_main_tag ?? 0);
    } else {
      setValue("color", "");
      setValue("name", "");
      setValue("id_main_tag", 0);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  const mainTagsOptions = mainTags.map((tag: TagsType) => ({
    value: tag.name.toLowerCase(),
    label: tag.name,
  }))

  return (
    <Dialog open={toggle.isOpen} onOpenChange={onClose}>
      <TooltipProvider>
        {tag ? (
          <Tooltip>
            <TooltipTrigger>
              <Button
                onClick={toggle.onOpen}
                size={"xs"}
                variant="secondary"
                className="items-center justify-center rounded-lg"
              >
                <Icon remixIconClass="ri-pencil-line" size="md" color="gray" />
              </Button>
            </TooltipTrigger>
            <TooltipContent
              sideOffset={5}
              className="border bg-white text-xs font-normal text-gray-500 shadow-xl"
            >
              <p className="text-sm">Editar tienda</p>
            </TooltipContent>
          </Tooltip>
        ) : (
          <Tooltip>
            <TooltipTrigger>
              <Button
                onClick={toggle.onOpen}
                size={"sm"}
                className="items-center justify-center rounded-lg bg-atomic-tangerine-500 hover:bg-atomic-tangerine-600"
              >
                <Icon remixIconClass="ri-add-line" size="md" color="white" />
              </Button>
            </TooltipTrigger>
            <TooltipContent
              sideOffset={5}
              className="border bg-white text-xs font-normal text-gray-500 shadow-xl"
            >
              <p className="text-sm">Agregar nueva tienda</p>
            </TooltipContent>
          </Tooltip>
        )}
      </TooltipProvider>
      <DialogContent className="sm:max-w-[425px]">
        <form
          onSubmit={
            tag
              ? handleSubmit(onSubmitUpdate, onError)
              : handleSubmit(onSubmitCreate, onError)
          }
        >
          <DialogHeader>
            <DialogTitle>
              {tag ? "Editar categoría" : "Agregar una categoría"}
            </DialogTitle>
            <DialogDescription className="text-sm font-normal">
              {tag
                ? "Edite los datos correspondientes a la categoría que desea editar."
                : "Registre los datos correspondientes a la categoría que desea agregar."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="w-full">
              <FormField
                control={control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input
                        value={field.value}
                        onChange={field.onChange}
                        type="text"
                        placeholder="Nombre"
                        className="min-w-56 border"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="w-full">
              <FormField
                control={control}
                name="color"
                render={({ field }) => {

                  return (
                    <FormItem>
                      <FormLabel>Color</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            ref={colorPickerRef}
                            value={field.value}
                            onChange={field.onChange}
                            type="color"
                            placeholder="Color"
                            className="min-w-56 border"
                          />
                          <div
                            className="absolute top-0 flex h-full w-full items-center justify-between rounded-md border bg-white px-2"
                            onClick={() => {
                              if (!colorPickerRef) return;
                              else colorPickerRef.current?.click();
                            }}
                          >
                            <p className="font text-xs font-medium">
                              {getValues("color")?.length ? getValues("color") : "Seleccione un color"}
                            </p>
                            <span
                              className="h-3 w-3 rounded-full"
                              style={{
                                backgroundColor: getValues("color"),
                              }}
                            />
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
            <div className="">
              <FormField control={control} name="id_main_tag" render={({field}) => {
                return (
                  <FormItem>
                    <FormLabel>Categoría principal</FormLabel>
                    <FormControl>
                      <Popover
                        open={toggleCombobox.isOpen}
                        onOpenChange={toggleCombobox.onToggle}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            className="w-full justify-between"
                          >
                              {
                                field.value
                                ? mainTags.find((mainTag)=> mainTag.id === field.value)?.name
                                : "Seleccione una categoria"
                              }
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent align="start">
                          <Command>
                            <CommandInput placeholder="Buscar categoria..." />
                            <CommandList>
                              <CommandEmpty>
                                Categorias no encontradas
                              </CommandEmpty>
                              <CommandGroup>
                                {mainTagsOptions.map((tag) => (
                                  <CommandItem
                                    key={tag.value}
                                    value={tag.value}
                                    onSelect={(currentValue) => {
                                      setValue("id_main_tag", mainTags.find((mainTag)=> mainTag.name.toLowerCase() === currentValue)?.id ?? 0);
                                      toggleCombobox.onClose();
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        mainTags.find((mainTag)=> mainTag.name.toLowerCase() === tag.value.toLowerCase())?.id === field.value 
                                          ? "opacity-100"
                                          : "opacity-0",
                                      )}
                                    />
                                    {tag.label}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                  </FormItem>
                );
              }}/>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className="hover:text-whte mt-2 flex flex-row items-center gap-2 border-atomic-tangerine-100 bg-atomic-tangerine-500 text-xs hover:bg-atomic-tangerine-600 hover:shadow-md"
              disabled={loadingCreateTag || loadingUpdateTag}
            >
              {tag ? "Editar categoría" : "Crear categoría"}

              {loadingCreateTag || loadingUpdateTag ? (
                <div className='animate-spin'>
                  <Icon remixIconClass='ri-loader-4-line' color='white' size='xl' />
                </div>
              ) : null}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default TagDialogBody