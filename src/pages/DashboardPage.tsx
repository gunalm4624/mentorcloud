
import React from 'react';

const DashboardPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold mb-4">Your Courses</h2>
          <div className="bg-muted p-8 rounded-md flex items-center justify-center">
            <p className="text-muted-foreground">No courses yet</p>
          </div>
        </div>
        
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold mb-4">Upcoming Sessions</h2>
          <div className="bg-muted p-8 rounded-md flex items-center justify-center">
            <p className="text-muted-foreground">No upcoming sessions</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
