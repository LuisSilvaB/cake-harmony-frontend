import React, { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubsidiarySchema } from "../../../../schema/subsidiary.schema";
import SubsidiaryDialogBody from './subsidiaryDialogBody/subsidiaryDialogBody';
import { SubsidiaryType } from '@/app/dashboard/subsidiaries/store/[storeId]/types/subsidiary.type';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

type SubsidiaryDialogProps = {
  subsidiary?: SubsidiaryType;
}

const SubsidiaryDialog = ( { subsidiary }: SubsidiaryDialogProps) => {
  const { selectedStore }  = useSelector((state: RootState) => state.store);

  const defaultValues = {
    name: "",
    description: "",
    STORE_ID: Number(selectedStore?.id) ?? 0,
  }; 
  const formMetods = useForm<Omit<SubsidiaryType, "id" | "created_at">>({
    resolver: zodResolver(SubsidiarySchema),
    defaultValues,
    mode: "all",
    reValidateMode: "onSubmit",
  });

  useEffect(() => {
    if (selectedStore) formMetods.setValue("STORE_ID", selectedStore.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStore]);

  return (
    <FormProvider {...formMetods}>
      <SubsidiaryDialogBody subsidiary={subsidiary} />
    </FormProvider>
  );
}

export default SubsidiaryDialog