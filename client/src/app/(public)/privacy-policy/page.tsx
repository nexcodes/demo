import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Eye, Lock, Users, Database, Globe } from "lucide-react"

export default function PrivacyPolicyPage() {
  const sections = [
    {
      icon: Database,
      title: "Information We Collect",
      content: [
        "Profile information (name, age, photos, preferences)",
        "Contact information (phone number, email address)",
        "Location data (for matching purposes)",
        "Usage data (app interactions, messages)",
        "Device information (IP address, device type)",
        "Photos and media you upload to your profile",
      ],
    },
    {
      icon: Eye,
      title: "How We Use Your Information",
      content: [
        "Provide and improve our matching services",
        "Verify your identity and prevent fraud",
        "Send you matches and notifications",
        "Analyze usage patterns to enhance user experience",
        "Comply with legal obligations",
        "Communicate important updates and changes",
      ],
    },
    {
      icon: Users,
      title: "Information Sharing",
      content: [
        "Profile information visible to other users",
        "Aggregated, anonymized data for research",
        "Service providers who help operate our platform",
        "Legal authorities when required by law",
        "Business partners with your explicit consent",
        "We never sell your personal data to third parties",
      ],
    },
    {
      icon: Lock,
      title: "Data Security",
      content: [
        "End-to-end encryption for sensitive data",
        "Secure servers with regular security audits",
        "Two-factor authentication options",
        "Regular security training for our team",
        "Incident response procedures",
        "Compliance with industry security standards",
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            Legal
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your privacy is important to us. This policy explains how we collect, use, and protect your personal
            information.
          </p>
          <p className="text-sm text-gray-500 mt-4">Last updated: January 1, 2024</p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Introduction */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Our Commitment to Privacy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed">
                At our dating platform, we understand that privacy is fundamental to building trust and meaningful
                connections. This Privacy Policy describes how we collect, use, disclose, and safeguard your information
                when you use our mobile application and website. We are committed to protecting your personal
                information and being transparent about our data practices.
              </p>
            </CardContent>
          </Card>

          {/* Main Sections */}
          {sections.map((section, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <section.icon className="w-5 h-5" />
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {section.content.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-pink-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}

          {/* Your Rights */}
          <Card>
            <CardHeader>
              <CardTitle>Your Privacy Rights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">You have several rights regarding your personal information:</p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold">Access</h4>
                    <p className="text-sm text-gray-600">Request a copy of your personal data</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Correction</h4>
                    <p className="text-sm text-gray-600">Update or correct inaccurate information</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Deletion</h4>
                    <p className="text-sm text-gray-600">Request deletion of your account and data</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold">Portability</h4>
                    <p className="text-sm text-gray-600">Export your data in a readable format</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Restriction</h4>
                    <p className="text-sm text-gray-600">Limit how we process your information</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Objection</h4>
                    <p className="text-sm text-gray-600">Object to certain data processing activities</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Retention */}
          <Card>
            <CardHeader>
              <CardTitle>Data Retention</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                We retain your personal information only as long as necessary to provide our services and comply with
                legal obligations:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-pink-500 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-gray-600">
                    <strong>Active accounts:</strong> Data retained while account is active
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-pink-500 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-gray-600">
                    <strong>Deleted accounts:</strong> Most data deleted within 30 days
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-pink-500 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-gray-600">
                    <strong>Legal requirements:</strong> Some data retained for compliance purposes
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-pink-500 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-gray-600">
                    <strong>Anonymized data:</strong> May be retained for research and analytics
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* International Transfers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                International Data Transfers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Our services are global, and your information may be transferred to and processed in countries other
                than your own. We ensure appropriate safeguards are in place for international transfers:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-pink-500 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-gray-600">Adequacy decisions by relevant authorities</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-pink-500 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-gray-600">Standard contractual clauses</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-pink-500 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-gray-600">Binding corporate rules</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card className="bg-gray-900 text-white">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4">Privacy Questions?</h3>
              <p className="mb-4">
                If you have questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="space-y-2 text-sm">
                <p>
                  <strong>Email:</strong> privacy@yourapp.com
                </p>
                <p>
                  <strong>Data Protection Officer:</strong> dpo@yourapp.com
                </p>
                <p>
                  <strong>Address:</strong> [Your Company Address]
                </p>
                <p className="text-gray-300 mt-4">We will respond to your inquiry within 30 days.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
