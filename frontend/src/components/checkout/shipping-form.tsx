'use client';

import { Control } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { CreateOrderRequest } from '@/entities/order';

type ShippingFormProps = {
  control: Control<CreateOrderRequest>;
};

const COUNTRIES = [
  { value: 'US', label: 'United States' },
  { value: 'VN', label: 'Vietnam' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'CA', label: 'Canada' },
  { value: 'AU', label: 'Australia' },
  { value: 'DE', label: 'Germany' },
  { value: 'FR', label: 'France' },
  { value: 'JP', label: 'Japan' },
];

export function ShippingForm({ control }: ShippingFormProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Shipping Information</h2>
      
      <FormField
        control={control}
        name="shipping_info.full_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Full Name
              {' '}
              <span className="text-destructive">*</span>
            </FormLabel>
            <FormControl>
              <Input {...field} placeholder="John Doe" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="shipping_info.email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Email
              {' '}
              <span className="text-destructive">*</span>
            </FormLabel>
            <FormControl>
              <Input {...field} type="email" placeholder="john@example.com" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="shipping_info.phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Phone
              {' '}
              <span className="text-destructive">*</span>
            </FormLabel>
            <FormControl>
              <Input {...field} type="tel" placeholder="+1234567890" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="shipping_info.address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Address
              {' '}
              <span className="text-destructive">*</span>
            </FormLabel>
            <FormControl>
              <Input {...field} placeholder="123 Main St" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="shipping_info.city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                City
                {' '}
                <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input {...field} placeholder="San Francisco" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="shipping_info.postal_code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Postal Code
                {' '}
                <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input {...field} placeholder="94102" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name="shipping_info.country"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Country
              {' '}
              <span className="text-destructive">*</span>
            </FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a country" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {COUNTRIES.map(country => (
                  <SelectItem key={country.value} value={country.value}>
                    {country.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

