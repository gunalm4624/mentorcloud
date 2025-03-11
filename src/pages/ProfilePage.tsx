
import React from 'react';

const ProfilePage = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
      </div>
      
      <div className="grid gap-6">
        <div className="rounded-lg border bg-card p-6">
          <div className="flex flex-col items-center space-y-4 md:flex-row md:space-y-0 md:space-x-6">
            <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
              User
            </div>
            <div>
              <h2 className="text-2xl font-bold">User Name</h2>
              <p className="text-muted-foreground">user@example.com</p>
            </div>
          </div>
          
          <div className="mt-8 bg-muted p-8 rounded-md flex items-center justify-center">
            <p className="text-muted-foreground">Profile content coming soon</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
