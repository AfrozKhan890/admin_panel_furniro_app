import Link from "next/link";

export default function Unauthorized() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-7xl font-bold">Unauthorized</h1>
        <p className="text-gray-500">You are not authorized to view this page.</p>

        <div className="mt-4 flex gap-5">
            <Link href="https://market-ready-ecommerce-app.vercel.app/" className="text-blue-500 hover:underline">Go back to Furniro</Link>

            <Link href="/sign-in" className="text-blue-500 hover:underline">Sign In</Link>
        </div>
    </div>
  )
}