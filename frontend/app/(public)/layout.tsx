import { Header } from "@/components/Header";
import PlumberFinderFooter from "@/components/PlumberFinderFooter";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <PlumberFinderFooter />
    </div>
  );
}
