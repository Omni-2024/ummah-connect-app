interface Props {
  title: string;
  description: string;
  time: string;
}

const NotificationItem = ({ title, description, time }: Props) => {
  return (
    <div className="w-full space-y-0.5 rounded-xl border p-3 text-sm lg:space-y-0">
      <div className="line-clamp-1 font-primary font-semibold">{title}</div>
      <div className="line-clamp-1 text-dark-400">{description}</div>
      <div className="line-clamp-1 text-xs text-dark-200">{time}</div>
    </div>
  );
};

export default NotificationItem;
