
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "@/components/ui/sonner";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

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
import { Label } from "@/components/ui/label";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  PlusCircle, 
  X, 
  ArrowUp, 
  ArrowDown, 
  Edit, 
  Trash,
  ImagePlus,
  FileVideo 
} from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Form validation schemas
const courseFormSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  price: z.coerce.number().min(0, { message: "Price must be 0 or greater" }).optional(),
  image_url: z.string().url({ message: "Please enter a valid URL" }).optional(),
});

const sectionFormSchema = z.object({
  title: z.string().min(3, { message: "Section title must be at least 3 characters" }),
});

const lessonFormSchema = z.object({
  title: z.string().min(3, { message: "Lesson title must be at least 3 characters" }),
  description: z.string().optional(),
  video_url: z.string().url({ message: "Please enter a valid URL" }),
  duration: z.string().optional(),
  is_preview: z.boolean().default(false),
});

// Types for our course data
type Section = {
  id: string;
  title: string;
  order_number: number;
  lessons: Lesson[];
  isNew?: boolean;
};

type Lesson = {
  id: string;
  title: string;
  description?: string;
  video_url: string;
  duration?: string;
  is_preview: boolean;
  order_number: number;
  isNew?: boolean;
};

const CreateCoursePage = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [sections, setSections] = useState<Section[]>([]);
  const [currentSection, setCurrentSection] = useState<Section | null>(null);
  const [isAddingSectionOpen, setIsAddingSectionOpen] = useState(false);
  const [isAddingLessonOpen, setIsAddingLessonOpen] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);

  // Course form
  const courseForm = useForm<z.infer<typeof courseFormSchema>>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      image_url: "",
    },
  });

  // Section form
  const sectionForm = useForm<z.infer<typeof sectionFormSchema>>({
    resolver: zodResolver(sectionFormSchema),
    defaultValues: {
      title: "",
    },
  });

  // Lesson form
  const lessonForm = useForm<z.infer<typeof lessonFormSchema>>({
    resolver: zodResolver(lessonFormSchema),
    defaultValues: {
      title: "",
      description: "",
      video_url: "",
      duration: "",
      is_preview: false,
    },
  });

  // Add a new section
  const handleAddSection = (data: z.infer<typeof sectionFormSchema>) => {
    const newSection: Section = {
      id: `temp-${Date.now()}`,
      title: data.title,
      order_number: sections.length + 1,
      lessons: [],
      isNew: true,
    };

    if (editingSectionId) {
      // Update existing section
      setSections(
        sections.map((section) =>
          section.id === editingSectionId
            ? { ...section, title: data.title }
            : section
        )
      );
      setEditingSectionId(null);
    } else {
      // Add new section
      setSections([...sections, newSection]);
    }

    sectionForm.reset();
    setIsAddingSectionOpen(false);
  };

  // Edit a section
  const handleEditSection = (section: Section) => {
    setEditingSectionId(section.id);
    sectionForm.setValue("title", section.title);
    setIsAddingSectionOpen(true);
  };

  // Delete a section
  const handleDeleteSection = (sectionId: string) => {
    setSections(sections.filter((section) => section.id !== sectionId));
  };

  // Move section up
  const handleMoveSectionUp = (index: number) => {
    if (index > 0) {
      const newSections = [...sections];
      [newSections[index - 1], newSections[index]] = [
        newSections[index],
        newSections[index - 1],
      ];
      
      // Update order numbers
      newSections.forEach((section, idx) => {
        section.order_number = idx + 1;
      });
      
      setSections(newSections);
    }
  };

  // Move section down
  const handleMoveSectionDown = (index: number) => {
    if (index < sections.length - 1) {
      const newSections = [...sections];
      [newSections[index], newSections[index + 1]] = [
        newSections[index + 1],
        newSections[index],
      ];
      
      // Update order numbers
      newSections.forEach((section, idx) => {
        section.order_number = idx + 1;
      });
      
      setSections(newSections);
    }
  };

  // Add a new lesson
  const handleAddLesson = (data: z.infer<typeof lessonFormSchema>) => {
    if (!currentSection) return;

    const newLesson: Lesson = {
      id: `temp-${Date.now()}`,
      title: data.title,
      description: data.description,
      video_url: data.video_url,
      duration: data.duration,
      is_preview: data.is_preview,
      order_number: currentSection.lessons.length + 1,
      isNew: true,
    };

    if (editingLessonId) {
      // Update existing lesson
      const updatedSections = sections.map((section) => {
        if (section.id === currentSection.id) {
          return {
            ...section,
            lessons: section.lessons.map((lesson) =>
              lesson.id === editingLessonId
                ? { ...lesson, ...data }
                : lesson
            ),
          };
        }
        return section;
      });
      setSections(updatedSections);
      setEditingLessonId(null);
    } else {
      // Add new lesson
      const updatedSections = sections.map((section) => {
        if (section.id === currentSection.id) {
          return {
            ...section,
            lessons: [...section.lessons, newLesson],
          };
        }
        return section;
      });
      setSections(updatedSections);
    }

    lessonForm.reset();
    setIsAddingLessonOpen(false);
  };

  // Edit a lesson
  const handleEditLesson = (sectionId: string, lesson: Lesson) => {
    setCurrentSection(sections.find((s) => s.id === sectionId) || null);
    setEditingLessonId(lesson.id);
    
    lessonForm.setValue("title", lesson.title);
    lessonForm.setValue("description", lesson.description || "");
    lessonForm.setValue("video_url", lesson.video_url);
    lessonForm.setValue("duration", lesson.duration || "");
    lessonForm.setValue("is_preview", lesson.is_preview);
    
    setIsAddingLessonOpen(true);
  };

  // Delete a lesson
  const handleDeleteLesson = (sectionId: string, lessonId: string) => {
    const updatedSections = sections.map((section) => {
      if (section.id === sectionId) {
        return {
          ...section,
          lessons: section.lessons.filter((lesson) => lesson.id !== lessonId),
        };
      }
      return section;
    });
    setSections(updatedSections);
  };

  // Move lesson up
  const handleMoveLessonUp = (sectionId: string, index: number) => {
    if (index > 0) {
      const updatedSections = sections.map((section) => {
        if (section.id === sectionId) {
          const newLessons = [...section.lessons];
          [newLessons[index - 1], newLessons[index]] = [
            newLessons[index],
            newLessons[index - 1],
          ];
          
          // Update order numbers
          newLessons.forEach((lesson, idx) => {
            lesson.order_number = idx + 1;
          });
          
          return {
            ...section,
            lessons: newLessons,
          };
        }
        return section;
      });
      setSections(updatedSections);
    }
  };

  // Move lesson down
  const handleMoveLessonDown = (sectionId: string, index: number) => {
    const section = sections.find(s => s.id === sectionId);
    if (section && index < section.lessons.length - 1) {
      const updatedSections = sections.map((section) => {
        if (section.id === sectionId) {
          const newLessons = [...section.lessons];
          [newLessons[index], newLessons[index + 1]] = [
            newLessons[index + 1],
            newLessons[index],
          ];
          
          // Update order numbers
          newLessons.forEach((lesson, idx) => {
            lesson.order_number = idx + 1;
          });
          
          return {
            ...section,
            lessons: newLessons,
          };
        }
        return section;
      });
      setSections(updatedSections);
    }
  };

  // Submit the course
  const onSubmitCourse = async (data: z.infer<typeof courseFormSchema>) => {
    if (!profile?.is_creator) {
      toast.error("You need to be a creator to publish courses");
      return;
    }

    if (sections.length === 0) {
      toast.error("Please add at least one section with lessons");
      return;
    }

    try {
      setIsLoading(true);

      // 1. Create course
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .insert({
          title: data.title,
          description: data.description,
          price: data.price,
          image_url: data.image_url,
          creator_id: profile.id
        })
        .select()
        .single();

      if (courseError) throw courseError;

      const courseId = courseData.id;

      // 2. Create sections
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

        // 3. Create lessons for this section
        if (section.lessons.length > 0) {
          const lessonsToInsert = section.lessons.map(lesson => ({
            section_id: sectionId,
            title: lesson.title,
            description: lesson.description || null,
            video_url: lesson.video_url,
            duration: lesson.duration || null,
            is_preview: lesson.is_preview,
            order_number: lesson.order_number
          }));

          const { error: lessonsError } = await supabase
            .from('course_lessons')
            .insert(lessonsToInsert);

          if (lessonsError) throw lessonsError;
        }
      }

      toast.success("Course published successfully!");
      navigate(`/app/course/${courseId}`);
    } catch (error) {
      console.error("Error publishing course:", error);
      toast.error("Failed to publish course");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Create Course</h1>
      </div>

      <div className="grid gap-6">
        <Form {...courseForm}>
          <form onSubmit={courseForm.handleSubmit(onSubmitCourse)}>
            <Card>
              <CardHeader>
                <CardTitle>Course Details</CardTitle>
                <CardDescription>
                  Enter the basic information about your course
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={courseForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Complete React Developer Course" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={courseForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="What will students learn in this course?" 
                          {...field} 
                          className="min-h-[120px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={courseForm.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price ($)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0" 
                            step="0.01"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={courseForm.control}
                    name="image_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Course Thumbnail URL</FormLabel>
                        <FormControl>
                          <div className="flex space-x-2">
                            <Input 
                              placeholder="https://example.com/image.jpg" 
                              {...field} 
                            />
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="icon"
                              className="flex-shrink-0"
                            >
                              <ImagePlus className="h-4 w-4" />
                            </Button>
                          </div>
                        </FormControl>
                        <FormDescription>
                          Enter a URL for your course thumbnail image
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="mt-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div>
                    <CardTitle>Course Content</CardTitle>
                    <CardDescription>
                      Organize your course into sections and lessons
                    </CardDescription>
                  </div>
                  <Dialog open={isAddingSectionOpen} onOpenChange={setIsAddingSectionOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={() => {
                        setEditingSectionId(null);
                        sectionForm.reset({ title: "" });
                      }}>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add Section
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <Form {...sectionForm}>
                        <form onSubmit={sectionForm.handleSubmit(handleAddSection)}>
                          <DialogHeader>
                            <DialogTitle>
                              {editingSectionId ? "Edit Section" : "Add New Section"}
                            </DialogTitle>
                            <DialogDescription>
                              Sections help organize your course content
                            </DialogDescription>
                          </DialogHeader>
                          <div className="py-4">
                            <FormField
                              control={sectionForm.control}
                              name="title"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Section Title</FormLabel>
                                  <FormControl>
                                    <Input {...field} placeholder="e.g. Introduction" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <DialogFooter>
                            <Button 
                              type="button" 
                              variant="outline" 
                              onClick={() => setIsAddingSectionOpen(false)}
                            >
                              Cancel
                            </Button>
                            <Button type="submit">
                              {editingSectionId ? "Update Section" : "Add Section"}
                            </Button>
                          </DialogFooter>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  {sections.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">
                        No sections yet. Click "Add Section" to get started.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {sections.map((section, sectionIndex) => (
                        <Card key={section.id} className="border-l-4 border-l-primary">
                          <CardHeader className="py-3">
                            <div className="flex items-start justify-between">
                              <div className="space-y-1">
                                <CardTitle className="text-base">
                                  Section {sectionIndex + 1}: {section.title}
                                </CardTitle>
                                <CardDescription>
                                  {section.lessons.length} lessons
                                </CardDescription>
                              </div>
                              <div className="flex space-x-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleMoveSectionUp(sectionIndex)}
                                  disabled={sectionIndex === 0}
                                >
                                  <ArrowUp className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleMoveSectionDown(sectionIndex)}
                                  disabled={sectionIndex === sections.length - 1}
                                >
                                  <ArrowDown className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEditSection(section)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteSection(section.id)}
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="py-0">
                            {section.lessons.length > 0 ? (
                              <div className="space-y-2">
                                {section.lessons.map((lesson, lessonIndex) => (
                                  <div
                                    key={lesson.id}
                                    className="flex items-center justify-between p-2 rounded-md bg-muted/40"
                                  >
                                    <div className="flex items-center space-x-2">
                                      <FileVideo className="h-4 w-4 text-muted-foreground" />
                                      <div>
                                        <p className="text-sm font-medium">{lesson.title}</p>
                                        {lesson.duration && (
                                          <p className="text-xs text-muted-foreground">
                                            {lesson.duration} min
                                          </p>
                                        )}
                                      </div>
                                      {lesson.is_preview && (
                                        <Badge variant="outline" className="ml-2 text-xs">
                                          Preview
                                        </Badge>
                                      )}
                                    </div>
                                    <div className="flex space-x-1">
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleMoveLessonUp(section.id, lessonIndex)}
                                        disabled={lessonIndex === 0}
                                      >
                                        <ArrowUp className="h-3 w-3" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleMoveLessonDown(section.id, lessonIndex)}
                                        disabled={lessonIndex === section.lessons.length - 1}
                                      >
                                        <ArrowDown className="h-3 w-3" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleEditLesson(section.id, lesson)}
                                      >
                                        <Edit className="h-3 w-3" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDeleteLesson(section.id, lesson.id)}
                                      >
                                        <X className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground py-2">
                                No lessons yet.
                              </p>
                            )}
                          </CardContent>
                          <CardFooter className="py-3">
                            <Dialog open={isAddingLessonOpen} onOpenChange={setIsAddingLessonOpen}>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="w-full"
                                  onClick={() => {
                                    setCurrentSection(section);
                                    setEditingLessonId(null);
                                    lessonForm.reset({
                                      title: "",
                                      description: "",
                                      video_url: "",
                                      duration: "",
                                      is_preview: false,
                                    });
                                  }}
                                >
                                  <PlusCircle className="h-4 w-4 mr-2" />
                                  Add Lesson
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <Form {...lessonForm}>
                                  <form onSubmit={lessonForm.handleSubmit(handleAddLesson)}>
                                    <DialogHeader>
                                      <DialogTitle>
                                        {editingLessonId
                                          ? "Edit Lesson"
                                          : `Add Lesson to ${section.title}`}
                                      </DialogTitle>
                                      <DialogDescription>
                                        Add lesson content to your course
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="py-4 space-y-4">
                                      <FormField
                                        control={lessonForm.control}
                                        name="title"
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormLabel>Lesson Title</FormLabel>
                                            <FormControl>
                                              <Input {...field} placeholder="e.g. Getting Started" />
                                            </FormControl>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />

                                      <FormField
                                        control={lessonForm.control}
                                        name="description"
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormLabel>Description (Optional)</FormLabel>
                                            <FormControl>
                                              <Textarea 
                                                {...field} 
                                                placeholder="Brief description of what this lesson covers" 
                                              />
                                            </FormControl>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />

                                      <FormField
                                        control={lessonForm.control}
                                        name="video_url"
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormLabel>Video URL</FormLabel>
                                            <FormControl>
                                              <Input 
                                                {...field} 
                                                placeholder="https://drive.google.com/file/d/..." 
                                              />
                                            </FormControl>
                                            <FormDescription>
                                              Enter Google Drive video link
                                            </FormDescription>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />

                                      <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                          control={lessonForm.control}
                                          name="duration"
                                          render={({ field }) => (
                                            <FormItem>
                                              <FormLabel>Duration (minutes)</FormLabel>
                                              <FormControl>
                                                <Input 
                                                  {...field} 
                                                  placeholder="e.g. 10" 
                                                />
                                              </FormControl>
                                              <FormMessage />
                                            </FormItem>
                                          )}
                                        />

                                        <FormField
                                          control={lessonForm.control}
                                          name="is_preview"
                                          render={({ field }) => (
                                            <FormItem className="flex flex-row items-center justify-between space-x-3 space-y-0 rounded-md border p-4 mt-8">
                                              <div className="space-y-1 leading-none">
                                                <FormLabel>
                                                  Preview Lesson
                                                </FormLabel>
                                                <FormDescription>
                                                  Make this lesson available as a preview
                                                </FormDescription>
                                              </div>
                                              <FormControl>
                                                <input
                                                  type="checkbox"
                                                  checked={field.value}
                                                  onChange={field.onChange}
                                                  className="h-4 w-4 rounded"
                                                />
                                              </FormControl>
                                            </FormItem>
                                          )}
                                        />
                                      </div>
                                    </div>
                                    <DialogFooter>
                                      <Button 
                                        type="button" 
                                        variant="outline" 
                                        onClick={() => setIsAddingLessonOpen(false)}
                                      >
                                        Cancel
                                      </Button>
                                      <Button type="submit">
                                        {editingLessonId ? "Update Lesson" : "Add Lesson"}
                                      </Button>
                                    </DialogFooter>
                                  </form>
                                </Form>
                              </DialogContent>
                            </Dialog>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="mt-6 flex justify-end space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate("/app/dashboard")}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading || sections.length === 0}
                className="theme-bg"
              >
                {isLoading ? "Publishing..." : "Publish Course"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreateCoursePage;
