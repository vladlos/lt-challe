import React from "react";
import { Link } from "@remix-run/react";

type LottieListProps = {
  lotties: { id: string; name: string; createdAt: string }[];
};

const LottieList: React.FC<LottieListProps> = ({ lotties }) => {
  return (
    <ul className="mb-4">
      {lotties.map((lottie) => (
        <li key={lottie.id} className="border-b py-2">
          <div className="flex justify-between">
            <Link
              to={`/edit/${lottie.id}/chat`}
              className="text-indigo-600 hover:underline"
            >
              {lottie.name}
            </Link>
            <span className="text-sm text-gray-500">
              {new Date(lottie.createdAt).toLocaleDateString()}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default LottieList;
