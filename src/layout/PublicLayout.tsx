import React, { useState, ReactNode } from 'react';

const PublicLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="dark:bg-boxdark-2 dark:text-bodydark">
      {/* <!-- ===== Page Wrapper Start ===== --> */}
      <main>
        <div className="mx-auto max-w-screen-2xl">
          {children}
        </div>
      </main>
      {/* <!-- ===== Main Content End ===== --> */}
    </div>
  );
};

export default PublicLayout;
