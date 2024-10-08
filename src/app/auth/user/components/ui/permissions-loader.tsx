'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { gabarito } from '@/fonts';
import { SymbolIcon } from '@radix-ui/react-icons';
import { cx } from 'class-variance-authority';
import { AppDispatch } from '@/redux/store';
import { setPermissions, setUser } from '@/app/auth/user/features/user.feature';
import { UserType } from '../../types/user.type';
import { setSelectedStore, setStores } from '@/app/dashboard/store/feature/store.feature';
import { setSelectedSubsidiary, setSubsidiaries } from '@/app/dashboard/subsidiaries/store/[storeId]/feature/subsidiary.feature';
import { StoreType } from '@/app/dashboard/store/types/store.type';
import { SubsidiaryType } from '@/app/dashboard/subsidiaries/store/[storeId]/types/subsidiary.type';
import { useRouter } from 'next/navigation'; 
import Cookies from 'js-cookie';

const PermissionsLoader = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [loader, setLoader] = useState<ReactNode | null>(<PermissionsCustomLoader />);

  const clearStorageAndRedirect = () => {
    setLoader(null);
    localStorage.clear();
    Cookies.remove('user-auth-access-token');
    router.push('/auth/login');
  };

  useEffect(() => {
    const storedData = {
      permissions: localStorage.getItem('permissions'),
      user: localStorage.getItem('user'),
      selectedStore: localStorage.getItem('selectedStore'),
      selectedSubsidiary: localStorage.getItem('selectedSubsidiary'),
      stores: localStorage.getItem('stores'),
      subsidiaries: localStorage.getItem('subsidiaries'),
    };

    if (!storedData.permissions || !storedData.user) {
      clearStorageAndRedirect();
      return;
    }

    try {
      const permissionsData = JSON.parse(storedData.permissions ?? '[]');
      const userData = JSON.parse(storedData.user ?? '{}') as UserType;
      const store = JSON.parse(storedData.selectedStore ?? '{}');
      const subsidiary = JSON.parse(storedData.selectedSubsidiary ?? '{}');
      const stores: StoreType[] = JSON.parse(storedData.stores ?? '[]');
      const subsidiaries: SubsidiaryType[] = JSON.parse(storedData.subsidiaries ?? '[]');

      if (permissionsData && userData) {
        setLoader(null);
        dispatch(setPermissions(permissionsData));
        dispatch(setUser(userData));
        dispatch(setSelectedStore(store));
        dispatch(setSelectedSubsidiary(subsidiary));
        dispatch(setStores(stores));
        dispatch(setSubsidiaries(subsidiaries));
      }
    } catch (error) {
      clearStorageAndRedirect();
    }
  }, [router, dispatch]);

  return loader;
};

export default PermissionsLoader;

const PermissionsCustomLoader = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-white z-30">
      <section className='flex flex-col items-center gap-4'>
        <p
          className={cx(
            "text-5xl animate-pulse font-semibold text-atomic-tangerine-300",
            gabarito.className,
          )}
        >
          Cake
          <span className="pl-1 text-amber-900">Harmony</span>
        </p>
        <div className='flex gap-2 text-gray-500 text-xs font-normal'>
          <p>Obteniendo permisos...</p>
          <SymbolIcon className='animate-spin'/>
        </div>
      </section>
    </div>
  );
};
