import React from 'react'
import styles from './index.module.css'
import { useAddTodoMutation } from '@/generated/graphql'

export const AddTodo: React.FC = () => {
  const [title, settitle] = React.useState('')
  const [disabled, setDisabled] = React.useState(false)
  const [mutation] = useAddTodoMutation()

  const handleChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      settitle(event.target.value)
    },
    [],
  )

  const handleSubmit = React.useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      if (title.length < 3) {
        return
      }
      setDisabled(true)
      const { data } = await mutation({
        variables: {
          title: title,
        },
      })

      if (data) {
        console.log(data)
        settitle('')
        setDisabled(false)
      } else {
        console.log("Can't add todo")
      }
    },
    [mutation, title],
  )
  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={title} onChange={handleChange} />
      <button type="submit" disabled={disabled}>
        Add
      </button>
    </form>
  )
}
