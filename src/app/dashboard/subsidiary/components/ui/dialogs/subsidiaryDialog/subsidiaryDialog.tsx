import React from 'react'
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubsidiarySchema } from "../../../../schema/subsidiary.schema";
import SubsidiaryDialogBody from './subsidiaryDialogBody/subsidiaryDialogBody';
import { SubsidiaryType } from '@/app/dashboard/subsidiary/types/subsidiary.type';
import { useParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

const SubsidiaryDialog = () => {
  const { storeId } = useParams();
  const storesSelector = useSelector((state: RootState) => state.store);

  const defaultValues = {
    name: "",
    description: "",
    STORE_ID:Number(storeId) ?? Number(storesSelector.selectedStore?.id) ?? 0,
  }

  const formMetods = useForm<Omit<SubsidiaryType, "id" | "created_at">>({
    resolver: zodResolver(SubsidiarySchema),
    defaultValues,
    mode: "all",
    reValidateMode: "onSubmit",
  });

  return (
    <FormProvider {...formMetods}>
      <SubsidiaryDialogBody />
    </FormProvider>
  );
}

export default SubsidiaryDialog