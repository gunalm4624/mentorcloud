
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  PlayCircle, 
  CheckCircle, 
  Clock, 
  BookOpen, 
  User,
  FileText,
  LockKeyhole 
} from "lucide-react";
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface CourseSection {
  id: string;
  title: string;
  order_number: number;
  lessons: CourseLesson[];
}

interface CourseLesson {
  id: string;
  title: string;
  description?: string;
  video_url: string;
  duration?: string;
  is_preview: boolean;
  order_number: number;
}

interface Course {
  id: string;
  title: string;
  description: string;
  price?: number;
  image_url?: string;
  creator_id: string;
  creator?: {
    full_name: string;
    avatar_url?: string;
  };
  sections: CourseSection[];
}

const CoursePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [activeLesson, setActiveLesson] = useState<CourseLesson | null>(null);
  
  const { data: course, isLoading, error } = useQuery({
    queryKey: ['course', id],
    queryFn: async () => {
      if (!id) throw new Error('Course ID is required');

      // 1. Get course data
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select(`
          id, title, description, price, image_url, creator_id,
          profiles:creator_id (full_name, avatar_url)
        `)
        .eq('id', id)
        .single();

      if (courseError) throw courseError;
      if (!courseData) throw new Error('Course not found');

      // Create a custom PostgrestFilterBuilder to access non-existing tables
      // This is a temporary solution until the database is updated
      const fetchSectionsAndLessons = async () => {
        // Mock sections data for now
        const mockSections = [
          {
            id: "section1",
            title: "Introduction",
            order_number: 1,
            course_id: id,
            lessons: [
              {
                id: "lesson1",
                title: "Welcome to the Course",
                description: "An introduction to what you'll learn",
                video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
                duration: "10",
                is_preview: true,
                order_number: 1,
                section_id: "section1"
              },
              {
                id: "lesson2",
                title: "Getting Started",
                description: "Setup your environment",
                video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
                duration: "15",
                is_preview: false,
                order_number: 2,
                section_id: "section1"
              }
            ]
          },
          {
            id: "section2",
            title: "Core Concepts",
            order_number: 2,
            course_id: id,
            lessons: [
              {
                id: "lesson3",
                title: "Fundamental Principles",
                description: "Understanding the basics",
                video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
                duration: "20",
                is_preview: false,
                order_number: 1,
                section_id: "section2"
              }
            ]
          }
        ];

        return mockSections;
      };

      // Get course sections and lessons
      const sectionsWithLessons = await fetchSectionsAndLessons();

      return {
        ...courseData,
        creator: courseData.profiles,
        sections: sectionsWithLessons
      } as Course;
    },
    enabled: !!id
  });

  useEffect(() => {
    if (course) {
      // Find the first preview lesson or just the first lesson
      for (const section of course.sections) {
        const previewLesson = section.lessons.find(lesson => lesson.is_preview);
        if (previewLesson) {
          setActiveLesson(previewLesson);
          break;
        }
      }

      if (!activeLesson && course.sections.length > 0 && course.sections[0].lessons.length > 0) {
        setActiveLesson(course.sections[0].lessons[0]);
      }
    }
  }, [course]);

  const getVideoEmbedUrl = (url: string) => {
    if (!url) return '';
    
    // Handle YouTube URLs
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoIdMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
      if (videoIdMatch && videoIdMatch[1]) {
        return `https://www.youtube.com/embed/${videoIdMatch[1]}`;
      }
    }
    
    // Handle Google Drive URLs
    if (url.includes('drive.google.com')) {
      const fileIdMatch = url.match(/[-\w]{25,}/);
      if (fileIdMatch && fileIdMatch[0]) {
        return `https://drive.google.com/file/d/${fileIdMatch[0]}/preview`;
      }
    }
    
    return url;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Course Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The course you're looking for doesn't exist or you don't have access to it.
        </p>
        <Button onClick={() => navigate('/app/explore')}>
          Browse Courses
        </Button>
      </div>
    );
  }

  const totalLessons = course.sections.reduce(
    (acc, section) => acc + section.lessons.length, 0
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <Card className="mb-6">
            <CardContent className="p-0 aspect-video">
              {activeLesson ? (
                <iframe
                  src={getVideoEmbedUrl(activeLesson.video_url)}
                  className="w-full h-full"
                  allowFullScreen
                ></iframe>
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-800">
                  <p className="text-muted-foreground">Select a lesson to start learning</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Tabs defaultValue="overview">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="lessons">Lessons</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <h1 className="text-2xl font-bold">{course.title}</h1>
              <div className="flex items-center text-sm text-muted-foreground space-x-4">
                <div className="flex items-center">
                  <BookOpen className="mr-1 h-4 w-4" />
                  <span>{totalLessons} lessons</span>
                </div>
                <div className="flex items-center">
                  <User className="mr-1 h-4 w-4" />
                  <span>By {course.creator?.full_name || "Unknown Instructor"}</span>
                </div>
              </div>

              <Separator />
              
              <div>
                <h3 className="font-semibold mb-2">About This Course</h3>
                <p className="text-muted-foreground whitespace-pre-line">
                  {course.description}
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="lessons">
              <div className="space-y-4">
                {course.sections.map((section) => (
                  <Card key={section.id}>
                    <CardHeader className="py-3">
                      <CardTitle className="text-md">
                        {section.title}
                      </CardTitle>
                      <CardDescription>
                        {section.lessons.length} lessons
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="py-0">
                      <div className="space-y-2">
                        {section.lessons.map((lesson) => (
                          <button
                            key={lesson.id}
                            onClick={() => setActiveLesson(lesson)}
                            className={`flex items-center justify-between w-full p-2 rounded-md text-left 
                            ${
                              activeLesson?.id === lesson.id
                                ? "bg-primary/10 border-l-4 border-primary"
                                : "hover:bg-muted"
                            }`}
                          >
                            <div className="flex items-center space-x-2">
                              {activeLesson?.id === lesson.id ? (
                                <PlayCircle className="h-4 w-4 text-primary" />
                              ) : (
                                <>{lesson.is_preview ? 
                                  <PlayCircle className="h-4 w-4" /> : 
                                  <LockKeyhole className="h-4 w-4" />
                                }</>
                              )}
                              <div>
                                <p className="text-sm font-medium">{lesson.title}</p>
                                {lesson.duration && (
                                  <p className="text-xs text-muted-foreground">
                                    {lesson.duration} min
                                  </p>
                                )}
                              </div>
                            </div>
                            {lesson.is_preview && (
                              <Badge variant="outline" className="ml-2">
                                Preview
                              </Badge>
                            )}
                          </button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="w-full md:w-80 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Course Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {course.image_url && (
                <img 
                  src={course.image_url} 
                  alt={course.title} 
                  className="w-full h-40 object-cover rounded-md mb-4"
                />
              )}
              
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col items-center justify-center p-3 bg-muted rounded-md">
                  <BookOpen className="h-5 w-5 mb-1 text-primary" />
                  <span className="text-sm font-medium">{totalLessons} Lessons</span>
                </div>
                
                <div className="flex flex-col items-center justify-center p-3 bg-muted rounded-md">
                  <Clock className="h-5 w-5 mb-1 text-primary" />
                  <span className="text-sm font-medium">
                    {course.sections.reduce(
                      (total, section) => total + section.lessons.reduce(
                        (secTotal, lesson) => secTotal + (parseInt(lesson.duration || "0", 10) || 0), 0
                      ), 0
                    )} mins
                  </span>
                </div>
              </div>
              
              <div className="pt-2">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Price:</span>
                  <span className="font-bold text-xl">
                    {course.price ? `$${course.price.toFixed(2)}` : "Free"}
                  </span>
                </div>
                
                <Button 
                  className="w-full theme-bg" 
                  size="lg"
                  onClick={() => {
                    toast.success("Enrollment feature coming soon!");
                  }}
                >
                  Enroll Now
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {course.creator && (
            <Card>
              <CardHeader>
                <CardTitle className="text-md">About the Instructor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3 mb-2">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    {course.creator.avatar_url ? (
                      <img 
                        src={course.creator.avatar_url} 
                        alt={course.creator.full_name} 
                        className="h-10 w-10 rounded-full"
                      />
                    ) : (
                      <User className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{course.creator.full_name}</p>
                    <p className="text-xs text-muted-foreground">Course Creator</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoursePage;
