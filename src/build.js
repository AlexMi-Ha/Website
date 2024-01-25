const fsOld = require('fs');
const fs = require('fs/promises');
const path = require('path');
const { renderPage, loadPosts } = require('./renderer');

async function renderFile(file) {
    const view = file.split('.')[0];
    const html = await renderPage(view);
    await fs.writeFile(`dest/${view}.html`, html);
}

(async () => {
    if(fsOld.existsSync('dest')) {
        await fs.rm('dest', {recursive:true});
    }
    await fs.mkdir('dest')
    const dir = (await fs.readdir('src/views', { withFileTypes: true })).filter(e => e.isFile()).map(e => e.name);
    const promises = []
    for(file of dir) {
        promises.push(renderFile(file));
    }
    promises.push(fs.cp('public/.', 'dest', {recursive:true}));

    await Promise.all(promises)
    console.log("Done building website!\nStarting to build the blog!");
    await buildBlog();
    console.log("Build complete!");
})();

async function buildBlog() {
    const posts = await loadPosts();
    const tags = [...new Set(posts.map(e => e.tags).flat())];

    const postPromises = [];
    await fs.mkdir('dest/posts/topics', {recursive: true});
    for(const tag of tags) {
        postPromises.push(createTopic(posts, tag));
    }
    for(const post of posts) {
        postPromises.push(createPost(post));
    }
    await Promise.all(postPromises);
}

async function createPost(post) {
    const html = await renderPage('blog/post', post);
    await fs.writeFile(`dest/posts/${post.filename}.html`, html);
}

async function createTopic(posts, tag) {
    posts = posts.filter(e => e.tags.includes(tag));

    const html = await renderPage('blog/posts', posts);
    await fs.writeFile(`dest/posts/topics/${tag}.html`, html);
}