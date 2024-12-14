"use client"

import { useState } from "react"
import { Video, VideoComments } from "@/server/db/schema"
import { formatDistanceToNow } from "date-fns"
import { ThumbsUp, MessageSquare, Eye, Clock } from 'lucide-react'
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from "@/components/ui/scroll-area"
import Image from "next/image"
import { formatCount } from "@/lib/utils"
import { motion } from "motion/react"

interface Props {
  video: Video
  comments: (typeof VideoComments.$inferSelect)[]
}

export default function VideoDetail({ video, comments }: Props) {
  const [expandedDescription, setExpandedDescription] = useState(false)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  }

  return (
    <motion.div
      className="space-y-6 max-w-4xl mx-auto px-1"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <Card>
          <CardContent className="flex flex-col md:flex-row items-start justify-between space-y-6 md:space-y-0 md:space-x-6 p-6">
            <div className="space-y-4 w-full md:w-1/2">
              <h1 className="text-2xl md:text-3xl font-bold line-clamp-2 text-primary">
                {video.title}
              </h1>
              <div className="text-sm font-semibold text-muted-foreground">
                {video.channelTitle}
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground font-medium">
                <div className="flex items-center space-x-1">
                  <Eye className="w-4 h-4" />
                  <span>{formatCount(video.viewCount ?? 0)} views</span>
                </div>
                <div className="flex items-center space-x-1">
                  <ThumbsUp className="w-4 h-4" />
                  <span>{formatCount(video.likeCount ?? 0)} likes</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MessageSquare className="w-4 h-4" />
                  <span>{formatCount(video.commentCount ?? 0)} comments</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>
                    {formatDistanceToNow(new Date(video.publishedAt))} ago
                  </span>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/2 rounded-lg overflow-hidden shadow-lg">
              <Image
                src={video.thumbnailUrl ?? ""}
                alt={video.title}
                width={640}
                height={360}
                className="object-cover w-full"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-primary">Description</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className={expandedDescription ? "h-auto" : "h-[200px]"}>
              <p className="text-sm whitespace-pre-wrap text-muted-foreground">
                {video.description}
              </p>
            </ScrollArea>
            {video.description && video.description.length > 200 && (
              <button
                onClick={() => setExpandedDescription(!expandedDescription)}
                className="mt-2 text-sm font-medium text-primary hover:underline"
              >
                {expandedDescription ? "Show less" : "Show more"}
              </button>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-primary">Comments</CardTitle>
          </CardHeader>
          <CardContent>
            {comments.length === 0 ? (
              <p className="text-sm text-muted-foreground">No comments yet.</p>
            ) : (
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-6">
                  {comments
                    .sort(
                      (a, b) =>
                        new Date(b.publishedAt).getTime() -
                        new Date(a.publishedAt).getTime()
                    )
                    .map((comment) => (
                      <motion.div
                        key={comment.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ type: "spring", stiffness: 100 }}
                      >
                        <div className="flex gap-4">
                          <Avatar>
                            <AvatarFallback>
                              {comment.commentText.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="space-y-1.5">
                            <div className="flex items-center space-x-2">
                              <div className="font-medium text-primary">
                                Anonymous
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(comment.publishedAt))}{" "}
                                ago
                              </div>
                            </div>
                            <p className="text-sm text-foreground">{comment.commentText}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <div className="flex items-center space-x-1">
                                <ThumbsUp className="w-3 h-3" />
                                <span>{comment.likeCount}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}

