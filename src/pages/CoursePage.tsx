
import { useParams } from "react-router-dom";
import { useState } from "react";
import { 
  BookOpenIcon, 
  CheckIcon, 
  ClockIcon, 
  FileTextIcon, 
  PlayIcon, 
  StarIcon, 
  UserIcon,
  LockIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const CoursePage = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedModuleIndex, setSelectedModuleIndex] = useState(0);
  
  // Mock course data
  const course = {
    id: "1",
    title: "Advanced Social Media Marketing",
    instructor: "Jane Smith",
    instructorAvatar: "/placeholder.svg",
    instructorTitle: "Digital Marketing Specialist",
    instructorBio: "Jane has over 10 years of experience in digital marketing, working with Fortune 500 companies and startups alike.",
    rating: 4.8,
    students: 1243,
    price: 89.99,
    category: "Marketing",
    description: "Master the art of social media marketing with this comprehensive course. Learn advanced strategies for growing your presence, engaging your audience, and converting followers into customers.",
    whatYouWillLearn: [
      "Create effective social media strategies for any platform",
      "Analyze performance metrics to optimize campaigns",
      "Build and engage a loyal community",
      "Run successful paid social media campaigns",
      "Develop a consistent brand voice across platforms",
      "Create viral content that resonates with your audience"
    ],
    modules: [
      {
        title: "Introduction to Advanced Social Media Marketing",
        lessons: [
          { title: "Course Overview", duration: "5:23", isPreview: true },
          { title: "Setting Your Goals", duration: "12:45", isPreview: false },
          { title: "Understanding Platform Algorithms", duration: "18:32", isPreview: false }
        ]
      },
      {
        title: "Content Strategy Masterclass",
        lessons: [
          { title: "Content Types That Perform", duration: "15:11", isPreview: false },
          { title: "Creating a Content Calendar", duration: "20:45", isPreview: false },
          { title: "Repurposing Content Across Platforms", duration: "17:30", isPreview: false },
          { title: "Case Studies: Viral Content Analysis", duration: "22:18", isPreview: false }
        ]
      },
      {
        title: "Growth Hacking Techniques",
        lessons: [
          { title: "Ethical Growth Tactics", duration: "14:22", isPreview: false },
          { title: "Collaboration Strategies", duration: "16:48", isPreview: false },
          { title: "Leveraging Trends and Hashtags", duration: "19:05", isPreview: false }
        ]
      },
      {
        title: "Engagement and Community Building",
        lessons: [
          { title: "Creating Engaging Conversations", duration: "13:40", isPreview: false },
          { title: "Building a Loyal Community", duration: "21:15", isPreview: false },
          { title: "Handling Negative Feedback", duration: "15:33", isPreview: false }
        ]
      },
      {
        title: "Analytics and Optimization",
        lessons: [
          { title: "Key Metrics to Track", duration: "16:27", isPreview: false },
          { title: "Using Analytics to Improve Content", duration: "23:10", isPreview: false },
          { title: "A/B Testing for Social Media", duration: "19:52", isPreview: false }
        ]
      }
    ],
    reviews: [
      {
        user: "Michael P.",
        avatar: "/placeholder.svg",
        rating: 5,
        date: "2 months ago",
        comment: "This course completely transformed my approach to social media. The strategies are practical and I've already seen growth in my engagement."
      },
      {
        user: "Sarah L.",
        avatar: "/placeholder.svg",
        rating: 4,
        date: "3 months ago",
        comment: "Very informative and well-structured. I would have liked more examples for B2B companies, but overall it was excellent."
      },
      {
        user: "David R.",
        avatar: "/placeholder.svg",
        rating: 5,
        date: "1 month ago",
        comment: "Jane is an incredible instructor who clearly knows her stuff. The section on analytics was particularly helpful for my business."
      }
    ],
    totalDuration: "8 hours",
    totalLessons: 16,
    certificate: true,
    lastUpdated: "May 2023",
    isPurchased: true, // Toggle this to simulate different user states
    progress: 35
  };

  // Calculate total duration
  const calculateTotalMinutes = () => {
    let total = 0;
    course.modules.forEach(module => {
      module.lessons.forEach(lesson => {
        const [minutes, seconds] = lesson.duration.split(":");
        total += parseInt(minutes) + parseInt(seconds) / 60;
      });
    });
    return Math.round(total);
  };

  const totalMinutes = calculateTotalMinutes();
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  // Simulated current lesson
  const selectedModule = course.modules[selectedModuleIndex];
  const currentLesson = selectedModule.lessons[0];

  return (
    <div className="space-y-8">
      {/* Course Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 -mx-4 px-4 py-10 md:rounded-2xl text-white">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1 space-y-4">
              <Badge>{course.category}</Badge>
              <h1 className="text-3xl font-bold">{course.title}</h1>
              <p className="text-white/80">{course.description}</p>
              
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2">
                  <StarIcon className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  <span className="font-medium">{course.rating}</span>
                  <span className="text-white/70">({course.students} students)</span>
                </div>
                <div className="flex items-center gap-2">
                  <ClockIcon className="h-5 w-5 text-white/70" />
                  <span>{hours}h {minutes}m total</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpenIcon className="h-5 w-5 text-white/70" />
                  <span>{course.totalLessons} lessons</span>
                </div>
                <div className="flex items-center gap-2">
                  <UserIcon className="h-5 w-5 text-white/70" />
                  <span>By {course.instructor}</span>
                </div>
              </div>
            </div>
            
            {course.isPurchased ? (
              <div className="md:w-72 w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-5 flex flex-col gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Your progress</span>
                    <span className="font-medium">{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                </div>
                <Button size="lg" className="w-full">Continue Learning</Button>
                <p className="text-sm text-center text-white/70">You purchased this course on July 15, 2023</p>
              </div>
            ) : (
              <div className="md:w-72 w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-5 flex flex-col gap-4">
                <div className="text-center">
                  <p className="text-3xl font-bold">${course.price}</p>
                  <p className="text-sm text-white/70">One-time purchase, lifetime access</p>
                </div>
                <Button size="lg" className="w-full">Enroll Now</Button>
                <p className="text-sm text-center text-white/70">30-day money-back guarantee</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Video Player */}
          {course.isPurchased || currentLesson.isPreview ? (
            <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[url('/placeholder.svg')] bg-cover bg-center opacity-50"></div>
              <Button size="lg" className="relative z-10 rounded-full w-16 h-16 p-0">
                <PlayIcon className="h-8 w-8" />
              </Button>
            </div>
          ) : (
            <div className="aspect-video bg-gray-200 rounded-lg flex flex-col items-center justify-center relative overflow-hidden">
              <LockIcon className="h-12 w-12 text-gray-500 mb-2" />
              <p className="font-medium text-gray-800">Premium Content</p>
              <p className="text-sm text-gray-600">Purchase this course to unlock all videos</p>
            </div>
          )}

          {/* Tabs */}
          <Tabs defaultValue="content" className="space-y-6">
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="instructor">Instructor</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-4">
              <h2 className="text-2xl font-semibold">Course Content</h2>
              <div className="text-sm text-gray-600 flex flex-wrap gap-x-6 gap-y-2">
                <div className="flex items-center gap-1">
                  <BookOpenIcon className="h-4 w-4" />
                  <span>{course.modules.length} modules</span>
                </div>
                <div className="flex items-center gap-1">
                  <FileTextIcon className="h-4 w-4" />
                  <span>{course.totalLessons} lessons</span>
                </div>
                <div className="flex items-center gap-1">
                  <ClockIcon className="h-4 w-4" />
                  <span>{hours}h {minutes}m total length</span>
                </div>
              </div>
              
              <Accordion type="multiple" className="border rounded-md divide-y">
                {course.modules.map((module, moduleIndex) => (
                  <AccordionItem key={moduleIndex} value={`module-${moduleIndex}`}>
                    <AccordionTrigger className="px-4 py-3 hover:no-underline">
                      <div className="flex justify-between w-full pr-4">
                        <span className="font-medium text-left">{module.title}</span>
                        <span className="text-sm text-gray-500">{module.lessons.length} lessons</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-0 pb-0">
                      <div className="divide-y border-t">
                        {module.lessons.map((lesson, lessonIndex) => (
                          <div 
                            key={lessonIndex} 
                            className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
                            onClick={() => course.isPurchased || lesson.isPreview ? setSelectedModuleIndex(moduleIndex) : null}
                          >
                            <div className="flex items-center gap-3">
                              {lesson.isPreview || course.isPurchased ? (
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                  <PlayIcon className="h-4 w-4" />
                                </Button>
                              ) : (
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" disabled>
                                  <LockIcon className="h-4 w-4" />
                                </Button>
                              )}
                              <span className={course.isPurchased || lesson.isPreview ? "cursor-pointer" : "text-gray-500"}>
                                {lesson.title}
                              </span>
                              {lesson.isPreview && !course.isPurchased && (
                                <Badge variant="outline">Preview</Badge>
                              )}
                            </div>
                            <span className="text-sm text-gray-500">{lesson.duration}</span>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>

            <TabsContent value="overview" className="space-y-6">
              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">What You'll Learn</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {course.whatYouWillLearn.map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <CheckIcon className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </section>
              
              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Course Description</h2>
                <p className="text-gray-700">{course.description}</p>
                <p className="text-gray-700">
                  This comprehensive course is designed for marketers, entrepreneurs, and content creators who want to 
                  take their social media presence to the next level. Whether you're managing social media for a business
                  or building your personal brand, you'll learn actionable strategies that get real results.
                </p>
                <p className="text-gray-700">
                  By the end of this course, you'll have a robust social media strategy, know how to create engaging content
                  that resonates with your audience, understand the algorithms of major platforms, and be able to analyze
                  your performance to continuously improve your results.
                </p>
              </section>
              
              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Requirements</h2>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Basic understanding of social media platforms</li>
                  <li>A personal or business social media account</li>
                  <li>No advanced technical skills required</li>
                </ul>
              </section>
              
              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">This Course Includes</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <PlayIcon className="h-5 w-5 text-blue-500" />
                    <span>{hours}+ hours on-demand video</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileTextIcon className="h-5 w-5 text-blue-500" />
                    <span>12 downloadable resources</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpenIcon className="h-5 w-5 text-blue-500" />
                    <span>5 practical exercises</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ClockIcon className="h-5 w-5 text-blue-500" />
                    <span>Lifetime access</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckIcon className="h-5 w-5 text-green-500" />
                    <span>Certificate of completion</span>
                  </div>
                </div>
              </section>
            </TabsContent>

            <TabsContent value="instructor" className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={course.instructorAvatar} alt={course.instructor} />
                  <AvatarFallback>{course.instructor.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="space-y-4 text-center md:text-left">
                  <div>
                    <h2 className="text-2xl font-semibold">{course.instructor}</h2>
                    <p className="text-gray-600">{course.instructorTitle}</p>
                  </div>
                  <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                    <div className="flex items-center gap-1">
                      <StarIcon className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                      <span className="font-medium">{course.rating} Instructor Rating</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <UserIcon className="h-5 w-5 text-gray-500" />
                      <span>{course.students} Students</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpenIcon className="h-5 w-5 text-gray-500" />
                      <span>5 Courses</span>
                    </div>
                  </div>
                  <p className="text-gray-700">{course.instructorBio}</p>
                  <Button>View Full Profile</Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="space-y-6">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-64 space-y-4">
                  <div className="text-center">
                    <h2 className="text-5xl font-bold">{course.rating}</h2>
                    <div className="flex justify-center my-2">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon key={i} className={`h-6 w-6 ${i < Math.floor(course.rating) ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`} />
                      ))}
                    </div>
                    <p className="text-gray-600">Course Rating</p>
                  </div>
                  
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map(num => {
                      const percent = num === 5 ? 70 : num === 4 ? 25 : num === 3 ? 5 : 0;
                      return (
                        <div key={num} className="flex items-center gap-2">
                          <div className="flex items-center">
                            <span className="text-sm w-3">{num}</span>
                            <StarIcon className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          </div>
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-yellow-500 rounded-full" 
                              style={{ width: `${percent}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">{percent}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <div className="flex-1 space-y-6">
                  {course.reviews.map((review, index) => (
                    <div key={index} className="space-y-2 pb-6 border-b border-gray-200 last:border-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={review.avatar} alt={review.user} />
                            <AvatarFallback>{review.user.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{review.user}</p>
                            <p className="text-sm text-gray-500">{review.date}</p>
                          </div>
                        </div>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <StarIcon key={i} className={`h-5 w-5 ${i < review.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full">Load More Reviews</Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {!course.isPurchased && (
            <Card className="sticky top-24">
              <CardContent className="p-6 space-y-6">
                <div className="text-center space-y-2">
                  <p className="text-3xl font-bold">${course.price}</p>
                  <p className="text-sm text-gray-500">One-time purchase, lifetime access</p>
                </div>
                
                <Button size="lg" className="w-full">Enroll Now</Button>
                
                <p className="text-center text-sm text-gray-500">30-day money-back guarantee</p>
                
                <div className="border-t pt-4 space-y-3">
                  <h3 className="font-medium">This course includes:</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm">
                      <PlayIcon className="h-4 w-4 text-gray-500" />
                      <span>{hours}h {minutes}m on-demand video</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <FileTextIcon className="h-4 w-4 text-gray-500" />
                      <span>12 downloadable resources</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <BookOpenIcon className="h-4 w-4 text-gray-500" />
                      <span>5 practical exercises</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <ClockIcon className="h-4 w-4 text-gray-500" />
                      <span>Lifetime access</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <CheckIcon className="h-4 w-4 text-green-500" />
                      <span>Certificate of completion</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}
          
          {course.isPurchased && (
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="font-medium">Your Learning Progress</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Course Completion</span>
                    <span className="font-medium">{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Next Lesson:</p>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="font-medium">1.2 Setting Your Goals</p>
                    <p className="text-sm text-gray-600">12:45 mins</p>
                  </div>
                </div>
                <Button size="lg" className="w-full">Continue Learning</Button>
              </CardContent>
            </Card>
          )}
          
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-medium">Share This Course</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </Button>
                <Button variant="outline" size="icon">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </Button>
                <Button variant="outline" size="icon">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </Button>
                <Button variant="outline" className="flex-1">Copy Link</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-medium">Course Information</h3>
              <ul className="space-y-2">
                <li className="flex justify-between text-sm">
                  <span className="text-gray-600">Last updated</span>
                  <span>{course.lastUpdated}</span>
                </li>
                <li className="flex justify-between text-sm">
                  <span className="text-gray-600">Language</span>
                  <span>English</span>
                </li>
                <li className="flex justify-between text-sm">
                  <span className="text-gray-600">Certificate</span>
                  <span>{course.certificate ? "Yes" : "No"}</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CoursePage;
