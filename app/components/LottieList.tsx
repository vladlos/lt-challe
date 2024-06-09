import React from 'react';
import { Link } from '@remix-run/react';
import { Lottie } from '@prisma/client';

type LottieListProps = {
  lotties: Lottie[];
  actions?: (id: string) => React.ReactNode;
};

const LottieList: React.FC<LottieListProps> = ({ lotties, actions }) => {
  return (
    <div className="overflow-x-auto pb-4">
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b-2 border-gray-300 text-left leading-tight">
              Name
            </th>
            <th className="py-2 px-4 border-b-2 border-gray-300 text-right leading-tight text-nowrap">
              Created At
            </th>
            {actions && (
              <th className="py-2 px-4 border-b-2 border-gray-300 text-right leading-tight">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {lotties.map((lottie) => (
            <tr key={lottie.id} className="border-b">
              <td className="py-2 px-4 text-indigo-600 hover:underline w-full">
                <Link to={`/edit/${lottie.id}/chat`}>{lottie.name}</Link>
              </td>
              <td className="py-2 px-4 text-gray-500 text-sm whitespace-nowrap text-right">
                {new Date(lottie.createdAt).toLocaleDateString()}
              </td>
              {actions && (
                <td className="py-2 px-4 text-gray-500 text-sm whitespace-nowrap text-right">
                  {actions(lottie.id)}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LottieList;
