import { roundNumber } from '@/lib/utils'
import React from 'react'

type Props ={
    value: number | string | null,
    label: string
}

const MetricCard = (props: Props) => {
    const {value, label} = props
  return (
    <div className='p-6 border rounded-md'>
        <p>{label}</p>
        <p className='text-2xl font-bold mt-2'>{roundNumber(value)}</p>
    </div>
  )
}

export default MetricCard