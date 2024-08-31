'use client'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useFormContext, SubmitHandler, FieldErrors } from 'react-hook-form';
import { UserType } from '@/app/auth/user/types/user.type';
import { gabarito } from '@/fonts';
import { Button } from '@/components/ui';
import cx from '@/libs/cx';
import Icon from '@/components/ui/icon';
import { RegisterService } from '@/app/auth/register/services/register.service';
import { Link } from 'next-view-transitions';
import { useToast } from '@/hooks/useToast';
import useSession from '@/libs/supabase/use-session';
import { v4 } from "uuid"
import { useRouter } from 'next/navigation';

const registerService = new RegisterService();

const RegisterBodyForm: React.FC = () => {
  const { control, formState: { isValid }, handleSubmit } = useFormContext<Omit<UserType, "id" | "created_at">>() 
  const { toast } = useToast()
  const session = useSession()
  const router = useRouter(); 

  const onSubmit: SubmitHandler<Omit<UserType, "id" | "created_at">> = async (data) => {
    console.log("Form invalid");
    try {
      if (!isValid) {
        toast({
          title: "Error",
          description: "Complete los campos requeridos",
          duration: 5000,
        });
        return
      }
      const userData = await registerService.registerUser(
        session?.user
          ? { ...data, id: session.user.id }
          : { ...data, id: v4() },
      );

      if (!userData[0]) return;

      router.push("/auth/verify");
      
    } catch (error) {
      toast({
        title: "Error",
        description: "El usuario ya se encuentra registrado en el sistema",
        duration: 5000,
        variant: "destructive"
      });
    }
  }

  const onError = (error: FieldErrors<Omit<UserType, "id" | "created_at">>) => {
    console.log("Form error");
    toast({
      title: "Vefifique los campos ingresados",
      description: "Error al registrar",
      duration: 5000,
      variant: "destructive"
    });
  }

  return (
    <form
      className="flex w-full flex-1 flex-col items-center justify-center gap-4"
      onSubmit={handleSubmit(onSubmit, onError)}
    >
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
        <p className="text-sm font-normal">
          Ya tienes cuenta?{" "}
          <Link href="/auth/login" className="text-atomic-tangerine-500">
            Iniciar Sesión
          </Link>
        </p>
        <Button
          type="submit"
          className="hover:text-whte mt-[10px] flex gap-2 border-atomic-tangerine-100 bg-atomic-tangerine-500 text-xs hover:bg-atomic-tangerine-600 hover:shadow-md"
        >
          <span>Registrarse</span>
          <Icon remixIconClass="ri-cake-3-line" size="lg" />
        </Button>
      </div>
    </form>
  );
}

export default RegisterBodyForm;