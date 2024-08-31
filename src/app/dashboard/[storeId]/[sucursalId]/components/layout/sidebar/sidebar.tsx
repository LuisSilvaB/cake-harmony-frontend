'use client'
import React from 'react'
import cx from '@/libs/cx';
import { gabarito } from '@/fonts';
import { Label, Select, SelectTrigger, SelectValue, SelectContent, SelectItem, Button } from '@/components/ui';
import Icon from '@/components/ui/icon';
import { useAuth } from '@/hooks/useAuth.hook';

const Sidebar = () => {

  const { handleGoogleLogout } = useAuth();
  
  return (
    <div className="flex h-full max-w-10 flex-col items-center justify-start gap-2 border bg-white px-4 lg:max-w-56">
      <section className="flex h-full max-h-20 w-full items-center justify-start">
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
      <section className="flex w-full flex-col gap-1">
        <Label className="mb-2 text-sm font-semibold text-gray-500">
          {" "}
          Sucursal{" "}
        </Label>
        <Select>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecciona una sucursal" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sucursal 1">sucursal 1</SelectItem>
            <SelectItem value="sucursal 2">sucursal 2</SelectItem>
            <SelectItem value="sucursal 3">sucursal 3</SelectItem>
          </SelectContent>
        </Select>
      </section>
      {/** TODO: Add the permissions */}
      <section className="flex h-full w-full flex-1 flex-col overflow-y-auto border"></section>
      <section className="flex h-14 w-full items-center justify-start">
        <Button
          variant={"ghost"}
          onClick={handleGoogleLogout}
          className="flex w-full flex-row items-center justify-center gap-2"
        >
          {" "}
          <Icon
            remixIconClass="ri-door-open-fill"
            size="xl"
            color="atomic-400"
          />
          <span>Cerrar sesión</span>
        </Button>
      </section>
    </div>
  );
}

export default Sidebar