'use client';

import { Control } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { CreditCard, Wallet, Building2 } from 'lucide-react';
import type { CreateOrderRequest } from '@/entities/order';

type PaymentMethodSelectionProps = {
  control: Control<CreateOrderRequest>;
};

const PAYMENT_METHODS = [
  {
    id: 'credit_card',
    name: 'Credit Card',
    icon: CreditCard,
  },
  {
    id: 'paypal',
    name: 'PayPal',
    icon: Wallet,
  },
  {
    id: 'bank_transfer',
    name: 'Bank Transfer',
    icon: Building2,
  },
];

export function PaymentMethodSelection({ control }: PaymentMethodSelectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Payment Method</h2>
      
      <FormField
        control={control}
        name="payment_method"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="space-y-3"
              >
                {PAYMENT_METHODS.map(method => {
                  const Icon = method.icon;
                  return (
                    <div key={method.id} className="flex items-start space-x-3">
                      <RadioGroupItem value={method.id} id={method.id} className="mt-1" />
                      <Label
                        htmlFor={method.id}
                        className="flex-1 cursor-pointer"
                      >
                        <Card className={field.value === method.id ? 'border-primary' : ''}>
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                              <Icon className="h-5 w-5 text-muted-foreground" />
                              <p className="font-semibold">{method.name}</p>
                            </div>
                          </CardContent>
                        </Card>
                      </Label>
                    </div>
                  );
                })}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

