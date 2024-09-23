import { StoreType } from '@/app/dashboard/store/types/store.type'
import React from 'react'
import DeleteStoreDialogBody from './deleteStoreDialogBody';

type DeleteStoreDialogProps = {
  store: StoreType; 
}

const DeleteStoreDialog = ({ store }: DeleteStoreDialogProps) => {
  return <DeleteStoreDialogBody store={store} />;
}

export default DeleteStoreDialog