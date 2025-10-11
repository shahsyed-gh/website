import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const SocialSpark = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              SocialSpark
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Automated Social Marketing Platform for Faceless Content
            </p>
          </div>

          <div className="mb-12">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Client Testimonial</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-lg p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xl font-bold">K</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">Kel</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Product Manager</p>
                    </div>
                  </div>
                  <blockquote className="text-gray-700 dark:text-gray-200 italic mb-4">
                    "SocialSpark has been a game-changer for my social media strategy. I started using it when it was just a prototype, and seeing it evolve into a full-fledged product has been incredible. Shah's expertise in setting it up and his ongoing support have been invaluable. The automation has saved me countless hours while maintaining quality content across all my platforms."
                  </blockquote>
                  <div className="aspect-video bg-gray-200 dark:bg-gray-600 rounded-lg overflow-hidden">
                    <iframe
                      className="w-full h-full"
                      src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                      title="Kel's SocialSpark Testimonial"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 text-center">
                    Kel shares his experience with SocialSpark and thanks Shah for the setup assistance
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">🚀</span>
                  </div>
                  Automated Publishing
                </CardTitle>
                <CardDescription>
                  Schedule and publish content across multiple social platforms automatically
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">🎯</span>
                  </div>
                  Faceless Content
                </CardTitle>
                <CardDescription>
                  Create engaging content without showing faces, perfect for privacy-focused brands
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">📊</span>
                  </div>
                  Multi-Client Ready
                </CardTitle>
                <CardDescription>
                  Scalable platform supporting multiple clients with dedicated content streams
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div className="space-y-8">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Platform Overview</CardTitle>
                <CardDescription>
                  SocialSpark is a comprehensive social media automation platform designed to streamline content creation and distribution for modern businesses.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 dark:text-gray-300">
                  Built with scalability in mind, SocialSpark enables businesses to maintain a consistent social media presence without the overhead of manual posting. The platform specializes in faceless content strategies, making it ideal for B2B companies, service providers, and brands that prefer to focus on value rather than personality-driven marketing.
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  The system integrates with major social platforms and provides intelligent scheduling, content optimization, and performance tracking across all connected accounts.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Key Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white">Content Automation</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Automatically generate and schedule posts based on predefined templates and content strategies
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white">Multi-Platform Support</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Seamlessly publish to Twitter, LinkedIn, Instagram, and other major social platforms
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white">Client Management</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Dedicated dashboards and content streams for each client with customizable branding
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white">Analytics & Insights</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Comprehensive reporting and performance metrics to optimize content strategy
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Technical Architecture</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 dark:text-gray-300">
                  SocialSpark is built on a modern, cloud-native architecture that ensures reliability, scalability, and security:
                </p>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white">Backend Infrastructure</h4>
                    <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                      <li>• Zapier Automation</li>
                      <li>• Creatomate </li>
                      <li>• ChatGPT </li>
                      <li>• ElevenLabs</li>
                      <li>• Repurpose.io</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Client Success</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 dark:text-gray-300">
                  SocialSpark currently serves multiple clients across various industries, helping them maintain consistent social media presence while focusing on their core business operations.
                </p>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Results Achieved</h4>
                  <div className="grid gap-2 md:grid-cols-3 text-sm">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">95%</div>
                      <div className="text-gray-600 dark:text-gray-300">Time Saved</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">3x</div>
                      <div className="text-gray-600 dark:text-gray-300">Engagement Increase</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">24/7</div>
                      <div className="text-gray-600 dark:text-gray-300">Automated Publishing</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialSpark;