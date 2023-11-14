import ChannelNav from "@/components/channel-nav";

export default function ChannelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 flex xl:grid xl:grid-cols-5">
      <ChannelNav />
      <div className="col-span-4">{children}</div>
    </div>
  );
}
