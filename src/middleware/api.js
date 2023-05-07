export const getPostsFromApi = async () => {
  const resp = await fetch('https://jsonplaceholder.typicode.com/posts')
  return resp.json()
}
