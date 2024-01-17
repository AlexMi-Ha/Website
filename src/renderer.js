const ejs = require('ejs');

const renderPage = async (view) => {
    return await ejs.renderFile('src/layout/layout.ejs', {
        view: view,
        body: await ejs.renderFile(`src/views/${view}.ejs`)
    });
}

module.exports = {renderPage}