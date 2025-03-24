import { Users } from "lucide-react"
import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center">
              <Users className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold">EmpManage</span>
            </div>
            <p className="mt-2 text-sm text-gray-300">Streamlining employee management for businesses of all sizes.</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">Quick Links</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link href="/" className="text-base text-gray-300 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link href="#features" className="text-base text-gray-300 hover:text-white">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#about" className="text-base text-gray-300 hover:text-white">
                  About
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-base text-gray-300 hover:text-white">
                  Login
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">Contact</h3>
            <ul className="mt-4 space-y-4">
              <li className="text-base text-gray-300">Email: info@empmanage.com</li>
              <li className="text-base text-gray-300">Phone: +1 (555) 123-4567</li>
              <li className="text-base text-gray-300">Address: 123 Business St, Suite 100, City, State 12345</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-700 pt-8 md:flex md:items-center md:justify-between">
          <div className="flex space-x-6 md:order-2">{/* Social media links would go here */}</div>
          <p className="mt-8 text-base text-gray-400 md:mt-0 md:order-1">
            &copy; {new Date().getFullYear()} EmpManage. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

