
import { getVideosForUser } from "@/server/queries";
import VideoList from "../components/VideoList";

export default async function VideosPage() {
  const videos = await getVideosForUser();

  console.log("videos", videos);

  return (
    <main className="p-9">
      <VideoList initialVideos={videos} />
    </main>
  );
}
