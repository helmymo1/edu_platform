import { BookOpen, Calendar, Play, Users, Star, Clock } from 'lucide-react';

export default function HomePage() {
  const featuredCourses = [
    {
      id: 1,
      title: "JavaScript Fundamentals",
      instructor: "Sarah Johnson",
      duration: "8 hours",
      rating: 4.8,
      students: 1250,
      price: "$89",
      thumbnail: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=225&fit=crop"
    },
    {
      id: 2,
      title: "React Development Masterclass",
      instructor: "Mike Chen",
      duration: "12 hours",
      rating: 4.9,
      students: 890,
      price: "$129",
      thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=225&fit=crop"
    },
    {
      id: 3,
      title: "Python for Data Science",
      instructor: "Dr. Emily Davis",
      duration: "15 hours",
      rating: 4.7,
      students: 2100,
      price: "$149",
      thumbnail: "https://images.unsplash.com/photo-1526379879527-8559ecfcaec0?w=400&h=225&fit=crop"
    }
  ];

  const upcomingLessons = [
    {
      id: 1,
      title: "Advanced React Patterns",
      instructor: "Alex Rodriguez",
      date: "Dec 28, 2024",
      time: "2:00 PM EST",
      spots: 5
    },
    {
      id: 2,
      title: "Database Design Workshop",
      instructor: "Lisa Wang",
      date: "Dec 30, 2024",
      time: "10:00 AM EST",
      spots: 3
    }
  ];

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
              <a href="/courses" className="text-gray-700 hover:text-blue-600 font-medium">Courses</a>
              <a href="/live-lessons" className="text-gray-700 hover:text-blue-600 font-medium">Live Lessons</a>
              <a href="/instructors" className="text-gray-700 hover:text-blue-600 font-medium">Instructors</a>
            </nav>
            <div className="flex items-center space-x-4">
              <button className="text-gray-700 hover:text-blue-600 font-medium">Sign In</button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-bold mb-6">Learn Without Limits</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Access thousands of recorded courses and book live lessons with expert instructors.
            Start your learning journey today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Browse Courses
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
              Book Live Lesson
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">10,000+</div>
              <div className="text-gray-600">Students</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600">Courses</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">100+</div>
              <div className="text-gray-600">Expert Instructors</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">98%</div>
              <div className="text-gray-600">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Featured Courses</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Learn from industry experts with our most popular recorded courses
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCourses.map((course) => (
              <div key={course.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">{course.title}</h4>
                  <p className="text-gray-600 mb-4">by {course.instructor}</p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {course.duration}
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {course.students}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" />
                      <span className="text-sm font-medium">{course.rating}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-blue-600">{course.price}</span>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      Enroll Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Lessons */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Upcoming Live Lessons</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Join interactive sessions with expert instructors in real-time
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {upcomingLessons.map((lesson) => (
              <div key={lesson.id} className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-100">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">{lesson.title}</h4>
                    <p className="text-gray-600">with {lesson.instructor}</p>
                  </div>
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm text-gray-600">
                    <div>{lesson.date}</div>
                    <div>{lesson.time}</div>
                  </div>
                  <div className="text-sm text-green-600 font-medium">
                    {lesson.spots} spots left
                  </div>
                </div>

                <button className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium">
                  Book This Lesson
                </button>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button className="bg-gray-900 text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium">
              View All Live Lessons
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Why Choose EduPlatform?</h3>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Play className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2">On-Demand Learning</h4>
              <p className="text-gray-600">Access courses anytime, anywhere with lifetime access</p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Live Sessions</h4>
              <p className="text-gray-600">Interactive lessons with real-time Q&A and feedback</p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Expert Instructors</h4>
              <p className="text-gray-600">Learn from industry professionals and certified teachers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <BookOpen className="h-6 w-6" />
                <span className="text-xl font-bold">EduPlatform</span>
              </div>
              <p className="text-gray-400">Empowering learners worldwide with quality education.</p>
            </div>

            <div>
              <h5 className="font-semibold mb-4">Courses</h5>
              <ul className="space-y-2 text-gray-400">
                <li>Web Development</li>
                <li>Data Science</li>
                <li>Mobile Apps</li>
                <li>Design</li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold mb-4">Support</h5>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Community</li>
                <li>FAQ</li>
              </ul>
            </div>

            <div>
              <h5 className="font-semibold mb-4">Company</h5>
              <ul className="space-y-2 text-gray-400">
                <li>About</li>
                <li>Careers</li>
                <li>Privacy</li>
                <li>Terms</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 EduPlatform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}