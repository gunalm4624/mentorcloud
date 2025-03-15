
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner'; 
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  PlusCircle, 
  Trash2, 
  Upload,
  FileVideo,
  GripVertical,
  AlertCircle
} from 'lucide-react';

interface CourseFormValues {
  title: string;
  description: string;
  price: string;
  image_url: string;
}

interface Section {
  id: string;
  title: string;
  order_number: number;
  lessons: Lesson[];
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  video_url: string;
  duration: string;
  is_preview: boolean;
  order_number: number;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

const CreateCoursePage = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sections, setSections] = useState<Section[]>([
    {
      id: generateId(),
      title: 'Introduction',
      order_number: 1,
      lessons: [
        {
          id: generateId(),
          title: 'Welcome to the course',
          description: 'A brief introduction to what you will learn.',
          video_url: '',
          duration: '5',
          is_preview: true,
          order_number: 1
        }
      ]
    }
  ]);

  const form = useForm<CourseFormValues>({
    defaultValues: {
      title: '',
      description: '',
      price: '',
      image_url: ''
    }
  });

  const addSection = () => {
    setSections([
      ...sections,
      {
        id: generateId(),
        title: `Section ${sections.length + 1}`,
        order_number: sections.length + 1,
        lessons: []
      }
    ]);
  };

  const removeSection = (sectionId: string) => {
    setSections(sections.filter(section => section.id !== sectionId));
  };

  const updateSectionTitle = (sectionId: string, title: string) => {
    setSections(sections.map(section => 
      section.id === sectionId 
        ? { ...section, title } 
        : section
    ));
  };

  const addLesson = (sectionId: string) => {
    setSections(sections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          lessons: [
            ...section.lessons,
            {
              id: generateId(),
              title: `Lesson ${section.lessons.length + 1}`,
              description: '',
              video_url: '',
              duration: '',
              is_preview: false,
              order_number: section.lessons.length + 1
            }
          ]
        };
      }
      return section;
    }));
  };

  const removeLesson = (sectionId: string, lessonId: string) => {
    setSections(sections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          lessons: section.lessons.filter(lesson => lesson.id !== lessonId)
        };
      }
      return section;
    }));
  };

  const updateLesson = (sectionId: string, lessonId: string, updates: Partial<Lesson>) => {
    setSections(sections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          lessons: section.lessons.map(lesson => 
            lesson.id === lessonId 
              ? { ...lesson, ...updates } 
              : lesson
          )
        };
      }
      return section;
    }));
  };

  const onSubmit = async (values: CourseFormValues) => {
    if (!profile) {
      toast.error("You must be logged in to create a course");
      return;
    }

    if (!profile.is_creator) {
      toast.error("You must be a creator to publish courses");
      return;
    }

    if (sections.length === 0) {
      toast.error("You must add at least one section");
      return;
    }

    let hasContent = false;
    for (const section of sections) {
      if (section.lessons.length > 0) {
        hasContent = true;
        break;
      }
    }

    if (!hasContent) {
      toast.error("You must add at least one lesson");
      return;
    }

    try {
      setIsSubmitting(true);

      // Create the course
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .insert({
          title: values.title,
          description: values.description,
          price: values.price ? parseFloat(values.price) : null,
          image_url: values.image_url,
          creator_id: profile.id
        })
        .select()
        .single();

      if (courseError) throw courseError;
      if (!courseData) throw new Error("Failed to create course");

      const courseId = courseData.id;

      // Create sections directly using the table instead of RPC
      for (const section of sections) {
        const { data: sectionData, error: sectionError } = await supabase
          .from('course_sections')
          .insert({
            course_id: courseId,
            title: section.title,
            order_number: section.order_number
          })
          .select()
          .single();

        if (sectionError) throw sectionError;
        
        const sectionId = sectionData.id;

        // Create lessons directly using the table instead of RPC
        for (const lesson of section.lessons) {
          const { error: lessonError } = await supabase
            .from('course_lessons')
            .insert({
              section_id: sectionId,
              title: lesson.title,
              description: lesson.description,
              video_url: lesson.video_url,
              duration: lesson.duration,
              is_preview: lesson.is_preview,
              order_number: lesson.order_number
            });

          if (lessonError) throw lessonError;
        }
      }

      toast.success("Course created successfully!");
      navigate(`/app/course/${courseId}`);
    } catch (error: any) {
      console.error("Error creating course:", error);
      toast.error(error.message || "Failed to create course");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Create New Course</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Course Details</CardTitle>
              <CardDescription>
                Provide the basic information about your course.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course Title</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., Complete Web Development Bootcamp" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      A clear and concise title that describes your course.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe what students will learn in this course..." 
                        className="min-h-32" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Provide a detailed description of your course content and learning outcomes.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price (USD)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
                          step="0.01" 
                          placeholder="e.g., 29.99" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Leave empty if your course is free.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="image_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Thumbnail URL</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://example.com/image.jpg" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Provide a URL for the course thumbnail image.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Course Content</CardTitle>
              <CardDescription>
                Organize your course into sections and lessons.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="multiple" defaultValue={["section-0"]} className="w-full">
                {sections.map((section, sectionIndex) => (
                  <AccordionItem 
                    key={section.id} 
                    value={`section-${sectionIndex}`}
                    className="border border-gray-200 dark:border-gray-800 rounded-md mb-4"
                  >
                    <div className="flex items-center justify-between px-4">
                      <AccordionTrigger className="py-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{section.title}</span>
                          <Badge variant="outline">
                            {section.lessons.length} {section.lessons.length === 1 ? 'lesson' : 'lessons'}
                          </Badge>
                        </div>
                      </AccordionTrigger>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeSection(section.id);
                        }}
                        className="text-gray-500 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <AccordionContent className="px-4 pb-4">
                      <div className="space-y-4">
                        <Input
                          placeholder="Section Title"
                          value={section.title}
                          onChange={(e) => updateSectionTitle(section.id, e.target.value)}
                          className="border-gray-300 focus:ring-purple-500"
                        />
                        
                        <div className="space-y-2">
                          <div className="text-sm font-medium">Lessons</div>
                          {section.lessons.length === 0 ? (
                            <div className="text-sm text-muted-foreground py-2">
                              No lessons added yet. Add your first lesson.
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {section.lessons.map((lesson, lessonIndex) => (
                                <Card key={lesson.id}>
                                  <CardContent className="p-3">
                                    <div className="flex items-start gap-2">
                                      <div className="pt-1">
                                        <GripVertical className="h-5 w-5 text-gray-400" />
                                      </div>
                                      <div className="flex-1 space-y-2">
                                        <Input
                                          placeholder="Lesson Title"
                                          value={lesson.title}
                                          onChange={(e) => updateLesson(section.id, lesson.id, { title: e.target.value })}
                                          className="border-gray-300"
                                        />
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                          <Input
                                            placeholder="Video URL (Google Drive)"
                                            value={lesson.video_url}
                                            onChange={(e) => updateLesson(section.id, lesson.id, { video_url: e.target.value })}
                                            className="border-gray-300"
                                          />
                                          <Input
                                            placeholder="Duration (minutes)"
                                            type="number"
                                            value={lesson.duration}
                                            onChange={(e) => updateLesson(section.id, lesson.id, { duration: e.target.value })}
                                            className="border-gray-300"
                                          />
                                        </div>
                                        <Textarea
                                          placeholder="Lesson Description"
                                          value={lesson.description}
                                          onChange={(e) => updateLesson(section.id, lesson.id, { description: e.target.value })}
                                          className="border-gray-300 min-h-20"
                                        />
                                        <div className="flex items-center justify-between">
                                          <div className="flex items-center space-x-2">
                                            <Switch
                                              checked={lesson.is_preview}
                                              onCheckedChange={(checked) => updateLesson(section.id, lesson.id, { is_preview: checked })}
                                              id={`preview-${lesson.id}`}
                                            />
                                            <label htmlFor={`preview-${lesson.id}`} className="text-sm">
                                              Preview Lesson
                                            </label>
                                          </div>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            type="button"
                                            onClick={() => removeLesson(section.id, lesson.id)}
                                            className="text-gray-500 hover:text-red-500"
                                          >
                                            <Trash2 className="h-4 w-4" />
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          )}
                          
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => addLesson(section.id)}
                            className="w-full mt-2"
                          >
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Lesson
                          </Button>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              
              <Button
                type="button"
                variant="outline"
                onClick={addSection}
                className="w-full mt-4"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Section
              </Button>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/app/dashboard')}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isSubmitting ? "Creating..." : "Create Course"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateCoursePage;
