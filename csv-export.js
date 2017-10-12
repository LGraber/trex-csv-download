function downloadContentToCsv(opts) {
    if (!opts || !opts.content || !opts.filename) {
        throw 'Where is the data?';
    }
 
    // The data should always be a 2d array. We will join
    let csvContent = '\ufeff'
    for (i=0; i<opts.content.length; ++i) {
        csvContent += opts.content[i].join(',') + '\n';
    }
    var blob = new Blob([csvContent],
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
    const data = new Array(5);
    for (let i=0; i<5; i++) {
        data[i] = new Array(5);
        for (let j=0; j<5; ++j) {
            let val = i+j;
            data[i][j] = val.toString();
        }
    }
    downloadContentToCsv({
        filename: 'data.csv',
        content: data
    });
}

function addFields() {
    const fields = document.getElementById('field-list');
    for (let i=0; i<5; i++) {
        const li = document.createElement('li');
        li.classList.add('list-group-item');
        li.appendChild(document.createTextNode('Hello' + i));
        fields.appendChild(li);
    }
    makeCheckboxListPretty();
}

function onBodyLoad() {
    document.getElementById('sheet-names').addEventListener('change', addFields);
}
