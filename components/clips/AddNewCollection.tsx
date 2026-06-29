import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useStore } from '@/stores/store';
import { useShallow } from "zustand/react/shallow";
import LineLoader from '../genreral/lineLoader';
import { showToaster } from '@/lib/utils';



export default function AddNewCollection({ show, onHide }: { show: boolean, onHide: () => void }) {
    const { createCollection, isCreating } = useStore(useShallow((state) => ({
        createCollection: state.createCollection,
        isCreating: state.collectionState.isfetching,
    })));
    const [newFolderName, setNewFolderName] = useState("");

    return (
        <>
            <Dialog open={show} onOpenChange={(isOpen) => {
                if (!isOpen && !isCreating) onHide(); // only close if not creating
            }}>
                <DialogContent className="z-9999 border-none">
                    <DialogHeader>
                        <DialogTitle>Create new folder</DialogTitle>
                        <DialogDescription>Enter a name for the new folder.</DialogDescription>
                    </DialogHeader>

                    <div
                        className="mt-4 flex flex-col space-y-4"
                    >
                        <Input
                            placeholder="Folder name"
                            value={newFolderName}
                            onChange={(e) => setNewFolderName(e.target.value)}
                            autoFocus
                        />

                        <div className="flex justify-end gap-2">
                            <Button variant="ghost" onClick={() => {
                                if (isCreating) return;
                                onHide();
                            }}>
                                Cancel
                            </Button>
                            <Button
                                onClick={async (e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    try {
                                        await createCollection(newFolderName);
                                        setNewFolderName("");
                                        onHide();
                                        showToaster("Folder created successfully", "success");
                                    } catch (err) {
                                        console.error('Failed to create collection', err);
                                    }
                                }}
                                disabled={!newFolderName || isCreating}
                                className='flex items-center gap-2 text-foreground rounded-2xl'

                            >
                                {
                                    isCreating ? <LineLoader /> : "Create"
                                }
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
