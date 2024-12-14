"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X, Settings } from "lucide-react";
import { YouTubeChannelType } from "@/server/db/schema";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getChannelsForUser } from "@/server/queries";
import { addChannelForUser, removeChannelForUser } from "@/server/mutations";
import { motion, AnimatePresence } from "motion/react";

export function SettingsModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [channels, setChannels] = useState<YouTubeChannelType[]>([]);
  const [newChannel, setNewChannel] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchChannels();
    }
  }, [isOpen]);

  const fetchChannels = async () => {
    setIsLoading(true);
    try {
      const fetchedChannels = await getChannelsForUser();
      setChannels(fetchedChannels);
    } catch (error) {
      console.error("Failed to fetch channels:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addChannel = async () => {
    if (newChannel) {
      setIsLoading(true);
      try {
        const addedChannel = await addChannelForUser(newChannel);
        setChannels([...channels, addedChannel]);
        setNewChannel("");
      } catch (error) {
        console.error("Failed to add channel:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const removeChannel = async (id: string) => {
    setIsLoading(true);
    try {
      await removeChannelForUser(id);
      setChannels(channels.filter((c) => c.id !== id));
    } catch (error) {
      console.error("Failed to remove channel:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-primary hover:text-primary/80 transition-colors"
        >
          <Settings className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary">
            Channel Settings
          </DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-primary text-lg">
              Add New Channel
            </h3>
            <div className="flex space-x-2">
              <Input
                placeholder="Enter channel name"
                value={newChannel}
                onChange={(e) => setNewChannel(e.target.value)}
                className="flex-1"
              />
              <Button
                onClick={addChannel}
                disabled={isLoading || !newChannel}
                className="bg-primary hover:bg-primary/90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold text-primary text-lg">
              Saved Channels
            </h3>
            {isLoading ? (
              <div className="h-[200px] flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Settings className="h-8 w-8 text-primary" />
                </motion.div>
              </div>
            ) : (
              <ScrollArea className="h-[200px] pr-4">
                <AnimatePresence>
                  {channels.map((channel) => (
                    <motion.div
                      key={channel.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center justify-between bg-secondary rounded-lg px-4 py-2 mb-2"
                    >
                      <span className="font-medium">{channel.name}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeChannel(channel.id)}
                        disabled={isLoading}
                        className="hover:bg-destructive/10 hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </ScrollArea>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
