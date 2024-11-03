"use client";

import { useEffect, useState } from "react";
import { Settings, Edit, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { storageLocationService } from "@/services/storage-location.service";
import { LoadingState } from "./LoadingState";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

interface StorageLocation {
  id: string;
  name: string;
  image: string;
}

export default function SettingsDialog() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [storageLocations, setStorageLocations] = useState<StorageLocation[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchStorageLocations();

    const storageLocationSubscription = storageLocationService
      .getStorageLocations()
      .subscribe((fetchedStorageLocations) => {
        setStorageLocations(fetchedStorageLocations || []);
      });

    return () => {
      storageLocationSubscription.unsubscribe();
    };
  }, []);

  const fetchStorageLocations = async () => {
    try {
      setIsLoading(true);
      await storageLocationService.fetchStorageLocations();
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching storageLocations:", error);
      setIsLoading(false);
    }
  };

  const isFormValid = name.trim() !== "" && image.trim() !== "";

  const handleSave = () => {
    if (!isFormValid) return;
    if (editingId) {
      setStorageLocations((locations) =>
        locations.map((loc) =>
          loc.id === editingId ? { ...loc, name, image } : loc
        )
      );
    } else {
      const newLocation: StorageLocation = {
        id: Date.now().toString(),
        name,
        image,
      };
      setStorageLocations((prev) => [...prev, newLocation]);
    }
    handleCloseForm();
  };

  const handleEdit = (location: StorageLocation) => {
    setName(location.name);
    setImage(location.image);
    setEditingId(location.id);
    setFormOpen(true);
  };

  const handleDelete = (id: string) => {
    setStorageLocations((locations) =>
      locations.filter((loc) => loc.id !== id)
    );
  };

  const handleCloseForm = () => {
    setName("");
    setImage("");
    setEditingId(null);
    setFormOpen(false);
  };

  return (
    <>
      <Button variant="ghost" size="icon" onClick={() => setDialogOpen(true)}>
        <Settings className="h-4 w-4" />
        <span className="sr-only">Open Settings</span>
      </Button>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Storage Settings</DialogTitle>
            <DialogDescription>Manage your storage locations</DialogDescription>
          </DialogHeader>
          {isLoading ? (
            <LoadingState />
          ) : !formOpen ? (
            <div className="py-4">
              <h3 className="mb-2 font-semibold">Existing Storage Locations</h3>
              <ul className="space-y-2">
                {storageLocations.map((location) => (
                  <li
                    key={location.id}
                    className="flex items-center justify-between p-2 bg-secondary rounded-md"
                  >
                    <div className="flex items-center space-x-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Avatar>
                              <AvatarImage
                                src={location.image}
                                className="w-8 h-8 rounded-full"
                              />
                              <AvatarFallback>
                                {location.name} Icon
                              </AvatarFallback>
                            </Avatar>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{location.name} Icon</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <span>{location.name}</span>
                    </div>
                    <div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(location)}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit {location.name}</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(location.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete {location.name}</span>
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
              <Button className="mt-4" onClick={() => setFormOpen(true)}>
                <Plus className="h-4 w-4" />
                <span>Add New Location</span>
              </Button>
            </div>
          ) : (
            <>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="image" className="text-right">
                    Image
                  </Label>
                  <Input
                    id="image"
                    type="url"
                    placeholder="Enter image URL"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={handleCloseForm}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={!isFormValid}>
                  {editingId ? "Update" : "Add"}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
