import { SocketProvider } from "@/app/components/socket-provider";

export default function ChannelLayout({ children }: { children: React.ReactNode }) {
  return (
    <SocketProvider>
        {children}
    </SocketProvider>
  )
}
