import { TagsType } from '@/app/dashboard/tags/types/tags.type'
import React from 'react'
import TagDialogBody from './tagDialogBody/tagDialogBody'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { TagSchema } from '@/app/dashboard/tags/schema/tag.schema'

type TagDialogProps = {
  tag?: TagsType
  mainTags: TagsType[]
  loadingMainTags: boolean
}

const TagDialog = ( { tag, mainTags, loadingMainTags }: TagDialogProps) => {
  const defaultValues: TagsType = {
    id: 0,
    color: "",
    name: "",
    id_main_tag: 0,
    created_at: "",
  };

  const formMethods = useForm<TagsType>({
    defaultValues,
    resolver: zodResolver(TagSchema),
    mode: "all",
    reValidateMode: "onSubmit", 
  });

  return (
    <FormProvider {...formMethods}>
      <TagDialogBody tag={tag} mainTags = {mainTags} loadingMainTags = {loadingMainTags} />
    </FormProvider>
  );
}

export default TagDialog