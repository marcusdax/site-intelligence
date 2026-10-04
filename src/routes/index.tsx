import { createFileRoute } from "@tanstack/react-router";
import { CommandShell } from "@/components/command-shell";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <CommandShell />;
}
