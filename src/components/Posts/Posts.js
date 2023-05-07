import { useState, useEffect, Fragment } from 'react'
import { getPostsFromApi } from '../../middleware/api'
import './Posts.css'

export default function Posts() {
  const [data, setData] = useState([])
  const [errors, setErrors] = useState(null)
  const [timer, setTimer] = useState(null)

  useEffect(() => {
    getPosts()
  }, [])

  const getPosts = async () => {
    try {
      const posts = await getPostsFromApi()
      setData(() => posts)
    } catch (e) {
      setErrors(JSON.stringify(e))
    }
  }

  const filterData = (e) => {
    clearTimeout(timer)
    if (e.target.value) {
      const newTimer = setTimeout(() => {
        const newData = data?.filter(
          (post) =>
            post.title.toLowerCase().includes(e.target.value) ||
            post.body.toLowerCase().includes(e.target.value)
        )
        setData(newData)
      }, 500)
      setTimer(newTimer)
    } else {
      const newTimer = setTimeout(() => {
        getPosts()
      }, 500)
      setTimer(newTimer)
    }
  }

  return (
    <Fragment>
      {errors ? (
        <div className="center">
          <h2>{`Error`}</h2>
        </div>
      ) : (
        <div>
          <div className="search">
            <input
              type="text"
              placeholder="Type to search"
              onChange={filterData}
            ></input>
          </div>
          {data?.length > 0 ? (
            <div className="items">
              {data?.map((post, i) => {
                return (
                  <ul key={i}>
                    <li>
                      <h2>{post?.title}</h2>
                      <p>{post?.body}</p>
                    </li>
                  </ul>
                )
              })}
            </div>
          ) : data?.length === 0 ? (
            <div className="center">
              <p>No results found</p>
            </div>
          ) : (
            <></>
          )}
        </div>
      )}
    </Fragment>
  )
}
