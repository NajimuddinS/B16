"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <Users className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold text-gray-900">EmpManage</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link href="/" className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
              Home
            </Link>
            <Link
              href="#features"
              className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
            >
              Features
            </Link>
            <Link href="#about" className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
              About
            </Link>
            <Link href="/login">
              <Button variant="default" className="ml-4">
                Login
              </Button>
            </Link>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/"
              className="text-gray-700 hover:text-primary block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="#features"
              className="text-gray-700 hover:text-primary block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              href="#about"
              className="text-gray-700 hover:text-primary block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link href="/login" onClick={() => setIsMenuOpen(false)}>
              <Button variant="default" className="w-full mt-2">
                Login
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}

