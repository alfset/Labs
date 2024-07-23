import ServerLayout from "./serverLayout";
import ClientWrapper from "./rootLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ServerLayout>
      <ClientWrapper>{children}</ClientWrapper>
    </ServerLayout>
  );
}
