import React, { useEffect, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import { useStore } from '@/stores/store';
import { useShallow } from 'zustand/react/shallow';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import LineLoader from '../genreral/lineLoader';
import { showToaster } from '@/lib/utils';
import { getAllCollections } from '@/services/collection';

const platforms = [
    { value: '', label: 'All Platforms' },
    { value: 'youtube', label: 'YouTube' },
    { value: 'tiktok', label: 'TikTok' },
    { value: 'instagram', label: 'Instagram' },
];

const folders = [
    { value: '', label: 'General' },
    { value: 'tiktok', label: 'TikTok' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'youtube', label: 'YouTube' },
    { value: 'facebook', label: 'Facebook' },
];

export default function ClipsFilterSelection() {
    const { clipFilters, setFilters, onPlatformChange, onFolderChange, onSearchChange, createCollection, isCreating, getAllCollections, collections } = useStore(useShallow((state) => ({
        clipFilters: state.clipFilters,
        setFilters: state.setFilters,
        onPlatformChange: state.onPlatformChange,
        onFolderChange: state.onFolderChange,
        onSearchChange: state.onSearchChange,
        createCollection: state.createCollection,
        isCreating: state.collectionState.isfetching,
        getAllCollections: state.getAllCollections,
        collections: state.collections,
    })));

    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState(() => {
        return clipFilters.search || "";
    });
    const [open, setOpen] = useState(false);
    const [newFolderName, setNewFolderName] = useState("");

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
        }, 900);

        return () => clearTimeout(handler);
    }, [search]);

    useEffect(() => {
        onSearchChange(debouncedSearch);
    }, [debouncedSearch, onSearchChange]);

    useEffect(() => {
        getAllCollections();
    }, []);

    return (
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <Select value={clipFilters.platform} onValueChange={onPlatformChange}>
                <SelectTrigger className="w-full md:w-60 !h-12">
                    <SelectValue placeholder="All Platforms" />
                </SelectTrigger>
                <SelectContent className='border-none'>
                    {platforms.map((platform) => (
                        <SelectItem key={platform.value} value={platform.value}>
                            {platform.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>


            <Select value={clipFilters.collectionId} onValueChange={onFolderChange}>
                <SelectTrigger className="w-full md:w-60 !h-12">
                    <SelectValue placeholder="General" />
                </SelectTrigger>
                <SelectContent className='border-none'>
                    <SelectItem value="">General</SelectItem>
                    {collections.map((folder) => (
                        <SelectItem key={folder._id} value={folder._id}>
                            {folder.name.charAt(0).toUpperCase() + folder.name.slice(1)}
                        </SelectItem>
                    ))}

                    <button
                        type="button"
                        className="w-full flex items-center justify-center gap-2 border-t border-t-muted-foreground py-2 mt-2"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setOpen(true);
                        }}
                    >
                        <Plus className="h-4 w-4" />
                        <span className='text-sm text-foreground'>New</span>
                    </button>
                </SelectContent>
            </Select>


            <Input
                placeholder="Search clips..."
                className="w-full md:w-60 h-12"
                value={clipFilters.search || search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <Dialog open={open} onOpenChange={(val) => {
                setOpen(val);
                if (!val) setNewFolderName("");
            }}>
                <DialogContent>
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
                                setOpen(false);
                            }}>
                                Cancel
                            </Button>
                            <Button
                                onClick={async () => {
                                    try {
                                        await createCollection(newFolderName);
                                        setNewFolderName("");
                                        setOpen(false);
                                        showToaster("Folder created successfully", "success");
                                    } catch (err) {
                                        console.error('Failed to create collection', err);
                                    }
                                }}
                                disabled={!newFolderName || isCreating}
                                className='flex items-center gap-2'

                            >
                                {
                                    isCreating ? <LineLoader /> : "Create"
                                }
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}