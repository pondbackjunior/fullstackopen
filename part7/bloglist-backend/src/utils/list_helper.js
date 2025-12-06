const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  const blogWithMostLikes = blogs.reduce((max, blog) => 
    blog.likes > max.likes ? blog : max
  )
  return blogWithMostLikes
}

const mostBlogs = (blogs) => {
  const counts = blogs.reduce((acc, blog) => {
    acc[blog.author] = (acc[blog.author] || 0) + 1
    return acc
  }, {})

  const [mostCommonAuthor, maxCount] = Object.entries(counts)
    .reduce((max, [author, count]) => (count > max[1] ? [author, count] : max))

  return {author: mostCommonAuthor, blogs: maxCount}
}

const mostLikes = (blogs) => {
  const likes = blogs.reduce((acc, blog) => {
    acc[blog.author] = (acc[blog.author] || 0) + blog.likes
    return acc
  }, {})

  const [topName, totalLikes] = Object.entries(likes)
    .reduce((max, [author, likes]) => (likes > max[1] ? [author, likes] : max))

  return {author: topName, likes: totalLikes}
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}