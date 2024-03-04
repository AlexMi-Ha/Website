const parsePost = require('./models/post').parsePost;
const ejs = require('ejs');
const fs = require('fs/promises');

const renderPage = async (view, data) => {
    if(data) {
        return await ejs.renderFile('src/layout/layout.ejs', {
            view: view,
            body: await ejs.renderFile(`src/views/${view}.ejs`, data),
            meta: data.meta ?? '',
            title: data.title
        });
    }
    return await ejs.renderFile('src/layout/layout.ejs', {
        view: view,
        body: await ejs.renderFile(`src/views/${view}.ejs`),
        title: undefined
    });
}

const loadPosts = async () => {
    const posts = await fs.readdir('src/posts');
    const postLoadPromises = [];
    for(file of posts) {
        postLoadPromises.push(fs.readFile('src/posts/' + file));
    }
    const postContents = await Promise.all(postLoadPromises);
    const parsedPosts = [];
    for(let i = 0; i < postContents.length; ++i) {
        parsedPosts.push(parsePost(posts[i].split('.')[0], postContents[i].toString('utf-8')));
    }

    return parsedPosts.sort((a,b) => b.date - a.date);
}

module.exports = {renderPage, loadPosts}