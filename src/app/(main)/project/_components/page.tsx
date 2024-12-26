"use client";

import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z, { date } from "zod";
import { addDays } from "date-fns";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "lucide-react";

import { createSprint } from "../../../../../actions/sprints";
import { toast, Toaster } from "sonner";
import { useRouter } from "next/navigation";

interface SprintCreation {
  projectTitle: string;
  projectId: string;
  projectKey: string;
  sprintKey: number;
}

export const sprintSchema = z.object({
  name: z.string().min(1, "Sprint name is required"),
  startDate: z.date(),
  endDate: z.date(),
});

const SprintCreationForm = ({
  projectTitle,
  projectId,
  projectKey,
  sprintKey,
}: SprintCreation) => {

  const router = useRouter();
  const [showForm, setShowForm] = useState(false);

  const [dateRange, setDateRange] = useState({
    from: new Date(),
    to: addDays(new Date(), 14),
  });

  const form = useForm({
    resolver: zodResolver(sprintSchema),
    defaultValues: {
      name: `${projectKey}-${sprintKey}`,
      startDate: dateRange.from,
      endDate: dateRange.to,
    },
  });

  const onSubmit = async (data: z.infer<typeof sprintSchema>) => {
    try {
      const response = await createSprint({
        projectId,
        data,
      });
      if (response.success) {
        toast.success("Sprint Created Sucessfully");
        router.refresh();
        console.log(response.message); // Notify the user of success
      } else {
        toast.error(response.message);
        console.error(response.message); // Handle errors appropriately
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center text-center">
        <h1 className="text-5xl font-semibold">{projectTitle}</h1>
        <Button
          className="mx-2"
          onClick={() => {
            setShowForm(!showForm);
          }}
        >
          {showForm ? "Cancel" : "Create New Sprint"}
        </Button>
      </div>

      <div className="flex flex-col border w-fit bg-black rounded-xl mt-5">
        <Toaster />
        {showForm && (
          <Card className="w-full h-full md:w-[487px] border:none shadow-xl bg-transparent border-transparent ">
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
                        <FormLabel>Sprint Name</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            readOnly
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
                    name="startDate"
                    render={({ field }) => (
                      <FormItem className="flex items-center text-center">
                        <FormLabel>Sprint Start Date :</FormLabel>
                        <FormControl>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button className="gap-2" variant={"ghost"}>
                                <Calendar />
                                {field.value
                                  ? new Date(field.value).toLocaleDateString()
                                  : "Select start date "}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent>
                              <div className="w-full">
                                <Input
                                  type="date"
                                  value={
                                    field.value
                                      ? new Date(field.value)
                                          .toISOString()
                                          .split("T")[0]
                                      : ""
                                  }
                                  onChange={(e) => {
                                    const newStartDate = new Date(
                                      e.target.value
                                    );
                                    setDateRange((prev) => ({
                                      ...prev,
                                      from: newStartDate,
                                      to: addDays(newStartDate, 14),
                                    }));
                                    field.onChange(newStartDate); // Update the form state
                                  }}
                                />
                              </div>
                            </PopoverContent>
                          </Popover>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem className="flex items-center text-center gap-2">
                        <FormLabel>Sprint End Date :</FormLabel>
                        <FormControl>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button className="gap-2" variant={"ghost"}>
                                <Calendar />
                                {field.value
                                  ? new Date(field.value).toLocaleDateString()
                                  : "Select end date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent>
                              <div className="w-full">
                                <Input
                                  type="date"
                                  value={
                                    field.value
                                      ? new Date(field.value)
                                          .toISOString()
                                          .split("T")[0]
                                      : ""
                                  }
                                  onChange={(e) => {
                                    const newEndDate = new Date(e.target.value);
                                    setDateRange((prev) => ({
                                      ...prev,
                                      to: newEndDate,
                                    }));
                                    field.onChange(newEndDate); // Update the form state
                                  }}
                                />
                              </div>
                            </PopoverContent>
                          </Popover>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button className="w-full uppercase">Create</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SprintCreationForm;
