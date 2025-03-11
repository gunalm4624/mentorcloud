
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  BookOpenIcon, 
  SearchIcon, 
  StarIcon, 
  UsersIcon, 
  FilterIcon,
  PlayIcon
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const ExplorePage = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("popular");

  // Mock categories
  const categories = [
    { id: "all", name: "All Categories" },
    { id: "marketing", name: "Marketing" },
    { id: "design", name: "Design" },
    { id: "business", name: "Business" },
    { id: "technology", name: "Technology" },
    { id: "content", name: "Content Creation" },
  ];

  // Mock courses
  const courses = [
    {
      id: "1",
      title: "Advanced Social Media Marketing",
      instructor: "Jane Smith",
      instructorAvatar: "/placeholder.svg",
      rating: 4.8,
      students: 1243,
      price: 89.99,
      category: "marketing",
      badge: "Bestseller",
      description: "Learn advanced strategies for growing your social media presence and engagement.",
      modules: 12,
      duration: "10 hours"
    },
    {
      id: "2",
      title: "Building a Personal Brand on Instagram",
      instructor: "David Johnson",
      instructorAvatar: "/placeholder.svg",
      rating: 4.9,
      students: 987,
      price: 69.99,
      category: "marketing",
      badge: "Featured",
      description: "Create an authentic personal brand that attracts followers and business opportunities.",
      modules: 8,
      duration: "6 hours"
    },
    {
      id: "3",
      title: "Content Creation Masterclass",
      instructor: "Sofia Lee",
      instructorAvatar: "/placeholder.svg",
      rating: 4.7,
      students: 1567,
      price: 99.99,
      category: "content",
      badge: "New",
      description: "Master content creation for multiple platforms with this comprehensive guide.",
      modules: 15,
      duration: "12 hours"
    },
    {
      id: "4",
      title: "Graphic Design Fundamentals",
      instructor: "Michael Chen",
      instructorAvatar: "/placeholder.svg",
      rating: 4.6,
      students: 824,
      price: 59.99,
      category: "design",
      description: "Learn the core principles of graphic design and create stunning visuals.",
      modules: 10,
      duration: "8 hours"
    },
    {
      id: "5",
      title: "Digital Business Strategy",
      instructor: "Amanda Lopez",
      instructorAvatar: "/placeholder.svg",
      rating: 4.9,
      students: 1156,
      price: 129.99,
      category: "business",
      badge: "Advanced",
      description: "Develop comprehensive digital strategies to grow your business online.",
      modules: 14,
      duration: "16 hours"
    },
    {
      id: "6",
      title: "Web Development Bootcamp",
      instructor: "Tom Davies",
      instructorAvatar: "/placeholder.svg",
      rating: 4.8,
      students: 2354,
      price: 149.99,
      category: "technology",
      badge: "Comprehensive",
      description: "From HTML basics to full-stack applications - your complete coding journey.",
      modules: 20,
      duration: "30 hours"
    }
  ];

  // Mock mentors
  const mentors = [
    {
      id: "1",
      name: "John Doe",
      avatar: "/placeholder.svg",
      expertise: "Growth Hacking",
      hourlyRate: 120,
      rating: 4.9,
      category: "marketing",
      sessions: 152,
      description: "Specialized in rapid growth strategies for startups and new products."
    },
    {
      id: "2",
      name: "Alice Wang",
      avatar: "/placeholder.svg",
      expertise: "SEO Specialist",
      hourlyRate: 95,
      rating: 4.8,
      category: "marketing",
      sessions: 98,
      description: "Expert in search engine optimization and content marketing strategy."
    },
    {
      id: "3",
      name: "Michael Brown",
      avatar: "/placeholder.svg",
      expertise: "YouTube Growth",
      hourlyRate: 150,
      rating: 5.0,
      category: "content",
      sessions: 210,
      description: "Helping content creators build successful YouTube channels from scratch."
    },
    {
      id: "4",
      name: "Elena Rodriguez",
      avatar: "/placeholder.svg",
      expertise: "UI/UX Design",
      hourlyRate: 110,
      rating: 4.7,
      category: "design",
      sessions: 124,
      description: "Creating beautiful, functional user interfaces and experiences."
    }
  ];

  // Filter courses by category
  const filteredCourses = activeCategory === "all" 
    ? courses 
    : courses.filter(course => course.category === activeCategory);
  
  // Filter mentors by category
  const filteredMentors = activeCategory === "all"
    ? mentors
    : mentors.filter(mentor => mentor.category === activeCategory);

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 -mx-4 px-4 md:px-8 py-12 md:rounded-2xl text-white">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <h1 className="text-3xl font-bold">Discover Knowledge & Expertise</h1>
          <p className="text-white/80">
            Find the perfect courses and mentors to help you achieve your goals
          </p>
          <div className="relative max-w-xl mx-auto mt-6">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="search"
              placeholder="Search for courses, mentors, or topics..."
              className="pl-10 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters - Desktop */}
        <div className="hidden md:block md:w-64 space-y-6">
          <div className="bg-white p-5 rounded-lg border border-gray-200 space-y-4">
            <h3 className="font-medium text-lg">Categories</h3>
            <div className="space-y-2">
              {categories.map(category => (
                <Button
                  key={category.id}
                  variant={activeCategory === category.id ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveCategory(category.id)}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>

          <div className="bg-white p-5 rounded-lg border border-gray-200 space-y-4">
            <h3 className="font-medium text-lg">Price Range</h3>
            <div className="space-y-2">
              <Button variant="ghost" className="w-full justify-start">All Prices</Button>
              <Button variant="ghost" className="w-full justify-start">Free</Button>
              <Button variant="ghost" className="w-full justify-start">Under $50</Button>
              <Button variant="ghost" className="w-full justify-start">$50 - $100</Button>
              <Button variant="ghost" className="w-full justify-start">$100+</Button>
            </div>
          </div>

          <div className="bg-white p-5 rounded-lg border border-gray-200 space-y-4">
            <h3 className="font-medium text-lg">Ratings</h3>
            <div className="space-y-2">
              <Button variant="ghost" className="w-full justify-start">
                <div className="flex items-center">
                  <StarIcon className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-2" />
                  <span>4.5 & Up</span>
                </div>
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <div className="flex items-center">
                  <StarIcon className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-2" />
                  <span>4.0 & Up</span>
                </div>
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <div className="flex items-center">
                  <StarIcon className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-2" />
                  <span>3.5 & Up</span>
                </div>
              </Button>
            </div>
          </div>
        </div>

        {/* Filters - Mobile */}
        <div className="md:hidden space-y-4">
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1 gap-2">
              <FilterIcon className="h-4 w-4" />
              <span>Filters</span>
            </Button>
            <Select defaultValue={activeCategory} onValueChange={setActiveCategory}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Accordion type="single" collapsible className="bg-white rounded-lg border border-gray-200">
            <AccordionItem value="categories">
              <AccordionTrigger className="px-4">Categories</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 px-4 pb-4">
                  {categories.map(category => (
                    <Button
                      key={category.id}
                      variant={activeCategory === category.id ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveCategory(category.id)}
                    >
                      {category.name}
                    </Button>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="price">
              <AccordionTrigger className="px-4">Price Range</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 px-4 pb-4">
                  <Button variant="ghost" className="w-full justify-start">All Prices</Button>
                  <Button variant="ghost" className="w-full justify-start">Free</Button>
                  <Button variant="ghost" className="w-full justify-start">Under $50</Button>
                  <Button variant="ghost" className="w-full justify-start">$50 - $100</Button>
                  <Button variant="ghost" className="w-full justify-start">$100+</Button>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="ratings">
              <AccordionTrigger className="px-4">Ratings</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 px-4 pb-4">
                  <Button variant="ghost" className="w-full justify-start">
                    <div className="flex items-center">
                      <StarIcon className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-2" />
                      <span>4.5 & Up</span>
                    </div>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <div className="flex items-center">
                      <StarIcon className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-2" />
                      <span>4.0 & Up</span>
                    </div>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <div className="flex items-center">
                      <StarIcon className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-2" />
                      <span>3.5 & Up</span>
                    </div>
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">
              {activeCategory === "all" ? "All Categories" : categories.find(c => c.id === activeCategory)?.name}
            </h2>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Tabs defaultValue="courses" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="courses" className="flex gap-2">
                <BookOpenIcon className="h-4 w-4" />
                <span>Courses</span>
              </TabsTrigger>
              <TabsTrigger value="mentors" className="flex gap-2">
                <UsersIcon className="h-4 w-4" />
                <span>Mentors</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="courses" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredCourses.length > 0 ? (
                  filteredCourses.map(course => (
                    <Card key={course.id} className="neo-card overflow-hidden hover-lift">
                      <div className="aspect-video bg-gray-100 flex items-center justify-center relative">
                        <PlayIcon className="h-12 w-12 text-gray-400" />
                        {course.badge && (
                          <Badge className="absolute top-3 right-3">{course.badge}</Badge>
                        )}
                      </div>
                      <CardContent className="p-6 space-y-4">
                        <div>
                          <Badge variant="outline" className="mb-2">
                            {categories.find(c => c.id === course.category)?.name}
                          </Badge>
                          <h3 className="text-lg font-medium leading-tight">{course.title}</h3>
                          <p className="text-sm text-gray-600 mt-2">{course.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={course.instructorAvatar} alt={course.instructor} />
                            <AvatarFallback>{course.instructor.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-gray-600">{course.instructor}</span>
                        </div>
                        <div className="flex justify-between items-center pt-1">
                          <div className="flex items-center gap-1">
                            <StarIcon className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            <span className="text-sm font-medium">{course.rating}</span>
                            <span className="text-sm text-gray-500">({course.students})</span>
                          </div>
                          <div className="text-sm text-gray-600">
                            {course.modules} modules • {course.duration}
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-bold">${course.price}</span>
                          <Button asChild>
                            <Link to={`/course/${course.id}`}>View Course</Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-10">
                    <p className="text-gray-500">No courses found for this category. Try another category or search.</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="mentors" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredMentors.length > 0 ? (
                  filteredMentors.map(mentor => (
                    <Card key={mentor.id} className="neo-card overflow-hidden hover-lift">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-4 items-center md:items-start text-center md:text-left">
                          <Avatar className="h-16 w-16">
                            <AvatarImage src={mentor.avatar} alt={mentor.name} />
                            <AvatarFallback>{mentor.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 space-y-3">
                            <div>
                              <h3 className="text-lg font-medium">{mentor.name}</h3>
                              <p className="text-sm text-gray-600">{mentor.expertise}</p>
                            </div>
                            <p className="text-sm text-gray-600">{mentor.description}</p>
                            <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-2">
                              <div className="flex items-center gap-2">
                                <div className="flex items-center">
                                  <StarIcon className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                  <span className="text-sm font-medium ml-1">{mentor.rating}</span>
                                </div>
                                <span className="text-sm text-gray-500">({mentor.sessions} sessions)</span>
                              </div>
                              <span className="font-bold">${mentor.hourlyRate}/hour</span>
                            </div>
                            <Button asChild className="w-full sm:w-auto">
                              <Link to={`/profile/${mentor.id}`}>View Profile</Link>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-10">
                    <p className="text-gray-500">No mentors found for this category. Try another category or search.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;
