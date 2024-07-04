---
Id: 1
Title: I wrote my own blogging software, and why you should not!
Summary: In this post I will talk about my journey and the hurdles I've had while creating my very own blogging software.
TitleImage: /images/posts/8c8df23c-d702-43ed-b49a-e3597a085464.jpg
Date: 03.03.2024
Tags: Programming, Tech
---

> "_QWERTYUIOP._"

 ~ Ray Tomlinson - The first email message ever sent (probably)

Hello there,

I've finally gotten around to writing the first blogpost on my website. Finally getting a use out of the blogging software I wrote exactly for this purpose 🥳.

In this post I will tell you something about **my journey** of writing this piece of software and my **hurdles** along the way! 👀

## Static sites for the win
I thought long about what tech stack to use for this project.

> _Do I want the maintainability of a full cms?_ ⚙
>
> _Where do I want to host this?_ 💻
>
> _How complex do I want it to get?_ 🤯
>
> _What will I learn from this?_ 🧠

Creating a full content management system is not easy. You have to manage your database, have a seperate backend running to access it, of course you need the frontend...

That is a **big** hassle!

I always gravitated towards the simplicity of static websites. Why should I build a complex infrastructure where none is needed?

With static html, css and javascript you do not have the problem of updating dependencies, relying on a framework like angular or react and so on. 🗽

I know as software engineers we always try to use the newest and fanciest framework or library, but at what cost? You lose control over your DOM and have an absolute overkill of a project!

But I didn't want to give away the power of a templating engine! The one **major** drawback of static sites is **code duplication**! You have to repeat your main layout in each and every file!

So I saw the requirements and compromised to use a simple templating engine. 

I used a simple `express.js` server to dynamically serve my content with the `EJS` templating engine to build the view.

_But didn't I want an easy deployment? Now I have to run a webserver all over again!_ 🤐

Using a templating engine is beneficial in development but loses its use case for static websites after deploying. Thats why I decided to **compile** my express application to static html in the deployment step!

For this I first needed the main render function for a specific EJS view 🚀


```js
const renderPage = async (view, data) => {
    return await ejs.renderFile('src/layout/layout.ejs', {
        view: view,
        body: await ejs.renderFile(`src/views/${view}.ejs`, data)
    });
}
```


With this function I just need to search the views folder, render all the files and save it in the ouput folder!


```js
async function buildBlog() {
    const posts = await loadPosts();
    const tags = getUniqueTags(posts);

    const postPromises = [];
    await fs.mkdir('dest/posts/topics', {recursive: true});
    postPromises.push(createTopic(posts, NO_FILTER, tags));
    for(const tag of tags) {
        postPromises.push(createTopic(posts, tag, tags));
    }
    for(const post of posts) {
        postPromises.push(createPost(post));
    }
    await Promise.all(postPromises);
}
```


This function retrieves all files from the posts folder and builds the filtered topic overview pages and the post pages itself. ⚙


```js
async function createPost(post) {
    const html = await renderPage('blog/post', {post:post});
    await fs.writeFile(`dest/posts/${post.filename}.html`, html);
}

async function createTopic(posts, tag, tags) {
    if(tag)
        posts = posts.filter(e => e.tags.includes(tag));

    const html = await renderPage('blog/posts', {posts:posts, allTags: tags, currentTag: tag});
    if(tag) {
        await fs.writeFile(`dest/posts/topics/${tag}.html`, html);
    } else {
        await fs.writeFile(`dest/posts/index.html`, html);
    }
}
```


Finally the pages can be rendered and written to the destination folder. 🚀

Building it by myself everytime I have changes, would be too much work. A **github action** is needed! 😋


```yaml
on:
  push:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest
    name: Build and Push
    steps:
      - name: git-checkout
        uses: actions/checkout@v2

      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18.x'

      - name: Install all dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Push
        uses: s0/git-publish-subdir-action@develop
        env:
          REPO: self
          BRANCH: gh-pages
          FOLDER: dest/
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          MESSAGE: "Build: ({sha}) {msg}"
```


On every push, the website gets compiled to **static html** and gets pushed to another branch.

This also solves how to add new content on a static system - Just make a commit to the repository, which also has the advantages of **automated backups**. 🥳 

`Thanks Github!`

## Markdown templates

Writing blog posts in pure html is still too boring. It just has too much overhead!
**Markdown** is a common interface that allows writing content in nearly plaintext. I'm already compiling my website, so why can't I also add a markdown compilation step?

Thankfully, there are a lot of libraries for compiling markdown to html ready to use. 
> **The advantage of using the node ecosystem! 😁**


```js
function parsePost(filename, rawPost) {
    const lines = rawPost.split('\n')

    const parsedPost = new Post();
    parsedPost.filename = filename;

    parseMetadata(parsedPost, lines);

    parsedPost.htmlContent = marked.parse(lines.join('\n'));
    return parsedPost;
} 
```


Here, I am using the [marked.js](https://github.com/markedjs/marked) npm package to parse my markdown files to html. 


## Stealing resources from GitHub

I am a student. I am poor. I do not want to rent a server to host my application! 💰💸

That's another advantage of static html. You can basically **host it anywhere you want**! There are a lot of free providers, that serve your static files for you. 🤑

Here, I am using `GitHub Pages`. The deployment action already copies the compiled files into another branch. I can just point github pages to this branch and tell it to deploy it. 🚀

GitHub pages also offers the ability to serve the website with a **custom domain**. Thankfully I have one!

Just add a `CNAME` dns record for your domain, that points to the github servers and add your domain in the repository settings. You can read more about this process in the [GitHub docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/about-custom-domains-and-github-pages).


## Why you should not write your own blogging software!

As the post title already says, you should not write your own blogging software!
It depends on what your goal is.
> Do you want to write blog posts?
>
> Do you want to write a blogging software?

These are two very different goals. For me, I wanted to start writing blog posts, to learn more about writing and expressing myself.

But of course you are reading this post, so I really wrote my own solution for this.

If your goal is to just write blog posts, this is not the optimal path. You will get distracted by designing your system. You will forget to **actually write blog posts**.

I opened the pull request for the blogging part of my website on **January 25th**. I just got to writing my first post on **March 3rd**!

It was fun writing this piece of software, but if your endgoal really is just to write posts about things you find interesting, just do it and use some other tool!

> Getting started is always the hardest part!


## Last Words
If you want to learn more about this project, visit my [GitHub repo](https://github.com/AlexMi-Ha/Website).

In the future, I will post on a wide range of topics. But do not take them as too serious. I just try to have fun and practice my writing skills a bit.

In the end, I'm just a random dude on the internet, who loves shitposting, programming, music and cooking.