import { useState, useEffect } from "react";
import { CheckCircle, BookOpen, ArrowRight, Calendar } from "lucide-react";
import useUser from "@/utils/useUser";

export default function CourseSuccessPage() {
  const [verificationStatus, setVerificationStatus] = useState("verifying");
  const [error, setError] = useState(null);
  const { data: user } = useUser();

  useEffect(() => {
    const verifyPayment = async () => {
      // Get session_id from URL parameters
      const urlParams = new URLSearchParams(window.location.search);
      const sessionId = urlParams.get("session_id");

      if (!sessionId) {
        setError("Payment session not found");
        setVerificationStatus("error");
        return;
      }

      try {
        const response = await fetch("/api/payments/verify-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });

        if (!response.ok) {
          throw new Error("Payment verification failed");
        }

        const result = await response.json();

        if (result.success) {
          setVerificationStatus("success");
        } else {
          setError("Payment verification failed");
          setVerificationStatus("error");
        }
      } catch (err) {
        console.error("Payment verification error:", err);
        setError(err.message);
        setVerificationStatus("error");
      }
    };

    verifyPayment();
  }, []);

  if (verificationStatus === "verifying") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Verifying your payment...
          </h2>
          <p className="text-gray-600">
            Please wait while we confirm your enrollment.
          </p>
        </div>
      </div>
    );
  }

  if (verificationStatus === "error") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Payment Error
          </h2>
          <p className="text-gray-600 mb-6">
            {error || "There was an issue processing your payment."}
          </p>
          <div className="space-y-3">
            <a
              href="/courses"
              className="block w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Back to Courses
            </a>
            <a
              href="/dashboard"
              className="block w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Go to Dashboard
            </a>
          </div>
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
              {user ? (
                <a
                  href="/dashboard"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Dashboard
                </a>
              ) : (
                <>
                  <a
                    href="/account/signin"
                    className="text-gray-700 hover:text-blue-600 font-medium"
                  >
                    Sign In
                  </a>
                  <a
                    href="/account/signup"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Get Started
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Success Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          {/* Success Icon */}
          <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>

          {/* Success Message */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Your Course!
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Your payment was successful and you're now enrolled. Start learning
            today!
          </p>

          {/* Action Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6 text-left">
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Start Learning
              </h3>
              <p className="text-gray-600 mb-4">
                Access your course materials, watch videos, and track your
                progress.
              </p>
              <a
                href="/dashboard"
                className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
              >
                Go to Course <ArrowRight className="h-4 w-4 ml-1" />
              </a>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 text-left">
              <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Book Live Sessions
              </h3>
              <p className="text-gray-600 mb-4">
                Get personalized help with live interactive lessons from expert
                instructors.
              </p>
              <a
                href="/live-lessons"
                className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
              >
                Browse Live Lessons <ArrowRight className="h-4 w-4 ml-1" />
              </a>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              What's Next?
            </h3>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div>
                <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center mb-3 text-sm font-bold">
                  1
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Access Your Course
                </h4>
                <p className="text-gray-600 text-sm">
                  Go to your dashboard to start watching lessons and accessing
                  course materials.
                </p>
              </div>
              <div>
                <div className="bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center mb-3 text-sm font-bold">
                  2
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Track Progress
                </h4>
                <p className="text-gray-600 text-sm">
                  Monitor your learning journey and see how much you've
                  completed.
                </p>
              </div>
              <div>
                <div className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center mb-3 text-sm font-bold">
                  3
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Get Support
                </h4>
                <p className="text-gray-600 text-sm">
                  Book live lessons or connect with instructors when you need
                  help.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/dashboard"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center"
            >
              <BookOpen className="h-5 w-5 mr-2" />
              Start Learning Now
            </a>
            <a
              href="/courses"
              className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Browse More Courses
            </a>
          </div>

          {/* Email Confirmation Note */}
          <div className="mt-8 text-sm text-gray-500">
            <p>
              📧 A confirmation email has been sent to your email address with
              your enrollment details.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
