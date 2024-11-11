const dummy = (blogs) => {
    return 1;
}

const totalLikes = (blogs) => {
    return blogs.reduce((sum, post) => sum + post.likes, 0)
}

const favoriteBlog = (blogs) => {
    return blogs.reduce((favorite, post) => {
        return post.likes > favorite.likes 
            ? { "title": post.title, "author": post.author, "likes": post.likes }
            : { "title": favorite.title, "author": favorite.author, "likes": favorite.likes };
    }, blogs[0]);
}

module.exports ={dummy, totalLikes, favoriteBlog}