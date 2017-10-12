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
    let worksheetIndex = document.getElementById('sheet-names').selectedIndex;
    tableau.addIn.dashboardContent.dashboard.worksheets[worksheetIndex].getUnderlyingDataAsync({maxRows: 1}).then(function (dataTable) {
        const fields = document.getElementById('field-list');
        for(let col of dataTable.columns) {
            const li = document.createElement('li');
            li.classList.add('list-group-item');
            li.appendChild(document.createTextNode(col.fieldName));
            fields.appendChild(li);
        }
        makeCheckboxListPretty();
    }, function (err) {
      alert('getUnderlyingDataAsync failed: ' + err.toString());
    });
}

function onSaveClicked() {
    let worksheetIndex = document.getElementById('sheet-names').selectedIndex;
    tableau.addIn.dashboardContent.dashboard.worksheets[worksheetIndex].getUnderlyingDataAsync().then(function (dataTable) {

        let selectedColumns = new Array(dataTable.columns.length);
        let fields = document.querySelectorAll('#field-list li');
        for(let idx=0; idx<fields.length; ++idx) {
            if (fields[idx].classList.contains('active')){
                selectedColumns[idx] = 1;
            } else {
                selectedColumns[idx] = 0;
            }
        }

        // The data should always be a 2d array. We will join
        let csvContent = '\ufeff'
        for(let i=0; i<dataTable.data.length; ++i) {
            for(let j=0; j<dataTable.columns.length; ++j) {
                if (selectedColumns[j] == 1) {
                    csvContent += '"' + dataTable.data[i][j].formattedValue + '"';
                    if (j != dataTable.columns.length - 1) {
                        csvContent += ","
                    }
                }
            }
            csvContent += "\n";
        }
        
        let blob = new Blob([csvContent],
                    {type: 'text/csv;charset=utf-8' });

        if (window.navigator.msSaveBlob) {
            window.navigator.msSaveBlob(blob, "data.csv");
        } else {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = "data.csv";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }, function (err) {
      alert('getUnderlyingDataAsync failed: ' + err.toString());
    });
}
function onBodyLoad() {
    tableau.addIn.initializeAsync().then(function () {
        const selectedSheet = tableau.addIn.settings.get('sheetName');
        let allSheets = tableau.addIn.dashboardContent.dashboard.worksheets;
        for (const sheet of allSheets) {
          let opt = document.createElement('option');
          opt.value = opt.text = sheet.name;
          if (sheet.name === selectedSheet) {
            opt.setAttribute('selected', 'selected');
          }
          document.getElementById('sheet-names').appendChild(opt);
        }
    
        document.getElementById('sheet-names').addEventListener('change', addFields);
        addFields();
    });
}
