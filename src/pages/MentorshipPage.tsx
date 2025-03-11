
import React from 'react';

const MentorshipPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Mentorship</h1>
      </div>
      
      <div className="grid gap-6">
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold mb-4">Find Your Mentor</h2>
          <p className="text-muted-foreground mb-6">
            Connect with experienced professionals for personalized guidance and career advice.
          </p>
          <div className="bg-muted p-8 rounded-md flex items-center justify-center">
            <p className="text-muted-foreground">Mentorship content coming soon</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorshipPage;
