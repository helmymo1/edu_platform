import { useState } from "react";
import {
  BookOpen,
  Search,
  Filter,
  Star,
  Clock,
  Users,
  Play,
  CreditCard,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useUser from "@/utils/useUser";

export default function CoursesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const queryClient = useQueryClient();
  const { data: user } = useUser();

  const categories = [
    { id: "all", name: "All Courses" },
    { id: "web-dev", name: "Web Development" },
    { id: "data-science", name: "Data Science" },
    { id: "mobile", name: "Mobile Development" },
    { id: "design", name: "Design" },
    { id: "business", name: "Business" },
    { id: "marketing", name: "Marketing" },
  ];

  // Fetch courses with filters
  const {
    data: coursesData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["courses", selectedCategory, searchTerm, sortBy],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedCategory !== "all")
        params.append("category", selectedCategory);
      if (searchTerm) params.append("search", searchTerm);
      if (sortBy) params.append("sortBy", sortBy);

      const response = await fetch(`/api/courses?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch courses");
      }
      return response.json();
    },
  });

  // Updated enrollment mutation with payment integration
  const enrollMutation = useMutation({
    mutationFn: async (courseId) => {
      if (!user) {
        window.location.href =
          "/account/signin?callbackUrl=" +
          encodeURIComponent(window.location.pathname);
        return;
      }

      const response = await fetch("/api/payments/course-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId,
          redirectURL: window.location.origin + "/course-success",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to start enrollment");
      }

      const { url } = await response.json();
      window.open(url, "_blank", "popup");
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  const courses = coursesData?.courses || [];

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
              <a href="/courses" className="text-blue-600 font-medium">
                Courses
              </a>
              <a
                href="/live-lessons"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
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
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-4">Explore Our Courses</h2>
          <p className="text-xl max-w-2xl">
            Discover thousands of courses from expert instructors and advance
            your skills today.
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
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="lg:w-64">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="lg:w-48">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading courses...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">
              Error loading courses: {error.message}
            </p>
            <button
              onClick={() =>
                queryClient.invalidateQueries({ queryKey: ["courses"] })
              }
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Results Count */}
        {!isLoading && !error && (
          <div className="mb-6">
            <p className="text-gray-600">Showing {courses.length} courses</p>
          </div>
        )}

        {/* Course Grid */}
        {!isLoading && !error && (
          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative">
                  <img
                    src={
                      course.thumbnail_url ||
                      "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=225&fit=crop"
                    }
                    alt={course.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-blue-600 text-white px-2 py-1 rounded text-sm font-medium">
                      {course.level}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm flex items-center">
                      <Play className="h-3 w-3 mr-1" />
                      {course.total_lessons} lessons
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 mb-2">
                    by {course.instructor_name}
                  </p>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                    {course.description}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {course.duration_hours}h
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {course.enrolled_students?.toLocaleString() || 0}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" />
                      <span className="text-sm font-medium">
                        {course.rating || 0}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-blue-600">
                      ${course.price}
                    </span>
                    <button
                      onClick={() => enrollMutation.mutate(course.id)}
                      disabled={enrollMutation.isLoading}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 flex items-center"
                    >
                      {enrollMutation.isLoading ? (
                        "Processing..."
                      ) : (
                        <>
                          <CreditCard className="h-4 w-4 mr-2" />
                          Enroll Now
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {!isLoading && !error && courses.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No courses found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search terms or filters to find what you're
              looking for.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
                setSortBy("popular");
              }}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
