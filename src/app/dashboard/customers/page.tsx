
import { Suspense } from "react"
import { fetchCustomers } from "@/lib/api"
import DashboardShell from "@/components/dashboard/DashboardShell"
import { CustomerList } from "@/components/dashboard/customers/CustomerList"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"



export const metadata = {
  title: "Customer Management",
  description: "Manage your e-commerce customers",
}

export default async function CustomersPage() {
  const customers = await fetchCustomers()

  return (
    <DashboardShell>
      <DashboardHeader />
      <Suspense fallback={<div>Loading...</div>}>
        <CustomerList initialCustomers={customers} />
      </Suspense>
    </DashboardShell>
  )
}
