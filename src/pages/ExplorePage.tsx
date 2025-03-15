
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  BookOpen, 
  Clock, 
  Star,
  Filter,
  User
} from "lucide-react";

interface Course {
  id: string;
  title: string;
  description: string;
  price?: number;
  image_url?: string;
  creator?: {
    full_name: string;
    avatar_url?: string;
  };
  lesson_count: number;
}

const ExplorePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Fetch courses from Supabase
  const { data: courses, isLoading, error } = useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select(`
          id, title, description, price, image_url, creator_id,
          profiles:creator_id (full_name, avatar_url)
        `);

      if (error) throw error;

      // For each course, count lessons
      const coursesWithLessonCount = await Promise.all(
        data.map(async (course) => {
          // First get sections for this course
          const { data: sections } = await supabase
            .from('course_sections')
            .select('id')
            .eq('course_id', course.id);
          
          if (!sections || sections.length === 0) {
            return { ...course, creator: course.profiles, lesson_count: 0 };
          }

          // Get lesson count for these sections
          const sectionIds = sections.map(s => s.id);
          const { count } = await supabase
            .from('course_lessons')
            .select('id', { count: 'exact', head: true })
            .in('section_id', sectionIds);

          return { 
            ...course, 
            creator: course.profiles,
            lesson_count: count || 0 
          };
        })
      );

      return coursesWithLessonCount as Course[];
    }
  });

  // Filter courses based on search query
  const filteredCourses = courses?.filter(course => 
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (course.description && course.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Explore Courses</h1>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search courses..." 
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="overflow-hidden">
              <div className="h-40 bg-gray-200 dark:bg-gray-800 animate-pulse"></div>
              <CardContent className="p-4">
                <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse w-3/4"></div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded animate-pulse w-1/4"></div>
                  <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded animate-pulse w-1/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">Error loading courses</h2>
          <p className="text-muted-foreground mb-4">Please try again later.</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      ) : filteredCourses && filteredCourses.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/60" />
          <h2 className="text-xl font-semibold mt-6">No courses found</h2>
          <p className="text-muted-foreground my-2">
            {searchQuery
              ? `No results found for "${searchQuery}"`
              : "There are no courses available at the moment."}
          </p>
          {searchQuery && (
            <Button 
              variant="outline" 
              onClick={() => setSearchQuery('')} 
              className="mt-2"
            >
              Clear search
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-6">
          {filteredCourses?.map((course) => (
            <Card key={course.id} className="overflow-hidden flex flex-col">
              <div className="aspect-video w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                {course.image_url ? (
                  <img 
                    src={course.image_url} 
                    alt={course.title} 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <BookOpen className="h-10 w-10 text-muted-foreground/40" />
                  </div>
                )}
              </div>
              <CardContent className="p-4 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold line-clamp-2">{course.title}</h3>
                  {course.price !== undefined && course.price !== null ? (
                    <Badge className="text-xs">${course.price.toFixed(2)}</Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs">Free</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                  {course.description}
                </p>
                <div className="flex items-center gap-1 mt-3">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                    {course.creator?.avatar_url ? (
                      <img 
                        src={course.creator.avatar_url} 
                        alt={course.creator.full_name} 
                        className="h-6 w-6 rounded-full"
                      />
                    ) : (
                      <User className="h-3 w-3" />
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {course.creator?.full_name || "Unknown Instructor"}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <BookOpen className="h-3 w-3 mr-1" /> 
                    {course.lesson_count} {course.lesson_count === 1 ? "lesson" : "lessons"}
                  </div>
                  <div className="flex items-center text-xs">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          className="h-3 w-3 fill-yellow-400 text-yellow-400" 
                        />
                      ))}
                    </div>
                    <span className="ml-1">(New)</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 mt-auto">
                <Button className="w-full theme-bg" asChild>
                  <Link to={`/app/course/${course.id}`}>
                    View Course
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExplorePage;
