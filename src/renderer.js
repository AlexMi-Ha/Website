const ejs = require('ejs');

const renderPage = async (view) => {
    return await ejs.renderFile('./layout/layout.ejs', {
        body: await ejs.renderFile(`./views/${view}.ejs`)
    });
}

module.exports = {renderPage}