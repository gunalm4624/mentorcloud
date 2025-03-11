
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpenIcon, CalendarIcon, PlayIcon, StarIcon, TrendingUpIcon, UserIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const HomePage = () => {
  // Mock featured courses
  const featuredCourses = [
    {
      id: "1",
      title: "Advanced Social Media Marketing",
      instructor: "Jane Smith",
      instructorAvatar: "/placeholder.svg",
      rating: 4.8,
      students: 1243,
      price: 89.99,
      category: "Marketing",
      badge: "Featured"
    },
    {
      id: "2",
      title: "Building a Personal Brand on Instagram",
      instructor: "David Johnson",
      instructorAvatar: "/placeholder.svg",
      rating: 4.9,
      students: 987,
      price: 69.99,
      category: "Personal Branding",
      badge: "Bestseller"
    },
    {
      id: "3",
      title: "Content Creation Masterclass",
      instructor: "Sofia Lee",
      instructorAvatar: "/placeholder.svg",
      rating: 4.7,
      students: 1567,
      price: 99.99,
      category: "Content Creation",
      badge: "New"
    }
  ];

  // Mock mentors
  const topMentors = [
    {
      id: "1",
      name: "John Doe",
      avatar: "/placeholder.svg",
      expertise: "Growth Hacking",
      hourlyRate: 120,
      rating: 4.9
    },
    {
      id: "2",
      name: "Alice Wang",
      avatar: "/placeholder.svg",
      expertise: "SEO Specialist",
      hourlyRate: 95,
      rating: 4.8
    },
    {
      id: "3",
      name: "Michael Brown",
      avatar: "/placeholder.svg",
      expertise: "YouTube Growth",
      hourlyRate: 150,
      rating: 5.0
    }
  ];

  // Mock in-progress courses
  const inProgressCourses = [
    {
      id: "1",
      title: "Advanced Social Media Marketing",
      progress: 68,
      lastAccessed: "2 days ago",
      nextModule: "Module 5: Engagement Strategies"
    }
  ];

  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <section className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-gray-900 to-gray-800 p-8 text-white">
        <div className="absolute inset-0 bg-[url('/placeholder.svg')] opacity-10 mix-blend-overlay"></div>
        <div className="relative z-10 max-w-2xl space-y-4">
          <Badge className="bg-white/20 text-white hover:bg-white/30 transition-colors">New Platform Launch</Badge>
          <h1 className="text-4xl font-bold">Transform Your Knowledge Into Income</h1>
          <p className="text-lg text-white/80">
            Share your expertise through courses and mentorship. Connect with learners globally and monetize your knowledge.
          </p>
          <div className="flex gap-4 pt-2">
            <Button asChild size="lg" className="bg-white text-gray-900 hover:bg-white/90">
              <Link to="/explore">Explore Courses</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="bg-transparent border-white text-white hover:bg-white/10">
              <Link to="/mentorship">Find a Mentor</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Continue Learning Section (If user has in-progress courses) */}
      {inProgressCourses.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Continue Learning</h2>
            <Button variant="link" asChild>
              <Link to="/dashboard">View All My Courses</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {inProgressCourses.map(course => (
              <Card key={course.id} className="neo-card overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    <div className="bg-gray-100 p-4 md:w-1/3 flex items-center justify-center">
                      <PlayIcon className="h-12 w-12 text-gray-500" />
                    </div>
                    <div className="p-6 md:w-2/3 space-y-4">
                      <div>
                        <p className="text-sm text-gray-500">Last accessed {course.lastAccessed}</p>
                        <h3 className="text-xl font-medium">{course.title}</h3>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span className="font-medium">{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} className="h-2" />
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-medium">Next: {course.nextModule}</p>
                        <Button asChild>
                          <Link to={`/course/${course.id}`}>Continue</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Featured Courses Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Featured Courses</h2>
          <Button variant="link" asChild>
            <Link to="/explore">Browse All Courses</Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredCourses.map(course => (
            <Card key={course.id} className="neo-card overflow-hidden hover-lift">
              <div className="aspect-video bg-gray-100 flex items-center justify-center relative">
                <PlayIcon className="h-12 w-12 text-gray-400" />
                <Badge className="absolute top-3 right-3">{course.badge}</Badge>
              </div>
              <CardContent className="p-6 space-y-4">
                <div>
                  <Badge variant="outline" className="mb-2">{course.category}</Badge>
                  <h3 className="text-lg font-medium leading-tight">{course.title}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={course.instructorAvatar} alt={course.instructor} />
                    <AvatarFallback>{course.instructor.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-gray-600">{course.instructor}</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <div className="flex items-center gap-1">
                    <StarIcon className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-medium">{course.rating}</span>
                    <span className="text-sm text-gray-500">({course.students})</span>
                  </div>
                  <span className="font-bold">${course.price}</span>
                </div>
                <Button asChild className="w-full">
                  <Link to={`/course/${course.id}`}>View Course</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Top Mentors Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Top Mentors</h2>
          <Button variant="link" asChild>
            <Link to="/mentorship">View All Mentors</Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topMentors.map(mentor => (
            <Card key={mentor.id} className="neo-card overflow-hidden hover-lift">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center space-y-3">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={mentor.avatar} alt={mentor.name} />
                    <AvatarFallback>{mentor.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-medium">{mentor.name}</h3>
                    <p className="text-sm text-gray-600">{mentor.expertise}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <StarIcon className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-medium">{mentor.rating}</span>
                  </div>
                  <p className="font-bold">${mentor.hourlyRate}/hour</p>
                  <Button asChild className="w-full">
                    <Link to={`/profile/${mentor.id}`}>View Profile</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="rounded-2xl bg-white p-8 border border-gray-200">
        <h2 className="text-2xl font-semibold mb-8 text-center">Why Choose MasterPlan?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-2">
              <BookOpenIcon className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-medium">Quality Courses</h3>
            <p className="text-gray-600">Access high-quality courses from experts and content creators in various fields.</p>
          </div>
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-2">
              <UserIcon className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-medium">1-on-1 Mentorship</h3>
            <p className="text-gray-600">Book personalized mentoring sessions with industry experts for direct guidance.</p>
          </div>
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mb-2">
              <TrendingUpIcon className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-medium">Fast Payouts</h3>
            <p className="text-gray-600">Creators receive earnings the next day with just a 5% platform fee.</p>
          </div>
        </div>
      </section>

      {/* Call-to-action Section */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 text-white text-center">
        <h2 className="text-2xl font-semibold mb-4">Ready to Share Your Knowledge?</h2>
        <p className="max-w-2xl mx-auto mb-6">Create courses, offer mentorship, and start earning from your expertise today.</p>
        <Button size="lg" asChild className="bg-white text-gray-900 hover:bg-white/90">
          <Link to="/dashboard?action=create">Start Creating</Link>
        </Button>
      </section>
    </div>
  );
};

export default HomePage;
