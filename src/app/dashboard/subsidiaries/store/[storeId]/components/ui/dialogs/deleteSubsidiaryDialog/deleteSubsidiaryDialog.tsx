import React from 'react'
import { SubsidiaryType } from '../../../../types/subsidiary.type';
import DeleteSubsidiaryDialogBody from './deleteSubsidiaryDialogBody';

type DeleteSubsidiaryDialogProps = {
  subsidiary: SubsidiaryType;
}

const DeleteSubsidiaryDialog = ( { subsidiary }: DeleteSubsidiaryDialogProps) => {
  return <DeleteSubsidiaryDialogBody subsidiary={subsidiary} />;
}

export default DeleteSubsidiaryDialog