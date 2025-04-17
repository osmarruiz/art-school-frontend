import React, { useState, ReactNode } from 'react';

interface DefaultLayoutProps {
  children: ReactNode;
  bgClassName?: string;
}

const PublicLayout: React.FC<DefaultLayoutProps> = ({
  children,
  bgClassName = '',
}) => {
  return (
    <div className={`  ${bgClassName}`}>
      {/* <!-- ===== Page Wrapper Start ===== --> */}
      <main>
        <div className="mx-auto max-w-screen-2xl ">{children}</div>
      </main>
      {/* <!-- ===== Main Content End ===== --> */}
    </div>
  );
};

export default PublicLayout;
