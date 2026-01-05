import React, { useState, useEffect } from 'react'
import DashboardLayout from '../components/DashboardLayout'
import { dataAPI, jobAPI } from '../services/api'

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null)
  const [customerJobs, setCustomerJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      const response = await dataAPI.getCustomers()
      setCustomers(response.data.data || [])
    } catch (err) {
      console.error('Failed to load customers:', err)
    } finally {
      setLoading(false)
    }
  }

  const viewCustomerDetails = async (customer: any) => {
    setSelectedCustomer(customer)
    try {
      const response = await jobAPI.getJobs({ customer_id: customer.id })
      setCustomerJobs(response.data.data || [])
    } catch (err) {
      console.error('Failed to load customer jobs:', err)
    }
  }

  return (
    <DashboardLayout title="Customer Management">
      {loading ? (
        <div className="text-center py-12"><p className="text-gray-500">Loading...</p></div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-4 border-b"><h3 className="font-bold">All Customers</h3></div>
            <div className="divide-y max-h-[600px] overflow-y-auto">
              {customers.map((customer) => (
                <div key={customer.id} onClick={() => viewCustomerDetails(customer)} className="p-4 hover:bg-gray-50 cursor-pointer">
                  <div className="font-semibold">{customer.organization_name}</div>
                  <div className="text-sm text-gray-600">{customer.organization_type}</div>
                  <div className="text-xs text-gray-500 mt-1">{customer.email}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200">
            {selectedCustomer ? (
              <div>
                <div className="p-4 border-b bg-gray-50">
                  <h3 className="font-bold text-lg">{selectedCustomer.organization_name}</h3>
                  <p className="text-sm text-gray-600">{selectedCustomer.organization_type}</p>
                </div>
                <div className="p-4 space-y-3">
                  <div><span className="font-medium">Contact:</span> {selectedCustomer.first_name} {selectedCustomer.last_name}</div>
                  <div><span className="font-medium">Email:</span> {selectedCustomer.email}</div>
                  <div><span className="font-medium">Phone:</span> {selectedCustomer.phone || 'N/A'}</div>
                  <div><span className="font-medium">Address:</span> {selectedCustomer.address || 'N/A'}</div>
                </div>
                <div className="p-4 border-t">
                  <h4 className="font-bold mb-3">Job History ({customerJobs.length})</h4>
                  <div className="space-y-2">
                    {customerJobs.map((job) => (
                      <div key={job.id} className="p-3 bg-gray-50 rounded">
                        <div className="font-medium">{job.job_number} - {job.title}</div>
                        <div className="text-sm text-gray-600">{job.status_name}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">Select a customer to view details</div>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
