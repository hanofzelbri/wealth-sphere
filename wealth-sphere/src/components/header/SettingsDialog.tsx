"use client";

import { useState } from "react";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  StorageLocationEntity,
  storageLocationType,
} from "@/api-client/types.gen";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  storageLocationsControllerCreateMutation,
  storageLocationsControllerDeleteMutation,
  storageLocationsControllerFindAllOptions,
  storageLocationsControllerUpdateMutation,
} from "@/api-client/@tanstack/react-query.gen";
import { ConfirmDialog } from "../ui/confirm-dialog";

export default function SettingsDialog() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [storageLocationType, setStorageLocationType] =
    useState<storageLocationType>("exchange");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [storageLocationToDelete, setStorageLocationToDelete] =
    useState<StorageLocationEntity | null>(null);

  const storageLocations = useQuery({
    ...storageLocationsControllerFindAllOptions({}),
  });

  const handleCloseForm = () => {
    setName("");
    setImage("");
    setEditingId(null);
    setFormOpen(false);
  };

  const createStorageLocation = useMutation({
    ...storageLocationsControllerCreateMutation(),
    onSuccess: () => {
      handleCloseForm();
    },
  });

  const updateStorageLocation = useMutation({
    ...storageLocationsControllerUpdateMutation(),
    onSuccess: () => {
      handleCloseForm();
    },
  });

  const deleteStorageLocation = useMutation({
    ...storageLocationsControllerDeleteMutation(),
    onSuccess: () => {
      handleCloseForm();
    },
  });

  const isFormValid = name.trim() !== "" && image.trim() !== "";

  const handleSave = async () => {
    if (editingId) {
      await updateStorageLocation.mutateAsync({
        path: { id: editingId },
        body: {
          name,
          image,
          storageLocationType,
        },
      });
    } else {
      await createStorageLocation.mutateAsync({
        body: {
          name,
          image,
          storageLocationType,
        },
      });
    }
  };

  const handleEdit = (location: StorageLocationEntity) => {
    setName(location.name);
    setImage(location.image);
    setStorageLocationType(location.storageLocationType);
    setEditingId(location.id);
    setFormOpen(true);
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

          {!formOpen ? (
            <div className="py-4">
              <h3 className="mb-2 font-semibold">Existing Storage Locations</h3>
              <ul className="space-y-2">
                {(storageLocations?.data?.length ?? 0) > 0 &&
                  storageLocations.data?.map(
                    (location: StorageLocationEntity) => (
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
                            <span className="sr-only">
                              Edit {location.name}
                            </span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setStorageLocationToDelete(location)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">
                              Delete {location.name}
                            </span>
                          </Button>
                        </div>
                      </li>
                    )
                  )}
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
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="storageLocationType" className="text-right">
                    Type
                  </Label>
                  <Select
                    value={storageLocationType}
                    onValueChange={(value: storageLocationType) =>
                      setStorageLocationType(value)
                    }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a storage type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hardwareWallet">
                        Hardware Wallet
                      </SelectItem>
                      <SelectItem value="softwareWallet">
                        Software Wallet
                      </SelectItem>
                      <SelectItem value="exchange">Exchange</SelectItem>
                    </SelectContent>
                  </Select>
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

      <ConfirmDialog
        open={!!storageLocationToDelete}
        onOpenChange={(open) => !open && setStorageLocationToDelete(null)}
        onConfirm={() =>
          deleteStorageLocation.mutateAsync({
            path: { id: storageLocationToDelete?.id || "" },
          })
        }
        title="Delete Storage Location"
        description="Are you sure you want to delete this storage location? This action cannot be undone."
      />
    </>
  );
}
