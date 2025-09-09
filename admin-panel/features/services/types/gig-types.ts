export interface CreateServiceFnArgs {
  title: string
  tagline: string
  description: string
  cmePoints: number
  coverImageUrl: string
  providerId: string
  price: number
  cmeId: string | null
  specialtyId?: string | null
  professionId: string
  learningPoints: string[]
  discount: number
  discountEnabled: boolean
}
