const loadController = new AbortController();

document.addEventListener('DOMContentLoaded', () => {

    document.getElementById('dialog-button-close').addEventListener('click', () => {
        loadController.abort();
        document.getElementById('dialog-window').classList.remove('active');
    });

    document.querySelectorAll('.dialog-button-open').forEach(btn => {
        const dialogWindow = document.getElementById('dialog-window');
        const id = btn.getAttribute('data-dialog-id');
        btn.addEventListener('click', () => {
            loadDialogContent(dialogWindow, id);
        });
    });
});

function loadDialogContent(window, dialogContentId) {
    console.log('asd');
    const url = window.getAttribute('data-dialogcontent-url');
    window.classList.add('active');
    fetch(
        url.replaceAll('{id}', dialogContentId),
        {
            method: 'get',
            signal: loadController.signal
        }
    ).then(res => {
        document.getElementById('dialog-content-window').innerHTML = res;
    }).catch(err => {
        console.log(err);
    })
}