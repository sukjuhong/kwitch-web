"use client";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "@/hooks/useSession";

const formSchema = z.object({
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
  const params = useParams();
  const { session, update } = useSession();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const res = await fetch("/api/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    // TODO: If login is failed, show error message.
    if (res.ok) {
      update({
        user: {
          id: 1,
          username: "test",
          avatar: "https://picsum.photos/seed/picsum/100/100",
        },
      });
      if (params?.redirect) router.push(params.redirect as string);
      else router.push("/channels");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="username" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
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
              <FormDescription>This is your private password.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* TODO: Button Loading Animation */}
        <Button type="submit" className="bg-kookmin">
          Submit
        </Button>
      </form>
    </Form>
  );
}
