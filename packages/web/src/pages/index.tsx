import { AddTodo } from '@/components/add-todo'
import { NextPage } from 'next'
import Error from 'next/error'
import { useGetTodosQuery } from '../generated/graphql'

const Index: NextPage = () => {
  const { data, loading, error } = useGetTodosQuery()

  if (loading) {
    return <p>...loading</p>
  }

  if (error) {
    return <Error statusCode={404} />
  }

  console.log(data)
  return (
    <>
      <AddTodo />
      <ul>
        {data?.todos.map((todo) => {
          return <li key={todo.id}>{todo.title}</li>
        })}
      </ul>
    </>
  )
}

export default Index
