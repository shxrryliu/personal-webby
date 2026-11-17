import { Cover } from "./cover";
import { Issues } from "./issues";
import { CursorFollower } from "./cursor";
import { Grain } from "./grain";
import { getLatestPost } from "./substack";

export default async function Home() {
  const latestPost = await getLatestPost();
  return (
    <main className="flex min-h-screen flex-col bg-oxblood">
      <Cover latestPost={latestPost} />
      <Issues />
      <Grain />
      <CursorFollower />
    </main>
  );
}
