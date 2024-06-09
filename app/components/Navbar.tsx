import { Link } from "@remix-run/react";

interface NavBarProps {
  user: { email: string } | null;
}

export default function Navbar({ user }: NavBarProps) {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-lg font-bold">
          My App
        </Link>
        <div>
          {user ? (
            <>
              <Link to="/" className="text-white hover:underline mr-4">
                All Lotties
              </Link>
              <Link
                to="/my-lotties"
                className="text-white hover:underline mr-10"
              >
                My Lotties
              </Link>
              <span className="text-white mr-1">Hello, {user.email}</span>
              <form action="/logout" method="post" className="inline">
                <button type="submit" className="text-white hover:underline">
                  (Sign Out)
                </button>
              </form>
            </>
          ) : (
            <>
              <Link to="/login" className="text-white hover:underline mr-4">
                Sign In
              </Link>
              <Link to="/signup" className="text-white hover:underline">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
