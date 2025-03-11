
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarIcon, ClockIcon, BookOpenIcon, PlayIcon } from "lucide-react";

const DashboardPage = () => {
  const currentCourses = [
    {
      id: 1,
      title: "Advanced Social Media Marketing",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=150",
      progress: 35,
      lastAccessed: "Yesterday"
    },
    {
      id: 2,
      title: "UI/UX Design Fundamentals",
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=150",
      progress: 68,
      lastAccessed: "2 days ago"
    }
  ];

  const upcomingSessions = [
    {
      id: 1,
      title: "Product Strategy Review",
      mentor: "Jessica Park",
      date: "Tomorrow, 10:00 AM",
      duration: "45 minutes",
      avatar: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&q=80&w=50&h=50"
    },
    {
      id: 2,
      title: "Frontend Development Q&A",
      mentor: "Michael Rodriguez",
      date: "Oct 25, 2:00 PM",
      duration: "60 minutes",
      avatar: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&q=80&w=50&h=50"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Your Courses</CardTitle>
            <CardDescription>Continue learning where you left off</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentCourses.length > 0 ? (
              currentCourses.map(course => (
                <div key={course.id} className="flex gap-4 items-center">
                  <div 
                    className="w-16 h-12 rounded bg-cover bg-center flex-shrink-0" 
                    style={{ backgroundImage: `url(${course.image})` }}
                  ></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-medium text-sm truncate">{course.title}</h3>
                      <Badge variant="outline" className="ml-2 flex-shrink-0">{course.progress}%</Badge>
                    </div>
                    <Progress value={course.progress} className="h-1.5 mb-1" />
                    <div className="flex items-center text-xs text-muted-foreground">
                      <ClockIcon className="h-3 w-3 mr-1" />
                      <span>Last accessed: {course.lastAccessed}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-muted p-8 rounded-md flex items-center justify-center">
                <p className="text-muted-foreground">No courses yet</p>
              </div>
            )}
            {currentCourses.length > 0 && (
              <Button variant="outline" className="w-full mt-2">View All Courses</Button>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Upcoming Sessions</CardTitle>
            <CardDescription>Your scheduled mentorship sessions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingSessions.length > 0 ? (
              upcomingSessions.map(session => (
                <div key={session.id} className="p-3 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{session.title}</h3>
                    <Button variant="ghost" size="sm" className="h-7 px-2">
                      <PlayIcon className="h-3.5 w-3.5 mr-1" />
                      Join
                    </Button>
                  </div>
                  <div className="flex items-center mb-2">
                    <div 
                      className="w-5 h-5 rounded-full bg-cover bg-center mr-2" 
                      style={{ backgroundImage: `url(${session.avatar})` }}
                    ></div>
                    <span className="text-sm">{session.mentor}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center">
                      <CalendarIcon className="h-3.5 w-3.5 mr-1" />
                      <span>{session.date}</span>
                    </div>
                    <div className="flex items-center">
                      <ClockIcon className="h-3.5 w-3.5 mr-1" />
                      <span>{session.duration}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-muted p-8 rounded-md flex items-center justify-center">
                <p className="text-muted-foreground">No upcoming sessions</p>
              </div>
            )}
            {upcomingSessions.length > 0 && (
              <Button variant="outline" className="w-full mt-2">View All Sessions</Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
