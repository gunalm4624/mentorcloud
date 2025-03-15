import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarIcon, ClockIcon, BookOpenIcon, PlayIcon, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const DashboardPage = () => {
  const currentCourses = [
    {
      id: "1",
      title: "Complete JavaScript Course",
      progress: 45,
      lastActivity: "2 days ago",
      image: "https://images.unsplash.com/photo-1579403124614-197f69d8187b?q=80&w=400&auto=format&fit=crop"
    },
    {
      id: "2",
      title: "Machine Learning Fundamentals",
      progress: 12,
      lastActivity: "1 week ago",
      image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=400&auto=format&fit=crop"
    }
  ];

  const upcomingSessions = [
    {
      id: "1",
      title: "Career Strategy Session",
      mentor: "Alex Johnson",
      date: "Tomorrow, 10:00 AM",
      duration: "45 min"
    },
    {
      id: "2",
      title: "Technical Interview Prep",
      mentor: "Sarah Williams",
      date: "Friday, 3:30 PM",
      duration: "60 min"
    }
  ];

  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        {profile?.is_creator && (
          <Button className="theme-bg" asChild>
            <Link to="/app/create-course">Create New Course</Link>
          </Button>
        )}
      </div>
      
      <Tabs defaultValue="overview" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 md:w-[400px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="courses">My Courses</TabsTrigger>
          {profile?.is_creator && (
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6 pt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">My Courses</CardTitle>
                <CardDescription>Continue where you left off</CardDescription>
              </CardHeader>
              <CardContent>
                {currentCourses.length === 0 ? (
                  <div className="text-center py-6">
                    <BookOpenIcon className="mx-auto h-10 w-10 text-muted-foreground/60" />
                    <h3 className="mt-4 text-lg font-medium">No courses yet</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      You haven't enrolled in any courses. Browse our catalog to get started.
                    </p>
                    <Button className="mt-4 theme-bg" asChild>
                      <Link to="/app/explore">Explore Courses</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {currentCourses.map((course) => (
                      <div key={course.id} className="flex items-start gap-3">
                        <div className="h-14 w-14 rounded-md overflow-hidden flex-shrink-0">
                          <img src={course.image} alt={course.title} className="h-full w-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm mb-1">{course.title}</h4>
                          <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full mb-1">
                            <div 
                              className="h-full bg-purple-500 rounded-full" 
                              style={{width: `${course.progress}%`}}
                            ></div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-muted-foreground">{course.progress}% complete</span>
                            <span className="text-xs text-muted-foreground">{course.lastActivity}</span>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="mt-2 w-full justify-start p-0 h-auto text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 hover:bg-transparent"
                            asChild
                          >
                            <Link to={`/app/course/${course.id}`}>
                              <PlayIcon className="h-3 w-3 mr-1" /> Continue Learning
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              {currentCourses.length > 0 && (
                <CardFooter className="pt-0">
                  <Button variant="outline" className="w-full mt-2" asChild>
                    <Link to="/app/explore">View All Courses</Link>
                  </Button>
                </CardFooter>
              )}
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Upcoming Sessions</CardTitle>
                <CardDescription>Your scheduled mentorship sessions</CardDescription>
              </CardHeader>
              <CardContent>
                {upcomingSessions.length === 0 ? (
                  <div className="text-center py-6">
                    <CalendarIcon className="mx-auto h-10 w-10 text-muted-foreground/60" />
                    <h3 className="mt-4 text-lg font-medium">No upcoming sessions</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      You don't have any mentorship sessions scheduled. Book a session with a mentor.
                    </p>
                    <Button className="mt-4 theme-bg" asChild>
                      <Link to="/app/mentorship">Find Mentors</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {upcomingSessions.map((session) => (
                      <div key={session.id} className="p-3 rounded-lg border">
                        <h4 className="font-medium mb-1">{session.title}</h4>
                        <p className="text-sm text-muted-foreground">with {session.mentor}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center text-xs text-muted-foreground">
                            <CalendarIcon className="h-3 w-3 mr-1" /> {session.date}
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <ClockIcon className="h-3 w-3 mr-1" /> {session.duration}
                          </div>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <Badge className="theme-bg">Upcoming</Badge>
                          <Button variant="ghost" size="sm">Join</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              {upcomingSessions.length > 0 && (
                <CardFooter className="pt-0">
                  <Button variant="outline" className="w-full mt-2" asChild>
                    <Link to="/app/mentorship">View All Sessions</Link>
                  </Button>
                </CardFooter>
              )}
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="courses" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle>My Courses</CardTitle>
              <CardDescription>
                All your enrolled courses
              </CardDescription>
            </CardHeader>
            <CardContent>
              {currentCourses.length === 0 ? (
                <div className="text-center py-6">
                  <BookOpenIcon className="mx-auto h-10 w-10 text-muted-foreground/60" />
                  <h3 className="mt-4 text-lg font-medium">No courses yet</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    You haven't enrolled in any courses. Browse our catalog to get started.
                  </p>
                  <Button className="mt-4 theme-bg" asChild>
                    <Link to="/app/explore">Explore Courses</Link>
                  </Button>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {currentCourses.map((course) => (
                    <Card key={course.id} className="overflow-hidden">
                      <div className="aspect-video w-full overflow-hidden">
                        <img src={course.image} alt={course.title} className="h-full w-full object-cover" />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold truncate">{course.title}</h3>
                        <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full mt-2 mb-1">
                          <div 
                            className="h-full bg-purple-500 rounded-full" 
                            style={{width: `${course.progress}%`}}
                          ></div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">{course.progress}% complete</span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="p-0 h-auto text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 hover:bg-transparent"
                            asChild
                          >
                            <Link to={`/app/course/${course.id}`}>
                              <PlayIcon className="h-3 w-3 mr-1" /> Continue
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {profile?.is_creator && (
          <TabsContent value="earnings" className="pt-6">
            <Card>
              <CardHeader>
                <CardTitle>Earnings</CardTitle>
                <CardDescription>
                  Track your course earnings and payments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6">
                  <CreditCard className="mx-auto h-10 w-10 text-muted-foreground/60" />
                  <h3 className="mt-4 text-lg font-medium">No earnings yet</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    You don't have any earnings yet. Create and publish courses to start earning.
                  </p>
                  <Button className="mt-4 theme-bg" asChild>
                    <Link to="/app/create-course">Create a Course</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default DashboardPage;
