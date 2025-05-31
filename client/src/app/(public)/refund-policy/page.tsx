import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Clock, CreditCard } from "lucide-react";

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            Legal
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Refund Policy
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Our commitment to fair and transparent refund practices for all
            subscription services.
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Last updated: January 1, 2024
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Refund Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                We want you to be completely satisfied with our service. This
                refund policy outlines the circumstances under which refunds may
                be issued for premium subscriptions and additional features
                purchased through our dating platform.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-900">Important Note</p>
                    <p className="text-blue-800 text-sm">
                      All refund requests must be submitted within the specified
                      timeframes outlined below.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subscription Refunds */}
          <Card>
            <CardHeader>
              <CardTitle>Premium Subscription Refunds</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-2">
                    7-Day Money-Back Guarantee
                  </h4>
                  <p className="text-gray-600 mb-2">
                    New premium subscribers are eligible for a full refund
                    within 7 days of their initial purchase, provided they have
                    not extensively used premium features.
                  </p>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    <li>Must be a first-time premium subscriber</li>
                    <li>Request must be made within 7 days of purchase</li>
                    <li>
                      Limited usage of premium features (fewer than 10 premium
                      actions)
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Monthly Subscriptions</h4>
                  <p className="text-gray-600">
                    Monthly subscriptions may be eligible for prorated refunds
                    in cases of technical issues, billing errors, or exceptional
                    circumstances. Refunds are not typically provided for change
                    of mind or lack of matches.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Annual Subscriptions</h4>
                  <p className="text-gray-600">
                    Annual subscriptions may be eligible for prorated refunds
                    within the first 30 days, minus any premium features already
                    used. After 30 days, refunds are only considered for
                    technical issues or billing errors.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Non-Refundable Items */}
          <Card>
            <CardHeader>
              <CardTitle>Non-Refundable Items</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                The following items are generally not eligible for refunds:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>
                  Super likes, boosts, and other consumable premium features
                  once used
                </li>
                <li>
                  Subscription renewals (automatic renewals can be cancelled for
                  future billing cycles)
                </li>
                <li>
                  Subscriptions cancelled after the applicable refund period
                </li>
                <li>
                  Accounts suspended or terminated for violating our Terms of
                  Service
                </li>
                <li>
                  Partial months of service (except in cases of billing errors)
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Refund Process */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                How to Request a Refund
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">
                    Step 1: Contact Support
                  </h4>
                  <p className="text-gray-600">
                    Email our support team at refunds@yourapp.com with your
                    refund request. Include your account email, reason for
                    refund, and any relevant details.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">
                    Step 2: Provide Information
                  </h4>
                  <p className="text-gray-600">
                    Our team may request additional information to process your
                    refund, including transaction details and account
                    verification.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">
                    Step 3: Processing Time
                  </h4>
                  <p className="text-gray-600">
                    Approved refunds are typically processed within 5-10
                    business days. The refund will appear on your original
                    payment method within 1-2 billing cycles.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Special Circumstances */}
          <Card>
            <CardHeader>
              <CardTitle>Special Circumstances</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Technical Issues</h4>
                  <p className="text-gray-600">
                    If you experience significant technical problems that
                    prevent you from using our service, you may be eligible for
                    a refund or service credit regardless of the standard refund
                    timeframes.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Billing Errors</h4>
                  <p className="text-gray-600">
                    Unauthorized charges or billing errors will be investigated
                    and refunded promptly upon verification.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Account Suspension</h4>
                  <p className="text-gray-600">
                    Users whose accounts are suspended or terminated for
                    violating our Terms of Service are not eligible for refunds
                    of any kind.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="bg-gray-900 text-white">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4">
                Questions About Refunds?
              </h3>
              <p className="mb-4">
                Our customer support team is here to help with any questions
                about our refund policy.
              </p>
              <div className="space-y-2 text-sm">
                <p>
                  <strong>Email:</strong> refunds@yourapp.com
                </p>
                <p>
                  <strong>Response Time:</strong> Within 24-48 hours
                </p>
                <p>
                  <strong>Phone:</strong> Available for premium subscribers
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
