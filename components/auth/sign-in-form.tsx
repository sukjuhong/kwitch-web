"use client";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "@/hooks/useSession";
import { Loader2 } from "lucide-react";
import React from "react";

export const signInSchema = z.object({
  id: z.string().min(3).max(20),
  password: z
    .string()
    .regex(
      new RegExp(/^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,15}$/),
      "Password must contain at least 8 characters, including letters, numbers, and special characters."
    ),
});

export default function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn } = useSession();

  const [loading, setLoading] = React.useState(false);

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      id: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof signInSchema>) => {
    setLoading(true);
    const dst = searchParams.get("redirect") || "/channels";
    const ok = await signIn(values);
    if (ok) {
      router.push(dst);
    }
    setLoading(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>id</FormLabel>
              <FormControl>
                <Input placeholder="id" {...field} />
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
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="password" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="bg-kookmin dark:text-white"
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            "Submit"
          )}
        </Button>
      </form>
    </Form>
  );
}
