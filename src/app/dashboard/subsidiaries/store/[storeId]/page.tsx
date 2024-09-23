"use client"
import React, { lazy } from 'react'
import SubsidiariesLayout from './layout';

const SubsidiariesBody = lazy(() => import('./components/layout/subsidiaryBody/subsidiaryBody'));
const SubsidiariesHeader = lazy(() => import('./components/layout/subsidiaryHeader/subsidiaryHeader'));
const SubsidiaryPage = () => {
  return (
    <SubsidiariesLayout>
      <SubsidiariesHeader />
      <SubsidiariesBody />
    </SubsidiariesLayout>
  );
}

export default SubsidiaryPage