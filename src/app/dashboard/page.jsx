import { useState } from "react";
import {
  BookOpen,
  Calendar,
  Clock,
  Users,
  Award,
  Play,
  Video,
  CheckCircle,
  ExternalLink,
  User,
  LogOut,
  BarChart3
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import useUser from "@/utils/useUser";
import useAuth from "@/utils/useAuth";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const { data: user, loading: userLoading } = useUser();
  const { signOut } = useAuth();

  // Fetch dashboard data
  const {
    data: dashboardData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/user/dashboard");
      if (!response.ok) {
        throw new Error("Failed to fetch dashboard data");
      }
      return response.json();
    },
    enabled: !!user, // Only fetch when user is loaded
  });

  const handleSignOut = async () => {
    await signOut({
      callbackUrl: "/",
      redirect: true,
    });
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

  if (userLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Sign In</h2>
          <a
            href="/account/signin?callbackUrl=/dashboard"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }

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
              <a href="/" className="text-gray-700 hover:text-blue-600 font-medium">Home</a>
              <a href="/courses" className="text-gray-700 hover:text-blue-600 font-medium">Courses</a>
              <a href="/live-lessons" className="text-gray-700 hover:text-blue-600 font-medium">Live Lessons</a>
              <a href="/instructors" className="text-gray-700 hover:text-blue-600 font-medium">Instructors</a>
            </nav>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-600" />
                <span className="text-gray-700">{user.email}</span>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-1 text-gray-700 hover:text-red-600 font-medium"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.name || user.email}!
          </h2>
          <p className="text-gray-600">
            Track your learning progress and manage your upcoming sessions.
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your dashboard...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">Error loading dashboard: {error.message}</p>
          </div>
        )}

        {/* Dashboard Content */}
        {dashboardData && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Enrolled Courses</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {dashboardData.stats.totalCoursesEnrolled}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="bg-green-100 p-3 rounded-full">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Completed Courses</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {dashboardData.stats.completedCourses}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="bg-purple-100 p-3 rounded-full">
                    <Calendar className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Upcoming Lessons</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {dashboardData.stats.upcomingLessonsCount}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className="bg-yellow-100 p-3 rounded-full">
                    <Award className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Live Lessons Attended</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {dashboardData.stats.attendedLessons}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-md mb-6">
              <div className="border-b">
                <nav className="flex">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`px-6 py-3 font-medium text-sm ${
                      activeTab === 'overview'
                        ? 'border-b-2 border-blue-600 text-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveTab('courses')}
                    className={`px-6 py-3 font-medium text-sm ${
                      activeTab === 'courses'
                        ? 'border-b-2 border-blue-600 text-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    My Courses
                  </button>
                  <button
                    onClick={() => setActiveTab('schedule')}
                    className={`px-6 py-3 font-medium text-sm ${
                      activeTab === 'schedule'
                        ? 'border-b-2 border-blue-600 text-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Schedule
                  </button>
                </nav>
              </div>

              <div className="p-6">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Next Upcoming Lesson */}
                    {dashboardData.upcomingLessons.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Next Live Lesson</h3>
                        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                                {dashboardData.upcomingLessons[0].title}
                              </h4>
                              <p className="text-gray-600 mb-3">
                                with {dashboardData.upcomingLessons[0].instructor_name}
                              </p>
                              <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <span className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  {formatDate(dashboardData.upcomingLessons[0].scheduled_date)}
                                </span>
                                <span className="flex items-center">
                                  <Clock className="h-4 w-4 mr-1" />
                                  {formatTime(dashboardData.upcomingLessons[0].scheduled_time)} {dashboardData.upcomingLessons[0].timezone}
                                </span>
                              </div>
                            </div>
                            {dashboardData.upcomingLessons[0].meeting_url && (
                              <a
                                href={dashboardData.upcomingLessons[0].meeting_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                              >
                                <Video className="h-4 w-4 mr-2" />
                                Join Lesson
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Recent Courses */}
                    {dashboardData.enrolledCourses.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Continue Learning</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          {dashboardData.enrolledCourses.slice(0, 4).map((course) => (
                            <div key={course.enrollment_id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                              <div className="flex items-start space-x-3">
                                {course.thumbnail_url && (
                                  <img
                                    src={course.thumbnail_url}
                                    alt={course.title}
                                    className="w-16 h-16 rounded-lg object-cover"
                                  />
                                )}
                                <div className="flex-1">
                                  <h4 className="font-semibold text-gray-900 mb-1">{course.title}</h4>
                                  <p className="text-sm text-gray-600 mb-2">with {course.instructor_name}</p>
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                      className="bg-blue-600 h-2 rounded-full"
                                      style={{ width: `${course.progress}%` }}
                                    />
                                  </div>
                                  <p className="text-xs text-gray-500 mt-1">{course.progress}% complete</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Courses Tab */}
                {activeTab === 'courses' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">My Enrolled Courses</h3>
                    {dashboardData.enrolledCourses.length > 0 ? (
                      <div className="space-y-4">
                        {dashboardData.enrolledCourses.map((course) => (
                          <div key={course.enrollment_id} className="border rounded-lg p-6">
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex-1">
                                <h4 className="text-xl font-semibold text-gray-900 mb-2">{course.title}</h4>
                                <p className="text-gray-600 mb-2">{course.description}</p>
                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                  <span>Instructor: {course.instructor_name}</span>
                                  <span>Level: {course.level}</span>
                                  <span>Duration: {course.duration_hours}h</span>
                                  <span>Enrolled: {formatDate(course.enrolled_at)}</span>
                                </div>
                              </div>
                              {course.thumbnail_url && (
                                <img
                                  src={course.thumbnail_url}
                                  alt={course.title}
                                  className="w-24 h-24 rounded-lg object-cover ml-4"
                                />
                              )}
                            </div>
                            <div className="mb-4">
                              <div className="flex justify-between text-sm text-gray-600 mb-1">
                                <span>Progress</span>
                                <span>{course.progress}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full transition-all"
                                  style={{ width: `${course.progress}%` }}
                                />
                              </div>
                            </div>
                            {course.completed_at ? (
                              <div className="flex items-center text-green-600">
                                <CheckCircle className="h-5 w-5 mr-2" />
                                <span className="font-medium">Completed on {formatDate(course.completed_at)}</span>
                              </div>
                            ) : (
                              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                                Continue Learning
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">No courses enrolled yet</h4>
                        <p className="text-gray-600 mb-4">Start your learning journey by enrolling in a course.</p>
                        <a
                          href="/courses"
                          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Browse Courses
                        </a>
                      </div>
                    )}
                  </div>
                )}

                {/* Schedule Tab */}
                {activeTab === 'schedule' && (
                  <div className="space-y-6">
                    {/* Upcoming Lessons */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Live Lessons</h3>
                      {dashboardData.upcomingLessons.length > 0 ? (
                        <div className="space-y-4">
                          {dashboardData.upcomingLessons.map((lesson) => (
                            <div key={lesson.booking_id} className="border rounded-lg p-6 bg-blue-50 border-blue-200">
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <h4 className="text-xl font-semibold text-gray-900 mb-2">{lesson.title}</h4>
                                  <p className="text-gray-600 mb-3">with {lesson.instructor_name}</p>
                                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                                    <span className="flex items-center">
                                      <Calendar className="h-4 w-4 mr-1" />
                                      {formatDate(lesson.scheduled_date)}
                                    </span>
                                    <span className="flex items-center">
                                      <Clock className="h-4 w-4 mr-1" />
                                      {formatTime(lesson.scheduled_time)} {lesson.timezone}
                                    </span>
                                    <span className="flex items-center">
                                      <Video className="h-4 w-4 mr-1" />
                                      {lesson.duration_hours}h session
                                    </span>
                                  </div>
                                  <span className={`px-2 py-1 rounded text-xs font-medium ${{
                                    'Beginner': 'bg-green-100 text-green-800',
                                    'Intermediate': 'bg-yellow-100 text-yellow-800',
                                    'Advanced': 'bg-red-100 text-red-800'
                                  }[lesson.level] || 'bg-gray-100 text-gray-800'}`}>
                                    {lesson.level}
                                  </span>
                                </div>
                                {lesson.meeting_url && (
                                  <a
                                    href={lesson.meeting_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                                  >
                                    <ExternalLink className="h-4 w-4 mr-2" />
                                    Join Meeting
                                  </a>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                          <h4 className="text-lg font-semibold text-gray-900 mb-2">No upcoming lessons</h4>
                          <p className="text-gray-600 mb-4">Book a live lesson to get personalized instruction.</p>
                          <a
                            href="/live-lessons"
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Browse Live Lessons
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Past Lessons */}
                    {dashboardData.pastLessons.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Past Live Lessons</h3>
                        <div className="space-y-4">
                          {dashboardData.pastLessons.slice(0, 5).map((lesson) => (
                            <div key={lesson.booking_id} className="border rounded-lg p-4 bg-gray-50">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-semibold text-gray-900">{lesson.title}</h4>
                                  <p className="text-sm text-gray-600">with {lesson.instructor_name}</p>
                                  <p className="text-sm text-gray-500">
                                    {formatDate(lesson.scheduled_date)} at {formatTime(lesson.scheduled_time)}
                                  </p>
                                </div>
                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                  lesson.attended
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {lesson.attended ? 'Attended' : 'Missed'}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}