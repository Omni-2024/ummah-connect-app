// "use client"

// import { useEffect, useState } from "react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/base/card"
// import Button from "@/components/base/button"
// import { getPayments, type Payment } from "@/lib/endpoints/paymentFns"
// import { getAllGeneralProvidersFn } from "@/lib/endpoints/providersFns"
// import { getAllServicesFn, type Service } from "@/lib/endpoints/serviceFns"
// import { getAllGeneralUsersFn, type UserData } from "@/lib/endpoints/usersFns"
// import { Avatar, AvatarFallback } from "@/components/base/avatar"
// import { Badge } from "@/components/base/badge"
// import { Calendar } from "lucide-react"
// import dayjs from "dayjs"
// import ProviderPaymentsSkeleton from "../skeleton/ProviderCardSkeleton"

// export default function ProviderPayments() {
//   const [payments, setPayments] = useState<Payment[]>([])
//   const [providers, setProviders] = useState<UserData[]>([])
//   const [users, setUsers] = useState<UserData[]>([])
//   const [services, setServices] = useState<Service[]>([])
//   const [loading, setLoading] = useState(true)
//   const [visibleCount, setVisibleCount] = useState(20)
//   const [selectedProviderId, setSelectedProviderId] = useState<string>("")

//   useEffect(() => {
//     async function fetchData() {
//       try {
//         // Fetch providers
//         const providersRes = await getAllGeneralProvidersFn({ limit: 100, offset: 0 })
//         const fetchedProviders = providersRes.data ?? []
//         setProviders(fetchedProviders)

//         // Fetch users (payers)
//         const usersRes = await getAllGeneralUsersFn({ limit: 500, offset: 0 })
//         const fetchedUsers = usersRes.data ?? []
//         setUsers(fetchedUsers)

//         // Fetch services
//         const servicesRes = await getAllServicesFn({ limit: 500, offset: 0 })
//         const fetchedServices = servicesRes.data ?? []
//         setServices(fetchedServices)

//         // Fetch payments
//         const paymentsRes = await getPayments({ limit: 500, offset: 0 })
//         setPayments(paymentsRes.data?.data ?? [])

//         // Set default selected provider
//         if (fetchedProviders.length > 0) setSelectedProviderId(fetchedProviders[0].id)
//       } catch (err) {
//         console.error("❌ Failed to load data", err)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchData()
//   }, [])

//   // Map serviceId -> providerId
//   const serviceToProviderMap = services.reduce<Record<string, string>>((acc, service) => {
//     acc[service.id] = service.providerId
//     return acc
//   }, {})

//   // Filter payments based on provider
//   const filteredPayments = payments.filter(
//     p => serviceToProviderMap[p.serviceId] === selectedProviderId
//   )

//   const getReceiveStatusColor = (status: string) => {
//     switch (status) {
//       case "succeeded":
//         return "bg-green-100 text-green-800"
//       case "failed":
//         return "bg-red-100 text-red-800"
//       default:
//         return "bg-yellow-100 text-yellow-800"
//     }
//   }

//   return (
//     <div className="space-y-4">
//       {loading ? (
//         <ProviderPaymentsSkeleton count={3} />
//       ) : (
//         <>
//           {/* Provider Filter Dropdown */}
//           <div className="mb-4">
//             <label className="mr-2 font-semibold text-primary">Filter by Provider:</label>
//             <select
//               className="border rounded px-2 py-1"
//               value={selectedProviderId}
//               onChange={e => setSelectedProviderId(e.target.value)}
//             >
//               {providers.map(pr => (
//                 <option key={pr.id} value={pr.id}>
//                   {pr.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div
//             className="grid gap-4"
//             style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}
//           >
//             {filteredPayments.slice(0, visibleCount).map(p => {
//               const service = services.find(s => s.id === p.serviceId)
//               const provider = providers.find(pr => pr.id === service?.providerId)
//               const payer = users.find(u => u.id === p.userId)

//               const providerName = provider?.name ?? "Unknown Provider"
//               const payerName = payer?.name ?? "Unknown User"

//               return (
//                 <Card
//                   key={p.paymentIntent}
//                   className="border-primary-100 hover:border-primary/30 bg-white rounded-xl flex flex-col justify-between"
//                 >
//                   <CardHeader className="flex flex-row items-start justify-between pb-3 border-b border-primary-100">
//                     <div className="flex items-start gap-3 w-full">
//                       <Avatar>
//                         {payer?.profileImage ? (
//                           <img
//                             src={payer.profileImage}
//                             alt={payerName}
//                             className="object-cover w-full h-full"
//                           />
//                         ) : (
//                           <AvatarFallback>{payerName[0]?.toUpperCase()}</AvatarFallback>
//                         )}
//                       </Avatar>

//                       <div className="flex flex-col flex-1">
//                         <CardTitle className="text-md font-bold text-primary leading-snug">
//                           {p.serviceName}
//                         </CardTitle>

//                         {/* Show payer name */}
//                         <p className="text-sm mt-1 text-primary-700 bg-primary-50 px-2 py-1 rounded-full border w-fit">
//                           {payerName}
//                         </p>
//                       </div>
//                     </div>

//                     <Badge className={getReceiveStatusColor(p.status)}>
//                       {p.status === "succeeded"
//                         ? "Succeeded"
//                         : p.status === "failed"
//                         ? "Failed"
//                         : "Pending"}
//                     </Badge>
//                   </CardHeader>

//                   <CardContent className="pt-4 space-y-3">
//                     <div className="flex justify-between text-sm">
//                       <span className="text-muted-foreground">Paid to Provider</span>
//                       <span className="font-semibold text-lg">
//                         ${(p.provider_amount ?? p.amount_gross ?? p.amount).toFixed(2)}
//                       </span>
//                     </div>

//                     <div className="flex justify-between text-sm">
//                       <span className="text-muted-foreground">Commission Fee</span>
//                       <span className="font-semibold text-lg">
//                         ${(p.platform_fee_amount ?? 0).toFixed(2)}
//                       </span>
//                     </div>

//                     <div className="flex justify-between text-sm">
//                       <span className="text-muted-foreground">Gross Amount</span>
//                       <span className="font-semibold text-lg">
//                         ${(p.amount_gross ?? p.amount).toFixed(2)}
//                       </span>
//                     </div>

//                     <div className="flex justify-between text-sm">
//                       <span className="text-muted-foreground">Paid Date</span>
//                       <span className="flex items-center gap-1 font-semibold text-sm">
//                         <Calendar className="w-4 h-4" />
//                         {dayjs(p.updatedAt).format("MMM D, YYYY")}
//                       </span>
//                     </div>
//                   </CardContent>
//                 </Card>
//               )
//             })}
//           </div>

//           {!loading && visibleCount < filteredPayments.length && (
//             <Button
//               onClick={() => setVisibleCount(v => v + 20)}
//               className="mt-4 w-full"
//             >
//               Load More
//             </Button>
//           )}
//         </>
//       )}
//     </div>
//   )
// }

//ProviderPayments ONLY ADMIN VIEW

