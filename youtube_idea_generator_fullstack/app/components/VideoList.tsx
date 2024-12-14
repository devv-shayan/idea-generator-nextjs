"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { Video } from "@/server/db/schema";
import { Button } from "@/components/ui/button";
import { scrapeVideos } from "@/server/youtube-actions";
import { useToast } from "@/hooks/use-toast";
import { formatCount } from "@/lib/utils";
import { Loader2, TvMinimal } from "lucide-react";
import { motion } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";

export default function VideoList({
  initialVideos,
}: {
  initialVideos: Video[];
}) {
  const [isScraping, setIsScraping] = useState(false);
  const [videos, setVideos] = useState(initialVideos);
  const { toast } = useToast();

  const handleScrape = async () => {
    setIsScraping(true);
    try {
      const newVideos = await scrapeVideos();
      setVideos((prevVideos) => [...newVideos, ...prevVideos]);
      toast({
        title: "Scrape Successful",
        description: `Scraped ${newVideos.length} new videos`,
      });
    } catch (error) {
      console.error("Error scraping videos:", error);
      let errorMessage = "An unknown error occurred";

      if (error instanceof Error) {
        if (error.message.includes("No channels found for the user")) {
          errorMessage =
            "Please add YouTube channels first by clicking settings in the top right.";
        } else {
          errorMessage = error.message;
        }
      }

      console.log("errorMessage", errorMessage);
      toast({
        title: "Scrape Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsScraping(false);
    }
  };

  useEffect(() => {
    setVideos(initialVideos);
  }, [initialVideos]);

  if (videos.length === 0) {
    return (
<div className="w-full max-w-md mx-auto">
      <div className="flex flex-col items-center justify-center py-16 px-1 space-y-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-primary/10 rounded-full p-1"
        >
          <TvMinimal className="h-12 w-12 text-primary" strokeWidth={1.5} />
        </motion.div>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="space-y-2 text-center"
        >
          <h3 className="text-2xl font-semibold text-primary">No videos yet</h3>
          <p className="text-muted-foreground max-w-sm">
            Please add YouTube channels and then scrape for videos. Video comments
            will be analyzed for content ideas.
          </p>
        </motion.div>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Button
            onClick={handleScrape}
            disabled={isScraping}
            size="lg"
            className="font-semibold"
          >
            {isScraping ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Scraping...
              </>
            ) : (
              <>Scrape Videos</>
            )}
          </Button>
        </motion.div>
      </div>
    </div>
  )}

  return (
    <>
          <div className="container mx-auto px-1 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center mb-8"
      >
        <h1 className="text-3xl font-bold text-primary">Videos</h1>
        <Button
          onClick={handleScrape}
          disabled={isScraping}
          size="lg"
          className="font-semibold"
        >
          {isScraping ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Scraping...
            </>
          ) : (
            "Scrape Videos"
          )}
        </Button>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {videos.map((video, index) => (
          <motion.div
            key={video.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Link href={`/video/${video.id}`} className="block">
              <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-2 space-y-4">
                  <div className="aspect-video relative rounded-lg overflow-hidden">
                    {video.thumbnailUrl ? (
                      <Image
                        src={video.thumbnailUrl}
                        alt={video.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-secondary flex items-center justify-center">
                        <span className="text-muted-foreground">No thumbnail</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <h2 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors duration-200">
                      {video.title}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {video.channelTitle}
                    </p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <span>
                        {video.viewCount ? formatCount(video.viewCount) : "0"} views
                      </span>
                      <span className="mx-1">•</span>
                      <span>
                        {formatDistanceToNow(new Date(video.publishedAt))} ago
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
    </>
  );
}
