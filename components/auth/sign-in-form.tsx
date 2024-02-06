"use client";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import React from "react";
import { useToast } from "../ui/use-toast";
import { useAuth } from "@/lib/auth";
import { Checkbox } from "../ui/checkbox";

export const signInSchema = z.object({
  username: z.string().min(3).max(20),
  password: z
    .string()
    .regex(
      new RegExp(/^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,15}$/),
      "Password must contain at least 8 characters, including letters, numbers, and special characters."
    ),
  isRemember: z.boolean(),
});

export default function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn } = useAuth();
  const { toast } = useToast();

  const [loading, setLoading] = React.useState(false);

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      username: "",
      password: "",
      isRemember: false,
    },
  });

  const onSubmit = async (values: z.infer<typeof signInSchema>) => {
    setLoading(true);
    const dst = searchParams.get("redirect") || "/channels";
    const ok = await signIn(values);

    if (ok) {
      router.replace(dst);
    } else {
      toast({
        title: "Your sign in request is failed.",
        description: "Invalid ID or password.",
        variant: "destructive",
      });
    }

    setLoading(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="username" {...field} />
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
        <FormField
          control={form.control}
          name="isRemember"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Remember me</FormLabel>
              </div>
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
