"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useProject } from "@/lib/queries/projects";
import {
  useTasks,
  useCreateTask,
  useUpdateTask,
  useToggleTask,
  useDeleteTask,
} from "@/lib/queries/tasks";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  Pencil,
} from "lucide-react";
import { toast } from "sonner";

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [editingTask, setEditingTask] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const { data: project, isLoading: projectLoading } = useProject(projectId);
  const { data: tasks, isLoading: tasksLoading } = useTasks(projectId);
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const toggleTask = useToggleTask();
  const deleteTask = useDeleteTask();

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) {
      toast.error("Please enter a task name");
      return;
    }

    await createTask.mutateAsync({ projectId, title: newTaskTitle });
    setNewTaskTitle("");
  };

  const handleEditTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask) return;
    if (!editingTask.title.trim()) {
      toast.error("Please enter a task name");
      return;
    }

    await updateTask.mutateAsync({
      taskId: editingTask.id,
      title: editingTask.title,
      projectId,
    });
    setEditingTask(null);
  };

  const handleToggleTask = async (taskId: string, currentStatus: boolean) => {
    await toggleTask.mutateAsync({
      taskId,
      projectId,
      isDone: !currentStatus,
    });
  };

  const handleDeleteTask = async (taskId: string) => {
    await deleteTask.mutateAsync({ taskId, projectId });
  };

  if (projectLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-8 w-64" />
        </div>
        <Skeleton className="h-48" />
      </div>
    );
  }

  if (!project) {
    return (
      <Card className="flex flex-col items-center justify-center p-16 text-center">
        <h3 className="text-xl font-semibold">Project not found</h3>
        <p className="mt-2 text-muted-foreground">
          The project you&apos;re looking for doesn&apos;t exist or has been
          deleted.
        </p>
        <Button asChild className="mt-6">
          <Link href="/app">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </Card>
    );
  }

  const completedCount = tasks?.filter((t) => t.is_done).length || 0;
  const totalCount = tasks?.length || 0;
  const progressPercentage =
    totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/app">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>

        <div className="flex-1">
          <h1 className="text-4xl font-bold tracking-tight">{project.name}</h1>
          <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
            <span>
              {totalCount} {totalCount === 1 ? "task" : "tasks"}
            </span>
            <span>•</span>
            <span>{completedCount} completed</span>
            {totalCount > 0 && (
              <>
                <span>•</span>
                <span>{Math.round(progressPercentage)}% done</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {totalCount > 0 && (
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      )}

      {/* Add Task Form */}
      <Card className="p-6">
        <form onSubmit={handleCreateTask} className="flex gap-3">
          <Input
            placeholder="Add a new task..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            disabled={createTask.isPending}
            className="flex-1"
          />
          <Button
            type="submit"
            disabled={createTask.isPending}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Task
          </Button>
        </form>
      </Card>

      {/* Tasks List */}
      {tasksLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-4">
              <Skeleton className="h-6 w-3/4" />
            </Card>
          ))}
        </div>
      ) : tasks && tasks.length === 0 ? (
        <Card className="flex flex-col items-center justify-center border-dashed p-16 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <CheckCircle2 className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="mt-6 text-xl font-semibold">No tasks yet</h3>
          <p className="mt-2 max-w-sm text-muted-foreground">
            Add your first task to start organizing your work for this project.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {tasks?.map((task) => (
            <Card
              key={task.id}
              className="group transition-all hover:shadow-md"
            >
              <div className="flex items-center gap-4 p-4">
                <button
                  onClick={() => handleToggleTask(task.id, task.is_done)}
                  className="shrink-0 transition-colors hover:text-primary"
                >
                  {task.is_done ? (
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                  ) : (
                    <Circle className="h-6 w-6 text-muted-foreground" />
                  )}
                </button>

                <span
                  className={`flex-1 text-base ${
                    task.is_done
                      ? "text-muted-foreground line-through"
                      : "text-foreground"
                  }`}
                >
                  {task.title}
                </span>

                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 transition-opacity group-hover:opacity-100"
                    onClick={() =>
                      setEditingTask({ id: task.id, title: task.title })
                    }
                  >
                    <Pencil className="h-4 w-4 text-muted-foreground" />
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Task</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this task? This action
                          cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteTask(task.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Task Dialog */}
      <Dialog
        open={!!editingTask}
        onOpenChange={(open) => !open && setEditingTask(null)}
      >
        <DialogContent>
          <form onSubmit={handleEditTask}>
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
              <DialogDescription>Update the task name.</DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Label htmlFor="edit-task">Task Name</Label>
              <Input
                id="edit-task"
                value={editingTask?.title || ""}
                onChange={(e) =>
                  setEditingTask(
                    editingTask
                      ? { ...editingTask, title: e.target.value }
                      : null
                  )
                }
                placeholder="Task name"
                className="mt-2"
                autoFocus
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditingTask(null)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateTask.isPending}>
                {updateTask.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
