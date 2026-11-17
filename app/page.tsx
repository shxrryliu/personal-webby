import { Cover } from "./cover";
import { Issues } from "./issues";
import { CursorFollower } from "./cursor";
import { Grain } from "./grain";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-oxblood">
      <Cover />
      <Issues />
      <Grain />
      <CursorFollower />
    </main>
  );
}
