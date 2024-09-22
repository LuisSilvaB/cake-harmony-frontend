import React, { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubsidiarySchema } from "../../../../schema/subsidiary.schema";
import SubsidiaryDialogBody from './subsidiaryDialogBody/subsidiaryDialogBody';
import { SubsidiaryType } from '@/app/dashboard/subsidiary/types/subsidiary.type';
import { useParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

const SubsidiaryDialog = () => {
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
      <SubsidiaryDialogBody />
    </FormProvider>
  );
}

export default SubsidiaryDialog