import { useState } from "react";
import {
  BookOpen,
  Calendar,
  Clock,
  Users,
  Video,
  MapPin,
  Filter,
  Search,
  CreditCard,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useUser from "@/utils/useUser";

export default function LiveLessonsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("all");
  const queryClient = useQueryClient();
  const { data: user } = useUser();

  const categories = [
    { id: "all", name: "All Categories" },
    { id: "web-dev", name: "Web Development" },
    { id: "data-science", name: "Data Science" },
    { id: "mobile", name: "Mobile Development" },
    { id: "design", name: "Design" },
    { id: "business", name: "Business" },
    { id: "marketing", name: "Marketing" },
  ];

  const timeSlots = [
    { id: "all", name: "All Times" },
    { id: "morning", name: "Morning (8AM - 12PM)" },
    { id: "afternoon", name: "Afternoon (12PM - 6PM)" },
    { id: "evening", name: "Evening (6PM - 10PM)" },
  ];

  // Fetch live lessons with filters
  const {
    data: lessonsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["live-lessons", selectedCategory, searchTerm, selectedTimeSlot],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedCategory !== "all")
        params.append("category", selectedCategory);
      if (searchTerm) params.append("search", searchTerm);
      if (selectedTimeSlot !== "all")
        params.append("timeSlot", selectedTimeSlot);

      const response = await fetch(`/api/live-lessons?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch live lessons");
      }
      return response.json();
    },
  });

  // Updated book lesson mutation with payment integration
  const bookMutation = useMutation({
    mutationFn: async (lessonId) => {
      if (!user) {
        window.location.href =
          "/account/signin?callbackUrl=" +
          encodeURIComponent(window.location.pathname);
        return;
      }

      const response = await fetch("/api/payments/live-lesson-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          liveLessonId: lessonId,
          redirectURL: window.location.origin + "/lesson-success",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to book lesson");
      }

      const { url } = await response.json();
      window.open(url, "_blank", "popup");
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  const liveLessons = lessonsData?.lessons || [];

  const getAvailableSpots = (lesson) => {
    return (
      lesson.available_spots || lesson.max_students - lesson.enrolled_students
    );
  };

  const getLevelColor = (level) => {
    switch (level) {
      case "Beginner":
        return "bg-green-100 text-green-800";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "Advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">EduPlatform</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a
                href="/"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Home
              </a>
              <a
                href="/courses"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Courses
              </a>
              <a href="/live-lessons" className="text-blue-600 font-medium">
                Live Lessons
              </a>
              <a
                href="/instructors"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Instructors
              </a>
            </nav>
            <div className="flex items-center space-x-4">
              <button className="text-gray-700 hover:text-blue-600 font-medium">
                Sign In
              </button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Page Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-4">Live Interactive Lessons</h2>
          <p className="text-xl max-w-2xl">
            Join expert instructors for real-time learning experiences with live
            Q&A, hands-on exercises, and personalized feedback.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search live lessons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="lg:w-64">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Time Filter */}
            <div className="lg:w-64">
              <select
                value={selectedTimeSlot}
                onChange={(e) => setSelectedTimeSlot(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {timeSlots.map((slot) => (
                  <option key={slot.id} value={slot.id}>
                    {slot.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading live lessons...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">
              Error loading live lessons: {error.message}
            </p>
            <button
              onClick={() =>
                queryClient.invalidateQueries({ queryKey: ["live-lessons"] })
              }
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Results Count */}
        {!isLoading && !error && (
          <div className="mb-6">
            <p className="text-gray-600">
              Showing {liveLessons.length} upcoming live lessons
            </p>
          </div>
        )}

        {/* Lessons Grid */}
        {!isLoading && !error && (
          <div className="grid lg:grid-cols-2 gap-8">
            {liveLessons.map((lesson) => (
              <div
                key={lesson.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {lesson.title}
                      </h3>
                      <div className="flex items-center space-x-3 mb-3">
                        <img
                          src={
                            lesson.instructor_avatar ||
                            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face"
                          }
                          alt={lesson.instructor_name}
                          className="w-8 h-8 rounded-full"
                        />
                        <span className="text-gray-600">
                          with {lesson.instructor_name}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <span
                        className={`px-2 py-1 rounded text-sm font-medium ${getLevelColor(lesson.level)}`}
                      >
                        {lesson.level}
                      </span>
                      <div className="text-2xl font-bold text-purple-600">
                        ${lesson.price}
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4">
                    {lesson.description}
                  </p>

                  {/* Topics */}
                  {lesson.topics && lesson.topics.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">
                        What you'll learn:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {lesson.topics.map((topic, index) => (
                          <span
                            key={index}
                            className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Session Details */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                        <span>{formatDate(lesson.scheduled_date)}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-gray-500 mr-2" />
                        <span>
                          {formatTime(lesson.scheduled_time)} {lesson.timezone}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Video className="h-4 w-4 text-gray-500 mr-2" />
                        <span>{lesson.duration_hours}h live session</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 text-gray-500 mr-2" />
                        <span>{getAvailableSpots(lesson)} spots left</span>
                      </div>
                    </div>
                  </div>

                  {/* Enrollment Progress */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>
                        Enrolled: {lesson.enrolled_students}/
                        {lesson.max_students}
                      </span>
                      <span>
                        {Math.round(
                          (lesson.enrolled_students / lesson.max_students) *
                            100,
                        )}
                        % full
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full transition-all"
                        style={{
                          width: `${(lesson.enrolled_students / lesson.max_students) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      {getAvailableSpots(lesson) > 0 ? (
                        <span className="text-green-600 font-medium">
                          {getAvailableSpots(lesson)} spots available
                        </span>
                      ) : (
                        <span className="text-red-600 font-medium">
                          Fully booked
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => bookMutation.mutate(lesson.id)}
                      disabled={
                        getAvailableSpots(lesson) === 0 ||
                        bookMutation.isLoading
                      }
                      className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center ${
                        getAvailableSpots(lesson) > 0 && !bookMutation.isLoading
                          ? "bg-purple-600 text-white hover:bg-purple-700"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      {bookMutation.isLoading ? (
                        "Processing..."
                      ) : getAvailableSpots(lesson) > 0 ? (
                        <>
                          <CreditCard className="h-4 w-4 mr-2" />
                          Book This Lesson
                        </>
                      ) : (
                        "Fully Booked"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {!isLoading && !error && liveLessons.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Calendar className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No live lessons found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search terms or filters to find available
              sessions.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
                setSelectedTimeSlot("all");
              }}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-16 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Why Choose Live Lessons?
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Video className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-semibold mb-2">Real-time Interaction</h4>
              <p className="text-gray-600 text-sm">
                Ask questions and get immediate feedback from expert instructors
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-semibold mb-2">Small Class Sizes</h4>
              <p className="text-gray-600 text-sm">
                Limited enrollment ensures personalized attention for every
                student
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-semibold mb-2">Hands-on Practice</h4>
              <p className="text-gray-600 text-sm">
                Follow along with live coding and practical exercises
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
