import { Cover } from "./cover";
import { Issues } from "./issues";
import { CursorFollower } from "./cursor";
import { Grain } from "./grain";
import { getSubstackPosts } from "./substack";
import { getBooks, getFilms } from "./personal-feeds";

export default async function Home() {
  const [posts, books, films] = await Promise.all([getSubstackPosts(), getBooks(), getFilms()]);
  return (
    <main className="flex min-h-screen flex-col bg-oxblood">
      <Cover posts={posts} />
      <Issues books={books} films={films} />
      <Grain />
      <CursorFollower />
    </main>
  );
}
