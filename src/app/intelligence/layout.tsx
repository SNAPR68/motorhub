import DealerAppShell from "@/components/DealerAppShell";
export default function Layout({ children }: { children: React.ReactNode }) {
  return <DealerAppShell>{children}</DealerAppShell>;
}
