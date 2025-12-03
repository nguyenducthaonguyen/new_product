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
import type { CreateOrderRequest } from '@/entities/order';

type ShippingMethodSelectionProps = {
  control: Control<CreateOrderRequest>;
};

const SHIPPING_METHODS = [
  {
    id: 'standard',
    name: 'Standard Shipping',
    description: '5-7 business days',
    cost: 0.00,
  },
  {
    id: 'express',
    name: 'Express Shipping',
    description: '2-3 business days',
    cost: 10.00,
  },
  {
    id: 'overnight',
    name: 'Overnight Shipping',
    description: '1 business day',
    cost: 25.00,
  },
];

export function ShippingMethodSelection({ control }: ShippingMethodSelectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Shipping Method</h2>
      
      <FormField
        control={control}
        name="shipping_method"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="space-y-3"
              >
                {SHIPPING_METHODS.map(method => (
                  <div key={method.id} className="flex items-start space-x-3">
                    <RadioGroupItem value={method.id} id={method.id} className="mt-1" />
                    <Label
                      htmlFor={method.id}
                      className="flex-1 cursor-pointer"
                    >
                      <Card className={field.value === method.id ? 'border-primary' : ''}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold">{method.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {method.description}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">
                                {method.cost === 0 ? 'FREE' : `$${method.cost.toFixed(2)}`}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

