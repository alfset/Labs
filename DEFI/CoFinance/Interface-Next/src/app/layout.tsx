import ServerLayout from './serverlayout';
import ClientWrapper from './rootlayout';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ServerLayout>
      <ClientWrapper>
        {children}
      </ClientWrapper>
    </ServerLayout>
  );
}
