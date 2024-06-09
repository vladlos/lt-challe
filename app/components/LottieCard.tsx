import React from "react";
import Card from "./Card";
import { format } from "date-fns";

interface LottieCardProps {
  name: string;
  owner: string;
  createdAt: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}

const LottieCard: React.FC<LottieCardProps> = ({
  name,
  createdAt,
  children,
  action,
  owner = "Anonymous",
}) => {
  return (
    <Card className="w-[350px]">
      <h3 className="text-sm text-gray-500">owner: {owner}</h3>
      <h2 className="text-lg font-bold mb-2">{name}</h2>
      <div className="h-40">{children}</div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">
          Created at: {format(new Date(createdAt), "MM/dd/yyyy")}
        </span>
        {action && <div>{action}</div>}
      </div>
    </Card>
  );
};

export default LottieCard;
