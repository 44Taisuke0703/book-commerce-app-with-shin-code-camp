"use client";

import { signOut } from "next-auth/react";
import { FC } from "react";

const LogoutButton: FC = () => {
  return (
    <>
      <button
        className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
        onClick={() => signOut({ callbackUrl: "/login" })}
      >
        ログアウト
      </button>
    </>
  );
};

export default LogoutButton;
