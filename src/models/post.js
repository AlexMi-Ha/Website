const marked = require("marked");

marked.use({
    extensions: [{
        name: 'heading',
        renderer(token) {
            const text = token.text;
            const escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');
            const level = token.depth;
            return `<h${level}><a name="section-${escapedText}" class="anchor" href="#section-${escapedText}"><span class="header-link"></span></a>${text}</h${level}>`;
        }
    }]
});


class Post {

    constructor(id, filename, title, summary, titleImage, date, tags, htmlContent) {
        this.id = id;
        this.filename = filename;
        this.title = title;
        this.summary = summary;
        this.titleImage = titleImage;
        this.date = date;
        this.tags = tags;
        this.htmlContent = htmlContent;
    }

}

function parsePost(filename, rawPost) {
    const lines = rawPost.split('\n')
    if(!lines.shift().startsWith("---")) {
        throw Error("Missing Metadata section in post");
    }
    const parsedPost = new Post();
    parsedPost.filename = filename;

    let metaLine = "";
    while(!(metaLine = lines.shift()).startsWith("---")) {
        if(metaLine.startsWith("Title:")) {
            parsedPost.title = metaLine.substring("Title:".length).trim();
        }else if(metaLine.startsWith("Summary:")) {
            parsedPost.summary = metaLine.substring("Summary:".length).trim();
        }else if(metaLine.startsWith("Id:")) {
            parsedPost.id = metaLine.substring("Id:".length).trim();
        }else if(metaLine.startsWith("TitleImage:")) {
            parsedPost.titleImage = metaLine.substring("TitleImage:".length).trim();
        }else if(metaLine.startsWith("Date:")) {
            const dateStringParts =metaLine.substring("Date:".length).trim().split(".");
            // Date needs YYYY-MM-DD format to parse
            parsedPost.date = new Date(dateStringParts[2], dateStringParts[1] - 1, dateStringParts[0]);
        }else if(metaLine.startsWith("Tags:")) {
            parsedPost.tags = metaLine.substring("Tags:".length).split(",").map(e => e.trim());
        }else {
            throw Error("Unknown meta date tag in post: '"+ metaLine + "'");
        }
    }

    parsedPost.htmlContent = marked.parse(lines.join('\n')).replaceAll(/(<table>(\s|.)*?<\/table>)/g, '<div class="table-wrapper">$1</div>');;
    return parsedPost;
} 

module.exports = {Post, parsePost}