import React, { useEffect } from 'react';
import { TagsType } from '@/app/dashboard/tags/types/tags.type';
import { createStoreFeature, updateStoreFeature } from '@/app/dashboard/store/feature/store.feature';
import { StoreType } from '@/app/dashboard/store/types/store.type';
import { Button, Input, Label } from '@/components/ui';
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
import { useRouter } from 'next/navigation';

type TagDialogBodyProps = {
  tag?: TagsType
}

const TagDialogBody = ( { tag }: TagDialogBodyProps) => {

  const {
    control,
    formState: { isValid },
    handleSubmit,
    setValue,
  } = useFormContext<Omit<TagsType, "id" | "created_at">>(); 

  useEffect(()=>{
    if(tag) {
      setValue("color", tag.color);
      setValue("name", tag.name);
      setValue("id_main_tag", tag.id_main_tag);
    } else {
      setValue("color", "");
      setValue("name", "");
      setValue("id_main_tag", 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  return (
    <Dialog>

    </Dialog>
  )
}

export default TagDialogBody