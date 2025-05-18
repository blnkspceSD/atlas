import Link from 'next/link'
import Image from 'next/image'

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-primary text-2xl font-bold">atlas.</div>
          <div className="flex gap-3">
            <Link
              href="/signin"
              className="px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
            >
              Register
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-16 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Find your dream remote job, <span className="text-primary">without the hassle</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Atlas connects top talent with top-tier remote positions. Say goodbye to endless searching and hello to your perfect career match.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/jobs"
                className="inline-block bg-black text-white px-8 py-4 rounded-lg font-medium hover:bg-gray-800"
              >
                Find Jobs
              </Link>
              <Link
                href="/signup"
                className="inline-block bg-white border border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-medium hover:bg-gray-50"
              >
                Create Account
              </Link>
            </div>
            <div className="mt-8 flex items-center text-gray-500">
              <p className="text-sm mr-4">Trusted by professionals from:</p>
              <div className="flex space-x-4">
                <div className="w-8 h-8 grayscale opacity-70">
                  <Image
                    src="/logos/netflix.svg"
                    alt="Netflix"
                    width={32}
                    height={32}
                    className="rounded"
                  />
                </div>
                <div className="w-8 h-8 grayscale opacity-70">
                  <Image
                    src="/logos/airbnb.svg"
                    alt="Airbnb"
                    width={32}
                    height={32}
                    className="rounded"
                  />
                </div>
                <div className="w-8 h-8 grayscale opacity-70">
                  <Image
                    src="/logos/meta.svg"
                    alt="Meta"
                    width={32}
                    height={32}
                    className="rounded"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="relative rounded-lg overflow-hidden shadow-xl">
            <Image
              src="/images/remote-work.jpg"
              alt="Remote work lifestyle"
              width={600}
              height={400}
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Why job seekers choose Atlas</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-primary/10 flex items-center justify-center rounded-full mb-6">
                <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none">
                  <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" />
                  <path d="M12 7V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Time-saving job search</h3>
              <p className="text-gray-600">
                Our advanced filters help you find exactly what you're looking for in seconds, not hours. Stop wasting time on irrelevant listings.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-primary/10 flex items-center justify-center rounded-full mb-6">
                <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none">
                  <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Quality remote positions</h3>
              <p className="text-gray-600">
                Every listing is vetted for legitimacy and competitive compensation. We only show you jobs worth your talents and expertise.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-primary/10 flex items-center justify-center rounded-full mb-6">
                <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none">
                  <path d="M12 16V12M12 8H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Complete transparency</h3>
              <p className="text-gray-600">
                See salary ranges and benefits upfront – no more guessing games. Know exactly what to expect before you apply.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Success stories from our community</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden mr-4">
                  <Image 
                    src="https://i.pravatar.cc/100?img=1" 
                    alt="User avatar" 
                    width={48} 
                    height={48}
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-medium">Sarah Johnson</h4>
                  <p className="text-sm text-gray-500">Product Designer</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "Atlas helped me find a remote position that perfectly matched my skills and salary expectations. Within two weeks, I had multiple offers to choose from!"
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden mr-4">
                  <Image 
                    src="https://i.pravatar.cc/100?img=12" 
                    alt="User avatar" 
                    width={48} 
                    height={48}
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-medium">James Rodriguez</h4>
                  <p className="text-sm text-gray-500">Senior Developer</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "After years of commuting, I found my ideal remote job through Atlas. The salary transparency was refreshing and saved me so much time in my search."
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden mr-4">
                  <Image 
                    src="https://i.pravatar.cc/100?img=5" 
                    alt="User avatar" 
                    width={48} 
                    height={48}
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-medium">Emily Chen</h4>
                  <p className="text-sm text-gray-500">Marketing Manager</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "Atlas didn't just help me find a job, it helped me find work-life balance. Now I have a fulfilling career I can do from anywhere in the world."
              </p>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <Link
              href="/signup"
              className="inline-block bg-black text-white px-8 py-4 rounded-lg font-medium hover:bg-gray-800"
            >
              Join Atlas Today
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to transform your career?</h2>
          <p className="text-white/80 text-xl max-w-2xl mx-auto mb-8">
            Join thousands of professionals who've found their dream remote jobs through Atlas. Your next opportunity is just a click away.
          </p>
          <Link
            href="/signup"
            className="inline-block bg-white text-primary px-8 py-4 rounded-lg font-medium hover:bg-gray-100"
          >
            Get Started — It's Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold mb-4">atlas.</div>
              <p className="text-gray-400">Connecting talent with opportunity in the remote work revolution.</p>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">For Job Seekers</h4>
              <ul className="space-y-2">
                <li><Link href="/jobs" className="text-gray-400 hover:text-white">Browse Jobs</Link></li>
                <li><Link href="/saved" className="text-gray-400 hover:text-white">Saved Jobs</Link></li>
                <li><Link href="/profile" className="text-gray-400 hover:text-white">Profile</Link></li>
                <li><Link href="/applications" className="text-gray-400 hover:text-white">Applications</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><Link href="/blog" className="text-gray-400 hover:text-white">Blog</Link></li>
                <li><Link href="/guides" className="text-gray-400 hover:text-white">Remote Work Guides</Link></li>
                <li><Link href="/salary" className="text-gray-400 hover:text-white">Salary Tool</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">Company</h4>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
                <li><Link href="/privacy" className="text-gray-400 hover:text-white">Privacy</Link></li>
                <li><Link href="/terms" className="text-gray-400 hover:text-white">Terms</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© 2023 Atlas. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
} 