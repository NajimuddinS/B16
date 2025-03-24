import { Users, Calendar, ClipboardList, UserCheck, Shield, BarChart2 } from "lucide-react"

export default function FeatureSection() {
  const features = [
    {
      name: "Employee Management",
      description: "Easily manage employee profiles, departments, and roles.",
      icon: Users,
    },
    {
      name: "Leave Management",
      description: "Streamlined process for requesting and approving leave.",
      icon: Calendar,
    },
    {
      name: "HR Dashboard",
      description: "Comprehensive dashboard for HR personnel to manage operations.",
      icon: ClipboardList,
    },
    {
      name: "Role-Based Access",
      description: "Secure access controls based on employee roles.",
      icon: Shield,
    },
    {
      name: "Profile Management",
      description: "Allow employees to manage their profiles and information.",
      icon: UserCheck,
    },
    {
      name: "Reporting",
      description: "Generate reports on employee data and leave statistics.",
      icon: BarChart2,
    },
  ]

  return (
    <div id="features" className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Features</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to manage your team
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Our employee management system provides all the tools you need to efficiently manage your workforce.
          </p>
        </div>

        <div className="mt-10">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="pt-6">
                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8 h-full">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-primary rounded-md shadow-lg">
                        <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">{feature.name}</h3>
                    <p className="mt-5 text-base text-gray-500">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

