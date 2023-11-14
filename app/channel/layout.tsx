export default function ChannelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="border-b grid grid-cols-5">
      <div className="border-r">
        <ChannelNav />
      </div>
      <div className="col-span-4">{children}</div>
    </div>
  );
}
