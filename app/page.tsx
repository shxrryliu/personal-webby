import { Cover } from "./cover";
import { Issues } from "./issues";
import { CursorFollower } from "./cursor";
import { Grain } from "./grain";

export default function Home() {
  return (
    // Everything is set in lowercase by style, so the source text keeps its normal capitals.
    <main className="flex min-h-screen flex-col bg-oxblood lowercase">
      <Cover />
      <Issues />
      <Grain />
      <CursorFollower />
    </main>
  );
}
