"use client";
import OrganizationSwitch from "@/components/organizationSwitcher";
import { useOrganization, useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import {
  Form,
  FormField,
  FormMessage,
  FormControl,
  FormItem,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createProject } from "../../../../../actions/project";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "sonner";

const formSchema = z.object({
  name: z.string().min(1, "Project Name is required"),
  key: z
    .string()
    .min(1, "Key is required")
    .max(10, "Key can't be more than 10 characters"),
  description: z.string().optional(),
});

const Page = () => {
  //Double checking if user is admin or not
  const { isLoaded, membership } = useOrganization();
  const isUserLoaded = useUser().isLoaded;
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      const response = await createProject(data);
      toast.success("Project Created Successfully");
      if (response && response.data) {
        router.push(`/project/${response.data.id}`);
      } else {
        console.error("Unexpected response format", response);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded && isUserLoaded && membership) {
      setIsAdmin(membership.role === "org:admin"); //Check if user is admin or not
    }
  }, [isLoaded, isUserLoaded, membership]);

  if (!isLoaded && !isUserLoaded) {
    return null;
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col justify-center items-center gap-4">
        <h1>Sorry, Only Admins can create projects</h1>
        <OrganizationSwitch />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col justify-center items-center text-center gap-4">
        <h1 className="text-6xl uppercase tracking-tighter font-semibold bg-gradient-to-br from-gray-700 via-blue-100 to-gray-400 bg-clip-text text-transparent py-4 ">
          Create new Project
        </h1>
        <Toaster />
        <Card className="w-full h-full md:w-[487px] border:none shadow-xl bg-transparent border-transparent">
          <div className="px-7"></div>
          <CardContent className="p-7">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Project Name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="key"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter Project Key"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Description"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button disabled={loading} className="w-full uppercase">
                  Create
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Page;
