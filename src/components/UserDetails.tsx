import React from 'react'
import {customers} from '../utils/data'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'

const UserDetails = () => {
   
  return (
    <div className="p-10 w-full">
      <h1 className="text-xl text-gray-400">All Users</h1>
      <Table className="w-full mt-5">
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Total Purchases</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody >
          {customers.map((customer, index) => {
            const totalPurchases = customer.purchaseHistory.reduce(
              (total, purchase) => total + purchase.amount,
              0
            );

            return (
              <TableRow key={customer.id}  className='mt-5'>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.phone}</TableCell>
                <TableCell>{customer.address}</TableCell>
                <TableCell>Rs. {totalPurchases.toLocaleString()}</TableCell>
                <TableCell>
                  <button className="text-blue-500 hover:underline">
                    View
                  </button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  )
}

export default UserDetails