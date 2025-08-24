import { useState } from 'react';
import { BookOpen, Search, Star, Users, Play, Calendar, Award, MapPin } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

export default function InstructorsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExpertise, setSelectedExpertise] = useState('all');

  const expertiseAreas = [
    { id: 'all', name: 'All Expertise' },
    { id: 'JavaScript', name: 'JavaScript' },
    { id: 'React', name: 'React' },
    { id: 'Python', name: 'Python' },
    { id: 'Data Science', name: 'Data Science' },
    { id: 'UI/UX Design', name: 'UI/UX Design' },
    { id: 'Mobile Development', name: 'Mobile Development' },
    { id: 'Machine Learning', name: 'Machine Learning' }
  ];

  // Mock data for instructors (in real app, this would come from API)
  const instructors = [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah@eduplatform.com",
      bio: "Frontend developer with 8+ years of experience in React and JavaScript. Passionate about teaching modern web development and helping students build real-world applications.",
      avatar_url: "https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=300&h=300&fit=crop&crop=face",
      expertise: ["JavaScript", "React", "Frontend Development"],
      rating: 4.9,
      total_students: 3420,
      total_courses: 8,
      total_live_lessons: 15,
      years_experience: 8,
      location: "San Francisco, CA"
    },
    {
      id: 2,
      name: "Mike Chen",
      email: "mike@eduplatform.com",
      bio: "Full-stack developer and React expert with experience at major tech companies. Specializes in building scalable web applications and teaching best practices.",
      avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
      expertise: ["React", "Node.js", "Full-stack Development"],
      rating: 4.8,
      total_students: 2890,
      total_courses: 6,
      total_live_lessons: 12,
      years_experience: 10,
      location: "Seattle, WA"
    },
    {
      id: 3,
      name: "Dr. Emily Davis",
      email: "emily@eduplatform.com",
      bio: "Data scientist with PhD in Statistics and 10+ years in machine learning. Expert in Python, data analysis, and helping students transition into data science careers.",
      avatar_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
      expertise: ["Python", "Data Science", "Machine Learning"],
      rating: 4.9,
      total_students: 5240,
      total_courses: 12,
      total_live_lessons: 20,
      years_experience: 12,
      location: "Boston, MA"
    },
    {
      id: 4,
      name: "Alex Rodriguez",
      email: "alex@eduplatform.com",
      bio: "Senior software engineer specializing in React and advanced JavaScript patterns. Loves sharing knowledge about clean code, performance optimization, and modern development practices.",
      avatar_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
      expertise: ["React", "JavaScript", "Software Architecture"],
      rating: 4.8,
      total_students: 1950,
      total_courses: 5,
      total_live_lessons: 18,
      years_experience: 7,
      location: "Austin, TX"
    },
    {
      id: 5,
      name: "Lisa Wang",
      email: "lisa@eduplatform.com",
      bio: "iOS developer and database expert with experience in enterprise applications. Passionate about mobile development and teaching students to build production-ready apps.",
      avatar_url: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=300&h=300&fit=crop&crop=face",
      expertise: ["iOS Development", "Swift", "Database Design"],
      rating: 4.9,
      total_students: 2150,
      total_courses: 7,
      total_live_lessons: 10,
      years_experience: 9,
      location: "New York, NY"
    },
    {
      id: 6,
      name: "Jessica Brown",
      email: "jessica@eduplatform.com",
      bio: "UX designer with 6+ years creating user-centered digital experiences. Expert in design thinking, user research, and helping students develop strong design fundamentals.",
      avatar_url: "https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=300&h=300&fit=crop&crop=face",
      expertise: ["UI/UX Design", "User Research", "Prototyping"],
      rating: 4.8,
      total_students: 3680,
      total_courses: 9,
      total_live_lessons: 14,
      years_experience: 6,
      location: "Los Angeles, CA"
    }
  ];

  const filteredInstructors = instructors.filter(instructor => {
    const matchesSearch = instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         instructor.bio.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesExpertise = selectedExpertise === 'all' ||
                            instructor.expertise.includes(selectedExpertise);
    return matchesSearch && matchesExpertise;
  });

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
              <a href="/instructors" className="text-blue-600 font-medium">Instructors</a>
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

      {/* Page Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-4">Meet Our Expert Instructors</h2>
          <p className="text-xl max-w-2xl">
            Learn from industry professionals and certified teachers who are passionate about sharing their knowledge and helping you succeed.
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
                placeholder="Search instructors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Expertise Filter */}
            <div className="lg:w-64">
              <select
                value={selectedExpertise}
                onChange={(e) => setSelectedExpertise(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {expertiseAreas.map(area => (
                  <option key={area.id} value={area.id}>
                    {area.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredInstructors.length} expert instructors
          </p>
        </div>

        {/* Instructors Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {filteredInstructors.map((instructor) => (
            <div key={instructor.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start space-x-4 mb-4">
                  <img
                    src={instructor.avatar_url}
                    alt={instructor.name}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                      {instructor.name}
                    </h3>
                    <div className="flex items-center space-x-2 mb-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600 text-sm">{instructor.location}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                        <span className="text-sm font-medium">{instructor.rating}</span>
                      </div>
                      <div className="flex items-center">
                        <Award className="h-4 w-4 text-blue-500 mr-1" />
                        <span className="text-sm text-gray-600">{instructor.years_experience} years exp.</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {instructor.bio}
                </p>

                {/* Expertise Tags */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Expertise:</h4>
                  <div className="flex flex-wrap gap-2">
                    {instructor.expertise.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="flex items-center justify-center mb-1">
                        <Users className="h-4 w-4 text-gray-500 mr-1" />
                        <span className="text-lg font-semibold text-gray-900">
                          {instructor.total_students.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">Students</p>
                    </div>
                    <div>
                      <div className="flex items-center justify-center mb-1">
                        <Play className="h-4 w-4 text-gray-500 mr-1" />
                        <span className="text-lg font-semibold text-gray-900">
                          {instructor.total_courses}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">Courses</p>
                    </div>
                    <div>
                      <div className="flex items-center justify-center mb-1">
                        <Calendar className="h-4 w-4 text-gray-500 mr-1" />
                        <span className="text-lg font-semibold text-gray-900">
                          {instructor.total_live_lessons}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">Live Lessons</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-3">
                  <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm">
                    View Courses
                  </button>
                  <button className="flex-1 border border-blue-600 text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors font-medium text-sm">
                    Live Lessons
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredInstructors.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No instructors found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search terms or filters to find the instructors you're looking for.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedExpertise('all');
              }}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Why Learn From Our Instructors */}
        <div className="mt-16 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Why Learn From Our Instructors?</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Award className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-semibold mb-2">Industry Experience</h4>
              <p className="text-gray-600 text-sm">Learn from professionals with real-world experience at top companies</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-semibold mb-2">Proven Track Record</h4>
              <p className="text-gray-600 text-sm">Our instructors have taught thousands of successful students</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Star className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-semibold mb-2">Highly Rated</h4>
              <p className="text-gray-600 text-sm">All instructors maintain high ratings and positive student feedback</p>
            </div>
          </div>
        </div>

        {/* Join Our Team CTA */}
        <div className="mt-16 bg-gray-900 rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Want to Become an Instructor?</h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Share your expertise with thousands of eager learners. Join our community of expert instructors and make an impact in education.
          </p>
          <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
            Apply to Teach
          </button>
        </div>
      </div>
    </div>
  );
}