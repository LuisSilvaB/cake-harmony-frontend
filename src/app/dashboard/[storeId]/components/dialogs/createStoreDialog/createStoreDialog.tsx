import React from 'react'
import { FormProvider, useForm } from 'react-hook-form';
import { StoreType } from '../../../types/store.type';
import { zodResolver } from '@hookform/resolvers/zod';
import { StoreSchema } from '../../../schema/store.schema';
import CreateStoreDialogBody from './createStoreDialogBody/createStoreDialogBody';

const CreateStoreDialog = () => {

  const defaultValues = {
    name: "",
    description: "",
  }

  const formMetods = useForm<Omit<StoreType, "id" | "created_at">>({
    resolver: zodResolver(StoreSchema),
    defaultValues,
    mode: "all",
  });

  return (
    <FormProvider {...formMetods}>
      <CreateStoreDialogBody />
    </FormProvider>
  );
}

export default CreateStoreDialog