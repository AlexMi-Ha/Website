const fsOld = require('fs');
const fs = require('fs/promises');
const path = require('path');
const renderPage = require('./renderer').renderPage

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
    const dir = await fs.readdir('src/views');
    const promises = []
    for(file of dir) {
        promises.push(renderFile(file));
    }
    promises.push(fs.cp('public/.', 'dest', {recursive:true}));

    await Promise.all(promises)
    console.log("Build complete!");
})();

