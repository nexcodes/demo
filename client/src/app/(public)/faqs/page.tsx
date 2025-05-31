import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import Link from "next/link";

export default function FAQsPage() {
  const faqs = [
    {
      question: "How does phone verification work?",
      answer:
        "We send a verification code to your phone number via SMS. This ensures all users are real people and helps maintain a safe community. Your phone number is kept private and secure.",
    },
    {
      question: "What information do I need to include in my profile?",
      answer:
        "You'll add photos, basic information (name, age, location), what you're looking for (casual fun, serious relationship, or marriage), physical attributes, education, work, lifestyle choices, interests, and personality traits. You can also specify deal breakers and preferences.",
    },
    {
      question: "How does the matching algorithm work?",
      answer:
        "Our algorithm considers your dating preferences, deal breakers, lifestyle choices, interests, and location to suggest compatible matches. The more complete your profile, the better your matches will be.",
    },
    {
      question: "Is my personal information safe?",
      answer:
        "Yes, we take privacy seriously. Your personal information is encrypted and stored securely. We never share your data with third parties without your consent. You control what information is visible on your profile.",
    },
    {
      question: "Can I change my dating preferences later?",
      answer:
        "You can update your preferences, deal breakers, and what you're looking for at any time in your profile settings. This will affect future matches.",
    },
    {
      question: "How do I report inappropriate behavior?",
      answer:
        "You can report any user by going to their profile and selecting 'Report User.' We take all reports seriously and investigate them promptly. Users who violate our community guidelines may be banned.",
    },
    {
      question: "What if I want to delete my account?",
      answer:
        "You can delete your account at any time from your settings. This will permanently remove your profile and all associated data. This action cannot be undone.",
    },
    {
      question: "How do I contact customer support?",
      answer:
        "You can reach our support team through the contact form on our website or by emailing support@yourapp.com. We typically respond within 24 hours.",
    },
    {
      question: "Are there any age restrictions?",
      answer:
        "Yes, you must be at least 18 years old to use our platform. We verify age during the registration process to ensure compliance with legal requirements.",
    },
    {
      question: "Can I use the app without uploading photos?",
      answer:
        "While photos aren't technically required, profiles with photos receive significantly more matches and engagement. We highly recommend adding at least one clear photo of yourself.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {`Find answers to common questions about our dating platform. Can't
            find what you're looking for? Contact our support team.`}
          </p>
        </div>

        {/* FAQs */}
        <div className="max-w-4xl mx-auto mb-12">
          <Card>
            <CardContent className="p-6">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>

        {/* Contact Support */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-6 h-6 text-pink-600" />
              </div>
              <CardTitle>Still have questions?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                {`Our support team is here to help. Get in touch and we'll respond
                as soon as possible.`}
              </p>
              <Button asChild>
                <Link href="/contact">Contact Support</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
