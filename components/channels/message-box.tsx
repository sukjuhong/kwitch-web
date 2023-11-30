export type Message = {
  username: string;
  msg: string;
  isAdmin: boolean;
};

export default function MessageBox({ message }: { message: Message }) {
  return (
    <div className="rounded-md my-1 px-1">
      <span>{message.isAdmin ? "" : `${message.username}: `}</span>
      <span className={message.isAdmin ? "text-gray-500" : ""}>
        {message.msg}
      </span>
    </div>
  );
}
