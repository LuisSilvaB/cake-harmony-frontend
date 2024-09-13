import React from 'react'
import SubsidiaryLayout from './layout';
import { lazy } from 'react';

// Cargar el componente de forma diferida
const SubsidiaryComponentBody = lazy(() => import('./components/layout/subsidiaryBody'));

const Subsidiary = () => {
  return (
    <SubsidiaryLayout>
      <SubsidiaryComponentBody />
    </SubsidiaryLayout>
  )
}

export default Subsidiary