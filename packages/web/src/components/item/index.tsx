import React from 'react'
import styles from './index.module.css'

type Props = {
  item: {
    id: number
    title: string
    isComplete: boolean
    createdAt: string
  }
}

export const Item: React.FC<Props> = ({ item }) => {
  return <li>{item.title}</li>
}
