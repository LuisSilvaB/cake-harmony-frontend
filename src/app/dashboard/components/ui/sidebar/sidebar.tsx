'use client'
import React from 'react'
import cx from '@/libs/cx';
import { gabarito } from '@/fonts';
import { Button } from '@/components/ui';
import Icon from '@/components/ui/icon';
import { useAuth } from '@/hooks/useAuth.hook';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { PermissionType } from '@/app/auth/user/types/permissions.type';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';

const Sidebar = () => {
  const { handleGoogleLogout } = useAuth();
  const permissionsData = useSelector((state:RootState) => state.user.permissions);
  const sideBarItems = Array.isArray(permissionsData)
    ? permissionsData.filter((item: PermissionType) => !item.id_permission_main)
    : [];

  return (
    <div className="flex h-full max-w-10 flex-col items-center justify-start gap-2 border bg-white px-4 lg:max-w-56">
      <section className="flex h-full max-h-14 w-full items-center justify-start">
        <p
          className={cx(
            "text-2xl font-semibold text-atomic-tangerine-300",
            gabarito.className,
          )}
        >
          Cake
          <span className="pl-1 text-amber-900">Harmony</span>
        </p>
      </section>
      <Separator />
      {/** TODO: Add the permissions */}
      <section className="flex h-full w-full flex-1 flex-col gap-2 overflow-y-auto">
        {sideBarItems.map((item: PermissionType, index: number) => (
          <Link href={item.url ?? ""} key={index}>
            <Button
              className="flex w-full flex-row items-center justify-start gap-2"
              size="xs"
              variant={"ghost"}
            >
              <Icon remixIconClass={item?.icon ?? ""} size="xl" color="atomic-400" />
              <span className="text-xs">
                {item.description[0].toUpperCase() +
                  item.description.substring(1).toLowerCase()}
              </span>
            </Button>
          </Link>
        ))}
      </section>
      <Separator />
      <section className="flex h-11 w-full items-center justify-start">
        <Button
          variant={"ghost"}
          onClick={handleGoogleLogout}
          size={"xs"}
          className="flex w-full flex-row items-center justify-start gap-2"
        >
          {" "}
          <Icon
            remixIconClass="ri-door-open-fill"
            size="xl"
            color="atomic-400"
          />
          <span className="text-xs">Cerrar sesión</span>
        </Button>
      </section>
    </div>
  );
}

export default Sidebar