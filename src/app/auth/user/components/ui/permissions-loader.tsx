'use client'

import { ReactNode, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { gabarito } from '@/fonts';
import { SymbolIcon } from '@radix-ui/react-icons';
import { cx } from 'class-variance-authority';
import { AppDispatch } from '@/redux/store';
import { setPermissions } from '@/app/auth/user/features/user.feature';

const PermissionsLoader = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [ loader, setLoader ] = useState<ReactNode | null>(<PermissionsCustomLoader />);

  useEffect(() => {
    const permissions = localStorage.getItem('permissions')
    const permissionsData = JSON.parse(permissions ?? '[]')
    if (permissionsData) {
      setLoader(null)
      dispatch(setPermissions(permissionsData))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

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
  )
}