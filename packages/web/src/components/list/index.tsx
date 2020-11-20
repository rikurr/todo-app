import React, { ComponentProps } from 'react'
import { Item } from '../item'
import styles from './index.module.css'

type Props = {
  lists: ComponentProps<typeof Item>['item'][]
}

export const List: React.FC<Props> = ({ lists }) => {
  return (
    <ul>
      {lists.map((item) => (
        <Item key={item.id} item={item} />
      ))}
    </ul>
  )
}
