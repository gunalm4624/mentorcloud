
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StarIcon } from "lucide-react";

const MentorshipPage = () => {
  const mentors = [
    {
      id: 1,
      name: "Sarah Chen",
      avatar: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=100&h=100",
      title: "Digital Marketing Expert",
      rating: 4.9,
      sessions: 127,
      price: 85,
      expertise: ["Content Strategy", "SEO", "Social Media"],
      availability: "Available next week"
    },
    {
      id: 2,
      name: "Michael Rodriguez",
      avatar: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&q=80&w=100&h=100",
      title: "Frontend Developer & UI Designer",
      rating: 4.7,
      sessions: 89,
      price: 95,
      expertise: ["React", "UI/UX", "Design Systems"],
      availability: "Available tomorrow"
    },
    {
      id: 3,
      name: "Jessica Park",
      avatar: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&q=80&w=100&h=100",
      title: "Product Management Coach",
      rating: 5.0,
      sessions: 203,
      price: 120,
      expertise: ["Roadmapping", "User Research", "Agile"],
      availability: "Limited availability"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Mentorship</h1>
      </div>
      
      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-xl font-semibold mb-4">Find Your Mentor</h2>
        <p className="text-muted-foreground mb-6">
          Connect with experienced professionals for personalized guidance and career advice.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mentors.map(mentor => (
            <Card key={mentor.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={mentor.avatar} alt={mentor.name} />
                    <AvatarFallback>{mentor.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex items-center space-x-1">
                    <StarIcon className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-medium text-sm">{mentor.rating}</span>
                  </div>
                </div>
                <CardTitle className="mt-2">{mentor.name}</CardTitle>
                <CardDescription className="text-sm">{mentor.title}</CardDescription>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="flex flex-wrap gap-1 mb-3">
                  {mentor.expertise.map((skill, i) => (
                    <Badge key={i} variant="outline" className="font-normal">{skill}</Badge>
                  ))}
                </div>
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>{mentor.sessions} sessions completed</span>
                  <span className="font-medium">${mentor.price}/hr</span>
                </div>
              </CardContent>
              <CardFooter className="bg-muted/50 pt-3 pb-3">
                <div className="w-full flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{mentor.availability}</span>
                  <Button size="sm">Book Session</Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MentorshipPage;
