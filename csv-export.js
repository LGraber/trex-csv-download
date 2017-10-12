function downloadContentToCsv(opts) {
    if (!opts || !opts.content || !opts.filename) {
        throw 'Where is the data?';
    }
 
    var blob = new Blob(['\ufeff' + opts.content.join(';')],
                 {type: 'text/csv;charset=utf-8' });

    if (window.navigator.msSaveBlob) {
        window.navigator.msSaveBlob(blob, opts.filename);
    } else {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = opts.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

function onBtnClick() {
    downloadContentToCsv({
        filename: 'data.csv',
        content: ['Hello', 'World', 'How are you']
    });
}


