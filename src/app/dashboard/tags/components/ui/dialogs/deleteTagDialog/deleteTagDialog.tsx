import { TagsType } from '@/app/dashboard/tags/types/tags.type'
import React from 'react'
import DeleteTagDialogBody from './deleteTagDialogBody'

type DeleteTagDialogProps = {
  tag: TagsType
}
const DeleteTagDialog = ({ tag }: DeleteTagDialogProps) => {
  return <DeleteTagDialogBody tag = { tag } />;
}

export default DeleteTagDialog