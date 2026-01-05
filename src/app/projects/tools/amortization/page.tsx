import { type Metadata } from 'next'

import { SimpleLayout } from '@/components/SimpleLayout'
import { Card } from '@/components/Card'
import Calculator from './calculator'

export const metadata: Metadata = {
  title: 'Amortization Calculator',
  description: 'An amortization calculator. Use this to calculate your expected monthly payment, view an amortization calendar, and see how applying extra monthly payments can affect your payoff time.',
}

export default function Projects() {
  return (
    <SimpleLayout
      title="Amortization Calculator"
      intro="An amortization calculator. Use this to calculate your expected monthly payment, view an amortization calendar, and see how applying extra monthly payments can affect your payoff time."
    >
      <Calculator />
    </SimpleLayout>
  )
}
