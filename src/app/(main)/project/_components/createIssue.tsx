"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Form,
  FormField,
  FormControl,
  FormMessage,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { getOrganizationUsers } from "../../../../../actions/organization";
import { createIssue, dataSchema } from "../../../../../actions/issues";
import { BarLoader } from "react-spinners";
import { IssueStatus, User } from "@prisma/client";
import { Textarea } from "@/components/ui/textarea";
import MDEditor from "@uiw/react-md-editor"
import { toast, Toaster } from "sonner";

interface IssueCreationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  sprintId: string;
  status: IssueStatus;
  projectId: string;
  onIssueCreated: () => void;
  orgId: string;
}

const issueSchema = z.object({
  title: z.string().min(1, "Title is required"),
  assigneeId: z.string().cuid().or(z.literal("")),
  description: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
});

const IssueCreationDrawer = ({
  isOpen,
  onClose,
  sprintId,
  status,
  projectId,
  onIssueCreated,
  orgId,
}: IssueCreationDrawerProps) => {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  const form = useForm<z.infer<typeof issueSchema>>({
    resolver: zodResolver(issueSchema),
    defaultValues: {
      title: "",
      priority: "MEDIUM",
      description: "",
      assigneeId: "",
    },
  });

  const onSubmit = async (formData: z.infer<typeof issueSchema>) => {
    try {        
        setSubmitting(true);
        const data : dataSchema = {
            title: formData.title,
            assigneeId: formData.assigneeId,
            priority: formData.priority,
            description: formData.description,
            status : status,
            sprintId: sprintId, 
        }
        console.log(data);
        const response = await createIssue({projectId, data});
        onClose();
        onIssueCreated();
        form.reset();
        toast.success("Issue created successfully")
    } catch (error) {
        
    } finally{
        setSubmitting(false);
    }
  };

  const fetchUsers = async () => {
    if (orgId) {
      try {
        const usersData = await getOrganizationUsers(orgId);
        if (usersData.success && usersData.data) {
          setUsers(usersData.data);
        } else {
          setUsers([]);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setUsers([]); // Handle unexpected errors
      }
    }
  };

  useEffect(() => {
    if (orgId) {
      setLoading(true);
      fetchUsers().finally(() => setLoading(false));
    }
  }, [orgId]); // Fetch users whenever orgId changes

  return (
    <Drawer open={isOpen} onClose={onClose}>
      <DrawerContent>
      <Toaster/>
        <DrawerHeader>
          <DrawerTitle>Create New Issue</DrawerTitle>
        </DrawerHeader>
        {loading && <BarLoader width={"100%"} color="white" />}
        <Form {...form}>
          <form className="p-5 flex-col" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter issue title"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="assigneeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assignee</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    {...form}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Assignee" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                    <MDEditor {...field}/>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    {...form}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Priority" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="LOW">Low</SelectItem>
                        <SelectItem value="MEDIUM">Medium</SelectItem>
                        <SelectItem value="HIGH">High</SelectItem>
                        <SelectItem value="URGENT">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <Button type="submit" disabled={submitting} className="mt-3 font-semibold w-full">
                {submitting ? "Creating..." : "Create Issue"}
            </Button>
          </form>
        </Form>
      </DrawerContent>
    </Drawer>
  );
};

export default IssueCreationDrawer;
