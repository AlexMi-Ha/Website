const fsOld = require('fs');
const fs = require('fs/promises');
const path = require('path');
const { renderPage, loadPosts } = require('./renderer');
const rss = require('feed');

async function renderFile(file) {
    const view = file.split('.')[0];
    const html = await renderPage(view);
    if(view == 'index') {
        await fs.writeFile(`dest/index.html`, html);
    }else {
        await fs.mkdir(`dest/${view}`)
        await fs.writeFile(`dest/${view}/index.html`, html);
    }
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

    await addRobotsTxt();
    console.log("Build complete!");
})();

async function addRobotsTxt() {
    const robots = `User-agent: *
Disallow: `
    await fs.writeFile(`dest/robots.txt`, robots);
}

async function buildBlog() {
    const posts = await loadPosts();
    const tags = [...new Set(posts.map(e => e.tags).flat())].sort();

    const postPromises = [];
    await fs.mkdir('dest/posts/topics', {recursive: true});
    // unfiltered topic
    postPromises.push(createTopic(posts, undefined, tags));
    for(const tag of tags) {
        postPromises.push(createTopic(posts, tag, tags));
    }
    for(const post of posts) {
        postPromises.push(createPost(post));
    }
    await Promise.all(postPromises);
    await buildRSSFeed(posts);
}

async function createPost(post) {
    const html = await renderPage('blog/post', {post:post, meta:post.summary, title: post.title});
    await fs.mkdir(`dest/posts/${post.filename}`)
    await fs.writeFile(`dest/posts/${post.filename}/index.html`, html);
}

async function createTopic(posts, tag, tags) {
    if(tag)
        posts = posts.filter(e => e.tags.includes(tag));
    const topicSummary = 'A collection of my blog posts';
    const html = await renderPage('blog/posts', {posts:posts, allTags: tags, currentTag: tag, meta: topicSummary});
    if(tag) {
        await fs.mkdir(`dest/posts/topics/${tag}`)
        await fs.writeFile(`dest/posts/topics/${tag}/index.html`, html);
    }else {
        await fs.writeFile(`dest/posts/index.html`, html);
    }
}

async function buildRSSFeed(posts) {
    const feed = new rss.Feed({
        title: "AlexMiHa's Blog",
        description: "The RSS Feed focused on the blog content of the alexmiha.de website where I write silly posts.",
        id: "https://alexmiha.de/posts/feed.xml",
        link: "https://alexmiha.de/posts",
        language: "en", // optional, used only in RSS 2.0, possible values: http://www.w3.org/TR/REC-html40/struct/dirlang.html#langcodes
        image: "https://alexmiha.de/images/logo.jpg",
        favicon: "https://alexmiha.de/images/favicon.ico",
        copyright: "Copyright " + posts[0].date.getFullYear() + ", AlexMiHa",
        updated: posts[0].date,
        generator: "awesome", // optional, default = 'Feed for Node.js'
        feedLinks: {
            rss: "https://alexmiha.de/posts/feed.xml",
            json: "https://alexmiha.de/posts/json",
            atom: "https://alexmiha.de/posts/atom",
        },
        author: {
            name: "Alex Hagl",
            email: "alex@alexmiha.de",
            link: "https://alexmiha.de"
        }
    });

    const cleanedPosts = [ ...posts ]
    cleanedPosts.forEach(e => {
        e.htmlContent = replaceAnchorSourcesWithAbsoluteUrls(e.htmlContent, "/posts/"+e.filename)
        e.htmlContent = replaceImageSourcesWithAbsoluteUrls(e.htmlContent, "/posts/"+e.filename)
    });

    cleanedPosts.slice(0, 10).forEach(e => {
        feed.addItem({
            title: e.title,
            id: "https://alexmiha.de/posts/" + e.filename,
            link: "https://alexmiha.de/posts/" + e.filename,
            description: e.summary,
            content: e.htmlContent,
            author: [
            {
                name: "Alex Hagl",
                email: "alex@alexmiha.de",
                link: "https://alexmiha.de"
            }
            ],
            date: e.date,
            image: "https://alexmiha.de/" + e.titleImage,
            category: e.tags.map(tag => {
                return {term: tag}
            }),
            copyright: "Copyright " + posts[0].date.getFullYear() + ", AlexMiHa",
            published: e.date,
        })
    });

    const atom = feed.atom1();
    const json = feed.json1();
    const xmlFeed = feed.rss2();

    await fs.writeFile('dest/posts/feed.xml', xmlFeed);
    await fs.writeFile('dest/posts/atom', atom);
    await fs.writeFile('dest/posts/json', json);
}

function replaceAnchorSourcesWithAbsoluteUrls(html, resourceUrl) {
    return html.replaceAll(/<a ([^>]*)href=(?:"([^"]*)"|'([^']*)')([^>]*)>/gm, (full, pre, val1, val2, post) => {
        const foundVal = val1 ?? val2;
        const stringCharacter = val1 ? '"' : '\'';
        let replaced = "";
        if(isAbsoluteUrl(foundVal)) {
            replaced = `<a ${pre} href=${stringCharacter}https://alexmiha.de${foundVal}${stringCharacter} ${post}>`;
        }else if(isRemoteUrl(foundVal)) {
            return full
        }else if(isHashUrl(foundVal)) {
            return replaced = `<a ${pre} href=${stringCharacter}https://alexmiha.de${resourceUrl}${foundVal}${stringCharacter} ${post}>`;
        }else {
            replaced = `<a ${pre} href=${stringCharacter}https://alexmiha.de${resourceUrl}/${foundVal}${stringCharacter} ${post}>`;
        }

        console.log("Found local url in anchor href! Replacing:\nold:"+full+"\nnew:"+replaced + "\n");
        return replaced;
    })
}

function replaceImageSourcesWithAbsoluteUrls(html, resourceUrl) {
    return html.replaceAll(/<img ([^>]*)src=(?:"([^"]*)"|'([^']*)')([^>]*)>/gm, (full, pre, val1, val2, post) => {
        const foundVal = val1 ?? val2;
        const stringCharacter = val1 ? '"' : '\'';
        let replaced = "";
        if(isAbsoluteUrl(foundVal)) {
            replaced = `<img ${pre} src=${stringCharacter}https://alexmiha.de${foundVal}${stringCharacter} ${post}>`;
        }else if(isRemoteUrl(foundVal)) {
            return full
        }else if(isHashUrl(foundVal)) {
            return replaced = `<img ${pre} src=${stringCharacter}https://alexmiha.de${resourceUrl}${foundVal}${stringCharacter} ${post}>`;
        }else {
            replaced = `<img ${pre} src=${stringCharacter}https://alexmiha.de${resourceUrl}/${foundVal}${stringCharacter} ${post}>`;
        }

        console.log("Found local url in image src! Replacing:\nold:"+full+"\nnew:"+replaced + "\n");
        return replaced;
    })
}

function isAbsoluteUrl(url) {
    return url.startsWith("/");
}

function isRemoteUrl(url) {
    return url.startsWith("http://") || url.startsWith("https://");
}

function isHashUrl(url) {
    return url.startsWith("#");
}