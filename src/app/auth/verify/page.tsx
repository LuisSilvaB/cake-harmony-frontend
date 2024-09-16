'use client'

import React, { useEffect, useState } from 'react'
import cx from '@/utils/cx';
import { gabarito } from '@/fonts';
import { SymbolIcon } from '@radix-ui/react-icons';
import UserService from '../user/service/user.service';
import useSession from '@/libs/supabase/use-session';
import { useRouter } from 'next/navigation';
const { setAuthCokkie, getUserById } = new UserService()
import { useDispatch } from 'react-redux';
import { getUserByIdFeature } from '../user/features/user.feature'; 
import { AppDispatch } from '@/redux/store';

const AuthVerify = () => {
  const router = useRouter();
  const session = useSession()
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (!session) return ;
    const verifyUserV1 = async() => {
      const user = await dispatch(getUserByIdFeature(session.user.id ?? ''));
      if (!user?.payload) return router.push('/auth/register');
      setAuthCokkie(session.access_token ?? '');
      return router.push('/dashboard/pointOfSale');
    }
    // verifyUser();
    verifyUserV1();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session])

  return (
    <div className="w-full flex-1 flex items-center justify-center">
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
          <p>Obteniendo informacón espere un momento...</p>
          <SymbolIcon className='animate-spin'/>
        </div>
      </section>
    </div>
  );
}

export default AuthVerify