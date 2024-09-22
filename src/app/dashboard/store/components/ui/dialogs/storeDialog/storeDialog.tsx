import React from 'react'
import { FormProvider, useForm } from 'react-hook-form';
import { StoreType } from '../../../../types/store.type';
import { zodResolver } from '@hookform/resolvers/zod';
import { StoreSchema } from '../../../../schema/store.schema';
import CreateStoreDialogBody from './storeDialogBody/storeDialogBody';

type StoreDialogProps = {
  store?: StoreType
}
const StoreDialog = ( { store }: StoreDialogProps) => {
  const defaultValues = {
    name: "",
    description: "",
  }

  const formMetods = useForm<Omit<StoreType, "id" | "created_at">>({
    resolver: zodResolver(StoreSchema),
    defaultValues,
    mode: "all",
    reValidateMode: "onSubmit",
  });

  return (
    <FormProvider {...formMetods}>
      <CreateStoreDialogBody store={store} />
    </FormProvider>
  );
}

export default StoreDialog