import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

const fetchTopStories = async () => {
  const response = await fetch(
    "https://hacker-news.firebaseio.com/v0/topstories.json"
  );
  const storyIds = await response.json();
  const stories = await Promise.all(
    storyIds.slice(0, 100).map(async (id) => {
      const storyResponse = await fetch(
        `https://hacker-news.firebaseio.com/v0/item/${id}.json`
      );
      return storyResponse.json();
    })
  );
  return stories;
};

function Index() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data, error, isLoading } = useQuery({
    queryKey: ["topStories"],
    queryFn: fetchTopStories,
  });

  const filteredStories = data?.filter((story) =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <Input
        placeholder="Search stories..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {isLoading ? (
        <Skeleton className="w-full h-10" count={10} />
      ) : error ? (
        <div>Error loading stories</div>
      ) : (
        <ul>
          {filteredStories.map((story) => (
            <li key={story.id} className="mb-4">
              <a href={story.url} target="_blank" rel="noopener noreferrer">
                {story.title}
              </a>
              <div>{story.score} upvotes</div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

export default Index;
