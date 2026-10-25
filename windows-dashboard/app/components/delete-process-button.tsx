"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { Button } from "@/components/ui/button";
import { useDeleteProcess } from "@/app/hooks/use-delete-process";

export default function DeleteProcessButton({
  pid,
  name,
  redirectTo,
}: {
  pid: number;
  name: string;
  redirectTo?: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useDeleteProcess();

  function handleConfirm() {
    mutate(
      { pid, name },
      {
        onSuccess: () => {
          setOpen(false);
          if (redirectTo) router.push(redirectTo);
        },
        onError: () => setOpen(false),
      }
    );
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        render={<Button variant="destructive" size="sm" disabled={isPending} />}
      >
        {isPending ? "Deleting..." : "Delete"}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete process?</AlertDialogTitle>
          <AlertDialogDescription>
            This will terminate &quot;{name}&quot; (PID {pid}).
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={handleConfirm}
            disabled={isPending}
          >
            {isPending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
