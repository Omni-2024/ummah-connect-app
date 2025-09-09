"use client";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/base/Dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/base/Select";
import Button from "@/components/base/Button";
import Checkbox from "@/components/base/Checkbox";
import Label from "@/components/base/form/Label";
import { useExploreState } from "@/features/explore/context/useExploreState";
import {useExploreFilters} from "@/features/explore/context/useExploreFilters";

interface FilterModalProps {
  showModal: boolean;
  handleModalChange: (open: boolean) => void;
  resetPage?: () => void;
}

const FilterModal = ({ showModal, handleModalChange, resetPage }: FilterModalProps) => {
  const { setSearchTerm, setOffset, setLimit } = useExploreState();
  const { categories, profession, specialties, changeProfession, toggleSpecialty } =
      useExploreFilters(resetPage);

  const resetFilters = () => {
    setSearchTerm("");
    setOffset(0);
    setLimit(9);
    changeProfession(""); // clears profession + specialists
  };

  const activeCategory = categories?.find((c) => c.id === profession);
  const specialists = activeCategory?.specialists ?? []; // always an array


  return (
      <Dialog open={showModal} onOpenChange={handleModalChange}>
        <DialogContent className="h-full max-h-screen max-w-screen-lg lg:h-auto lg:max-h-full lg:max-w-3xl">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <DialogTitle>Filters</DialogTitle>
            </div>
          </DialogHeader>

          <div className="h-dvh overflow-y-auto p-5 scrollbar-thin lg:h-auto">
            {/* Profession */}
            <div className="space-y-4">
              <label className="font-primary text-lg font-bold">Profession</label>
              <Select onValueChange={changeProfession} value={profession || "all"}>
                <SelectTrigger>
                  <SelectValue placeholder>{activeCategory?.name || "All"}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem key="all" value="all">All</SelectItem>
                  {categories?.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Specialists */}
            {profession && specialists.length > 0 && (
                <div className="mt-6 space-y-3">
                  <label className="font-primary text-lg font-bold">Specialists</label>
                  <div className="grid grid-cols-1 gap-2">
                    {specialists.map((s: { id: string; name: string }) => {
                      const checked = specialties.includes(s.id);
                      return (
                          <div key={s.id} className="flex items-center gap-2">
                            <Checkbox
                                id={s.id}
                                checked={checked}
                                onCheckedChange={() => toggleSpecialty(s.id)}
                            />
                            <Label htmlFor={s.id} className="select-none">
                              {s.name}
                            </Label>
                          </div>
                      );
                    })}
                  </div>
                </div>
            )}


            {/* Mobile CTA bar */}
            <div className="fixed bottom-0 left-0 right-0 flex flex-col space-y-2 bg-white px-2 py-4 lg:hidden">
              <Button onClick={() => handleModalChange(false)} variant="primary">
                Show Results
              </Button>
              <Button onClick={resetFilters} variant="secondary" className="text-primary-500">
                Clear All
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
  );
};

export default FilterModal;
