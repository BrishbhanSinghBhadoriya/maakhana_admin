export type Product = Root2[]

export interface Root2 {
  _id: Id
  subscriptionTypes: SubscriptionType[]
  menus?: Menus
  breakfast: Breakfast
  lunch: Lunch
  dinner: Dinner2
  gymBroPack: GymBroPack
  pricing: Pricing
  image?: string
}

export interface Id {
  $oid: string
}

export interface SubscriptionType {
  id: string
  name: string
  description: string
  dailyCostRange: DailyCostRange
  nonVegDetails?: NonVegDetails
  proteinTarget?: string
  image?: string
}

export interface DailyCostRange {
  min: number
  max: number
  currency: string
}

export interface NonVegDetails {
  days: string[]
  chickenPortion: ChickenPortion
  weeklyIncrementalCost: WeeklyIncrementalCost
}

export interface ChickenPortion {
  raw: string
  cooked: string
}

export interface WeeklyIncrementalCost {
  min: number
  max: number
  currency: string
}

export interface Menus {
  breakfast: Breakfast
  lunch: Lunch
  dinner: Dinner2
}

export interface Breakfast {
  averageCostRange: AverageCostRange
  items: Items
}

export interface AverageCostRange {
  min: number
  max: number
  currency: string
}

export interface Items {
  monday: Monday
  tuesday: Tuesday
  wednesday: Wednesday
  thursday: Thursday
  friday: Friday
  saturday: Saturday
  sunday: Sunday
}

export interface Monday {
  name: string
  quantity: string
  sides: string[]
}

export interface Tuesday {
  name: string
  quantity: string
  style: string
}

export interface Wednesday {
  name: string
  quantity: string
  sides: string[]
}

export interface Thursday {
  name: string
  quantity: string
  style: string
  sides: string[]
}

export interface Friday {
  name: string
  quantity: string
  style: string
  sides: string[]
}

export interface Saturday {
  name: string
  quantity: string
  sides: string[]
}

export interface Sunday {
  name: string
  sides: string[]
}

export interface Lunch {
  averageCostRange: AverageCostRange2
  items: Items2
  nonVegOptions: NonVegOptions
}

export interface AverageCostRange2 {
  min: number
  max: number
  currency: string
}

export interface Items2 {
  monday: Monday2
  tuesday: Tuesday2
  wednesday: Wednesday2
  thursday: Thursday2
  friday: Friday2
  saturday: Saturday2
  sunday: Sunday2
}

export interface Monday2 {
  main: string
  vegetables: string[]
  carbs: string[]
  extras: string[]
}

export interface Tuesday2 {
  main: string
  vegetables: string[]
  carbs: string[]
}

export interface Wednesday2 {
  main: string
  vegetables: string[]
  carbs: string[]
}

export interface Thursday2 {
  main: string
  vegetables: string[]
  carbs: string[]
}

export interface Friday2 {
  main: string
  vegetables: string[]
  carbs: string[]
}

export interface Saturday2 {
  main: string
  vegetables: string[]
  carbs: string[]
}

export interface Sunday2 {
  main: string
  sides: string[]
}

export interface NonVegOptions {
  wednesday: Wednesday3
  sunday: Sunday3
}

export interface Wednesday3 {
  dinner: Dinner
}

export interface Dinner {
  main: string
  carbs: string[]
}

export interface Sunday3 {
  lunch: Lunch2
}

export interface Lunch2 {
  main: string
  carbs: string[]
  sides: string[]
}

export interface Dinner2 {
  averageCostRange: AverageCostRange3
  items: Items3
}

export interface AverageCostRange3 {
  min: number
  max: number
  currency: string
}

export interface Items3 {
  monday: Monday3
  tuesday: Tuesday3
  wednesday: Wednesday4
  thursday: Thursday3
  friday: Friday3
  saturday: Saturday3
  sunday: Sunday4
}

export interface Monday3 {
  main: string
  carbs: string[]
  vegetables: string[]
  dal: string[]
}

export interface Tuesday3 {
  main: string
  carbs: string[]
  extras: string[]
}

export interface Wednesday4 {
  carbs: string[]
  main: string
  dal: string[]
}

export interface Thursday3 {
  carbs: string[]
  main: string
  vegetables: string[]
}

export interface Friday3 {
  carbs: string[]
  main: string
  quantity: string
  sides: string[]
}

export interface Saturday3 {
  main: string
  portion: string
  sides: string[]
}

export interface Sunday4 {
  carbs: string[]
  main: string
  dal: string[]
}

export interface GymBroPack {
  breakfast: Breakfast2
  lunch: Lunch3
  dinner: Dinner3
  customization: Customization
}

export interface Breakfast2 {
  protein: string
  carbs: string[]
}

export interface Lunch3 {
  veg: Veg
  nonVeg: NonVeg
}

export interface Veg {
  main: string
  protein: string[]
  carbs: string[]
}

export interface NonVeg {
  main: string
  quantity: string
  sides: string[]
}

export interface Dinner3 {
  protein: string[]
  carbs: string[]
  vegetables: string[]
}

export interface Customization {
  frequency: string
  options: Option[]
}

export interface Option {
  type: string
  options: string[]
  meal?: string
  meals?: string[]
}

export interface Pricing {
  summary: Summary[]
}

export interface Summary {
  plan: string
  dailyCost: string
}
