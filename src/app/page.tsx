import { ComingSoon } from "@/components/ComingSoon";
import { RevealShell } from "@/components/reveal/RevealShell";

export default function Home() {
  return (
    <main>
      <RevealShell>
        <ComingSoon />
      </RevealShell>
    </main>
  );
}
