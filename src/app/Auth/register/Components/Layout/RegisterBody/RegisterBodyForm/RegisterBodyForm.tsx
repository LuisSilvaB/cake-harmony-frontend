import React, {  useEffect, useState } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';
import { z } from 'zod';
import { RegisterSchema } from '@/app/auth/register/schema/register.schema';
import { UserType } from '@/app/auth/user/types/user.type';
import cx from '@/libs/cx';
import { gabarito } from '@/fonts';
// Define the type for the form using zod
type RegisterFormType = z.infer<typeof RegisterSchema>;

const RegisterBodyForm: React.FC = () => {
  const [ imageUrl, setImageUrl ] = useState<string>("");

  function onSubmit(data: RegisterFormType) {
    console.log(data);
  }

  const { control, getValues } = useFormContext<Omit<UserType, "id" | "created_at">>()
  const {...values} = getValues();

  useEffect(() => {
    setImageUrl(values.image_url);
  }, [values.image_url])

  return (
    <form className="flex w-full flex-1 flex-col items-center justify-center gap-4">
      <div className="flex h-3/4 w-2/4 flex-col justify-center gap-4">
        <div>
          <h3
            className={cx(
              "text-center text-2xl font-bold text-atomic-tangerine-500",
              gabarito.className,
            )}
          >
            Registrarse
          </h3>
        </div>
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  value={field.value}
                  onChange={field.onChange}
                  type="text"
                  placeholder="Name"
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Correo</FormLabel>
              <FormControl>
                <Input
                  value={field.value}
                  onChange={field.onChange}
                  type="text"
                  placeholder="Correo"
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contraseña</FormLabel>
              <FormControl>
                <Input
                  value={field.value}
                  onChange={field.onChange}
                  type="text"
                  placeholder="contraseña"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </form>
  );
}

export default RegisterBodyForm;