"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export type Task = {
  id: string;
  project_id: string;
  user_id: string;
  title: string;
  is_done: boolean;
  created_at: string;
};

// Query: Get tasks by project
export function useTasks(projectId: string) {
  const supabase = createClient();

  return useQuery({
    queryKey: ["tasks", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Task[];
    },
    enabled: !!projectId,
  });
}

// Mutation: Create task
export function useCreateTask() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      projectId,
      title,
    }: {
      projectId: string;
      title: string;
    }) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("tasks")
        .insert({
          project_id: projectId,
          title,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data as Task;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["tasks", data.project_id] });
      toast.success("Task created");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

// Mutation: Toggle task completion
export function useToggleTask() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      taskId,
      isDone,
    }: {
      taskId: string;
      projectId: string;
      isDone: boolean;
    }) => {
      const { data, error } = await supabase
        .from("tasks")
        .update({ is_done: isDone })
        .eq("id", taskId)
        .select()
        .single();

      if (error) throw error;
      return data as Task;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["tasks", data.project_id] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

// Mutation: Update task title
export function useUpdateTask() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      taskId,
      title,
    }: {
      taskId: string;
      title: string;
      projectId: string;
    }) => {
      const { data, error } = await supabase
        .from("tasks")
        .update({ title })
        .eq("id", taskId)
        .select()
        .single();

      if (error) throw error;
      return data as Task;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["tasks", data.project_id] });
      toast.success("Task updated");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

// Mutation: Delete task
export function useDeleteTask() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      taskId,
      projectId,
    }: {
      taskId: string;
      projectId: string;
    }) => {
      const { error } = await supabase.from("tasks").delete().eq("id", taskId);

      if (error) throw error;
      return projectId;
    },
    onSuccess: (projectId) => {
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
      toast.success("Task deleted");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}
