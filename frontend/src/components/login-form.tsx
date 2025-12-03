'use client';

import type { LoginFormData, UserResponse } from '@/entities/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { login } from '@/actions/auth-action';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { createLoginFormSchema } from '@/entities/user';
import { useUserStore } from '@/stores/user-store';

export default function LoginForm() {
  const t = useTranslations();
  const router = useRouter();
  const { setUser } = useUserStore();
  const [isPending, startTransition] = useTransition();
  const [hidePassword, setHidePassword] = useState(true);
  const [serverMessage, setServerMessage] = useState<{ success: boolean; message: string } | null>(
    null,
  );

  const LoginFormSchema = createLoginFormSchema(t);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      username: '',
      password: '',
    },
    mode: 'onBlur',
  });

  const onSubmit = async (data: LoginFormData) => {
    setServerMessage(null);

    startTransition(async () => {
      const result = await login(data);

      // If login successful and we have user data, save to Zustand
      if (result.success && result.data) {
        setUser(result.data as UserResponse);
        // Redirect to the URL returned from server
        if (result.redirectUrl) {
          router.push(result.redirectUrl);
        } else {
          router.push('/');
        }
        router.refresh();
      } else {
        // Show error message
        setServerMessage(result);
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted p-4">
      <Card className="w-full max-w-md bg-card text-card-foreground shadow-sm">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">{t('login.title')}</CardTitle>
          <CardDescription>{t('login.sub_title')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('login.username')}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder={t('login.username_placeholder')}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('login.password')}</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          {...field}
                          type={hidePassword ? 'password' : 'text'}
                          placeholder={t('login.password_placeholder')}
                          disabled={isPending}
                        />
                      </FormControl>
                      <button
                        type="button"
                        onClick={() => setHidePassword(!hidePassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 transition-colors"
                        disabled={isPending}
                      >
                        {hidePassword
                          ? (
                              <EyeOff className="h-4 w-4" />
                            )
                          : (
                              <Eye className="h-4 w-4" />
                            )}
                      </button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full h-10 font-medium" disabled={isPending}>
                {isPending
                  ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t('login.signing_in')}
                      </>
                    )
                  : (
                      t('login.sign_in')
                    )}
              </Button>

              {serverMessage && (
                <div
                  className={`flex items-center gap-2 text-sm p-3 rounded-md ${
                    serverMessage.success
                      ? 'bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800'
                      : 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800'
                  }`}
                >
                  {serverMessage.message}
                </div>
              )}
            </form>
          </Form>

          <div className="mt-6 text-center">
            <p className="text-sm">
              {t('login.no_account')}
              <button type="button" className="font-medium underline-offset-4 hover:underline">{t('login.sign_up')}</button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
