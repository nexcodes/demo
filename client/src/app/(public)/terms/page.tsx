import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, AlertTriangle, Users, Shield } from "lucide-react"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            Legal
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Terms & Conditions</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Please read these terms carefully before using our dating platform. By using our service, you agree to these
            terms.
          </p>
          <p className="text-sm text-gray-500 mt-4">Last updated: January 1, 2024</p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Introduction */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Agreement to Terms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed">
                {`These Terms and Conditions ("Terms") govern your use of our dating application and website
                (collectively, the "Service") operated by [Your Company Name] ("we," "us," or "our"). By accessing or
                using our Service, you agree to be bound by these Terms. If you disagree with any part of these terms,
                you may not access the Service.`}
              </p>
            </CardContent>
          </Card>

          {/* Eligibility */}
          <Card>
            <CardHeader>
              <CardTitle>Eligibility and Account Registration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Age Requirements</h4>
                <p className="text-gray-600 mb-4">
                  You must be at least 18 years old to use our Service. By creating an account, you represent and
                  warrant that you are at least 18 years of age.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Account Information</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-pink-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-600">Provide accurate and complete information</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-pink-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-600">Maintain the security of your account credentials</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-pink-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-600">Notify us immediately of any unauthorized access</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-pink-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-600">You may only create one account</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* User Conduct */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                User Conduct and Community Guidelines
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2 text-green-700">You agree to:</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-600">Treat other users with respect and kindness</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-600">Use recent and accurate photos of yourself</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-600">Provide truthful information in your profile</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-600">Report inappropriate behavior or content</span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2 text-red-700">You agree NOT to:</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-600">Harass, abuse, or harm other users</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-600">Share explicit, offensive, or inappropriate content</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-600">Use fake photos or impersonate others</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-600">Spam, solicit, or promote commercial activities</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-600">Attempt to hack or compromise our systems</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Privacy and Safety */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Privacy and Safety
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Phone Verification</h4>
                <p className="text-gray-600">
                  All users must verify their phone number to maintain a safe and authentic community. Your phone number
                  is kept private and secure.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Profile Information</h4>
                <p className="text-gray-600">
                  Information you share in your profile will be visible to other users. You control what information to
                  include and can update your privacy settings at any time.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Safety Measures</h4>
                <p className="text-gray-600">
                  We implement various safety measures including user reporting, content moderation, and account
                  verification. However, you are responsible for your own safety when meeting people from our platform.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Subscription and Payments */}
          <Card>
            <CardHeader>
              <CardTitle>Subscription and Payments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Premium Features</h4>
                <p className="text-gray-600 mb-4">
                  Our Service offers both free and premium features. Premium subscriptions provide additional
                  functionality and enhanced user experience.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Billing and Renewals</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-pink-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-600">Subscriptions automatically renew unless cancelled</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-pink-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-600">You can cancel anytime through your account settings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-pink-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-600">Refunds are subject to our Refund Policy</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-pink-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-600">Price changes will be communicated in advance</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Intellectual Property */}
          <Card>
            <CardHeader>
              <CardTitle>Intellectual Property</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Our Content</h4>
                <p className="text-gray-600">
                  The Service and its original content, features, and functionality are owned by us and are protected by
                  international copyright, trademark, and other intellectual property laws.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Your Content</h4>
                <p className="text-gray-600">
                  You retain ownership of content you submit to the Service. By uploading content, you grant us a
                  license to use, display, and distribute your content in connection with the Service.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Termination */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Account Termination
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Termination by You</h4>
                <p className="text-gray-600">
                  You may delete your account at any time through your account settings. Upon deletion, your profile and
                  personal information will be removed from our Service.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Termination by Us</h4>
                <p className="text-gray-600 mb-2">
                  We may suspend or terminate your account if you violate these Terms, including but not limited to:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-pink-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-600">Violating community guidelines</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-pink-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-600">Engaging in harmful or illegal activities</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-pink-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-600">Creating multiple accounts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-pink-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-600">Attempting to circumvent our systems</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Disclaimers */}
          <Card>
            <CardHeader>
              <CardTitle>Disclaimers and Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Service Availability</h4>
                <p className="text-gray-600">
                  {`We strive to maintain Service availability but cannot guarantee uninterrupted access. The Service is
                  provided "as is" without warranties of any kind.`}
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">User Interactions</h4>
                <p className="text-gray-600">
                  We are not responsible for the conduct of users or the outcome of any meetings or relationships formed
                  through our Service. Users interact at their own risk.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Limitation of Liability</h4>
                <p className="text-gray-600">
                  To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special,
                  or consequential damages arising from your use of the Service.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card className="bg-gray-900 text-white">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4">Questions About These Terms?</h3>
              <p className="mb-4">If you have any questions about these Terms and Conditions, please contact us:</p>
              <div className="space-y-2 text-sm">
                <p>
                  <strong>Email:</strong> legal@yourapp.com
                </p>
                <p>
                  <strong>Address:</strong> [Your Company Address]
                </p>
                <p className="text-gray-300 mt-4">
                  These terms are effective as of the date listed above and may be updated from time to time.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
