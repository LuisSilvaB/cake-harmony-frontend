'use client'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useFormContext, SubmitHandler } from 'react-hook-form';
import { UserType } from '@/app/auth/user/types/user.type';
import { gabarito } from '@/fonts';
import { Button } from '@/components/ui';
import cx from '@/libs/cx';
import Icon from '@/components/ui/icon';
import { RegisterService } from '@/app/auth/register/services/register.service';

const registerService = new RegisterService();

const RegisterBodyForm: React.FC = () => {
  const { control, formState: { isValid }, handleSubmit } = useFormContext<Omit<UserType, "id" | "created_at">>() 
  
  
  const onSubmit: SubmitHandler<Omit<UserType, "id" | "created_at">> = async (data) => {
    try {
      if (!isValid) return;
      const userData = await registerService.registerUser(data);
      console.log(userData);  
    } catch (error) {
      console.error('Error during registration:', error);
    }
  }

  return (
    <form className="flex w-full flex-1 flex-col items-center justify-center gap-4" onSubmit={handleSubmit(onSubmit)}>
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
              <FormLabel>Nombre</FormLabel>
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

        <Button className="hover:text-whte mt-[10px] flex gap-2 border-atomic-tangerine-100 bg-atomic-tangerine-500 text-xs hover:bg-atomic-tangerine-600 hover:shadow-md">
          <span>Registrarse</span> 
          <Icon remixIconClass='ri-cake-3-line' size='lg' />
        </Button>
      </div>
    </form>
  );
}

export default RegisterBodyForm;