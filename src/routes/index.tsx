import { createFileRoute } from "@tanstack/react-router";
import { ScoutWorkspace } from "@/components/scout-workspace";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <ScoutWorkspace />;
}
