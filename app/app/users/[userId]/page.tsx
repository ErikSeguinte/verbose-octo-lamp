import React from 'react'

const page = ({params}: {params: {userId: string}}) => {
  return (
    <div className="prose">
    <h1 className=''>Current User: {params.userId}</h1>
    </div>
  )
}

export default page