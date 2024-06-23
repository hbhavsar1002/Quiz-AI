import React from "react";
import Header from "@/header";

const UserPagesLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      <div className="max-w-3xl mx-auto p-3">{children}</div>
    </>
  );
};

export default UserPagesLayout;
