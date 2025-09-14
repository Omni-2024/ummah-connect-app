"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/base/input";
import { Label } from "@/components/base/label";
import Button from "@/components/base/button";
import { Toast } from "@/components/base/toast";
import { invalidateQueries } from "@/app/providers";
import { useCategoriesState } from "@/features/categories/context/useCategoryState";

const TITLE: Record<string, Record<string, string>> = {
  profession: { add: "Add profession", edit: "Edit profession" },
  specialist: { add: "Add specialist", edit: "Edit specialist" },
};

const CTA: Record<string, Record<string, string>> = {
  profession: { add: "Create profession", edit: "Update profession" },
  specialist: { add: "Create specialist", edit: "Update specialist" },
};

export default function CategoryAddEditModal() {
  const { open, entity, action, initialValue, mutationParams, onSubmit, closeModal } =
      useCategoriesState();

  const [name, setName] = useState("");

  useEffect(() => {
    if (open) setName(initialValue ?? "");
    else setName("");
  }, [open, initialValue]);

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      if (!onSubmit) return;
      return onSubmit({ name: name.trim(), ...(mutationParams ?? {}) });
    },
    onSuccess: () => {
      invalidateQueries(["categories"]);
      Toast.success(`${entity} ${action === "add" ? "added" : "updated"} successfully`);
      closeModal();
    },
    onError: () => {
      Toast.error(`Failed to ${action} ${entity}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !onSubmit) return;
    mutate();
  };

  return (
      <Dialog open={open} onOpenChange={closeModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center pb-4">
            <DialogTitle className="text-xl font-semibold text-gray-900">
              {TITLE[entity][action]}
            </DialogTitle>
            <p className="text-sm text-gray-500 mt-1">
              {action === "add" ? `Create a new ${entity}` : `Update the ${entity} details`}
            </p>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 p-3">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                {entity === "profession" ? "Profession Name" : "Specialist Name"}
              </Label>
              <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={entity === "profession" ? "e.g., Plumbing" : "e.g., Pipe Fitter"}
                  className="h-11 border-gray-200 focus:border-cyan-400 focus:ring-cyan-400"
                  required
                  autoFocus
                  disabled={isPending}
              />
            </div>

            <DialogFooter className="gap-3 pt-4">
              <Button
                  type="button"
                  variant="secondary"
                  onClick={closeModal}
                  className="flex-1 h-11 border-gray-200 hover:bg-gray-50 bg-transparent"
                  disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                  variant="primary"
                  type="submit"
                  disabled={isPending || !name.trim()}
              >
                {isPending ? "Saving..." : CTA[entity][action]}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
  );
}
