const dropZone = document.getElementById('file-drop-zone');
const fileInput = document.getElementById('file-input');
const validationMessages = document.getElementById('validation-messages');
const validationButton = document.getElementById('validation-button');
const fileCounter = document.getElementById('file-counter');
const selectedFilesInput = document.getElementById('selected-files');

let fileNumber = 0;
let files = [];
let errors = 0;
let fileErrors = 0;

let selectedFiles = [];
document.addEventListener('DOMContentLoaded', () =>
{
    updateTableVisibility();

   dropZone.addEventListener('dragover', (event) =>
   {
       event.preventDefault();
       dropZone.classList.add('drag-over');
   });

   dropZone.addEventListener('dragleave', () =>
   {
       dropZone.classList.remove('drag-over');
   });

   dropZone.addEventListener('drop', (event) =>
   {
       dropZone.classList.remove('drag-over');
       event.preventDefault();
       let file = event.dataTransfer.files[0];
       files.push(file);
       addFileElement(file);

       updateFileCounter();
       updateTableVisibility();
   });

   fileInput.addEventListener('change', (event) =>
   {
       for(let file of event.target.files)
       {
           selectedFiles = [];
           files.push(file);
           selectedFiles.push(file);
           addFileElement(file)
           updateFileCounter();
       }
       updateTableVisibility();
   });
   validationButton.addEventListener('click', () =>
   {
       validateFiles(files);
   });

});

function addFileElement(file)
{
    // TODO
    let fileRow = document.createElement('tr');
    fileRow.setAttribute('id', `row-${fileNumber}`);
    let classes = ["d-flex", "justify-content-between", 'file-row'];
    classes.forEach(item => fileRow.classList.add(item));

    let fileElement = document.createElement('p');
    fileElement.textContent = file.name;

    let removeFileButton = document.createElement('i');
    removeFileButton.classList.add('bi-trash');
    removeFileButton.classList.add('bi');

    removeFileButton.addEventListener('click', () =>
    {
        selectedFilesInput.removeChild(fileRow);
        let index = files.indexOf(file);
        files.splice(index, 1);


        if(selectedFiles.includes(file))
        {
            selectedFilesInput.files = "";
        }

        updateFileCounter(true);
        updateTableVisibility();
    });


    fileRow.appendChild(fileElement);
    fileRow.appendChild(removeFileButton);
    selectedFilesInput.appendChild(fileRow);
}

function updateTableVisibility()
{
    let fileArea = document.getElementById('file-area');
    if (fileNumber === 0)
    {
        selectedFilesInput.setAttribute('hidden', 'true');
        fileArea.style.borderRadius = '10px';
        fileArea.classList.remove('pt-3', 'border-top');
    }
    else
    {
        selectedFilesInput.removeAttribute('hidden');
        fileArea.classList.add('pt-3', 'border-top');
    }
}
function validateFiles(files)
{
    validationMessages.innerHTML = "";

    if (files.length === 0)
    {
        addValidationElement('No files to validate.', [ 'alert', 'alert-danger' ]);
        errors++;
        return;
    }

    for(let file of files)
    {
        fileErrors = 0;

        const reader = new FileReader();


        //| File type validation
        if(file.name.split('.')[1] !== 'sql')
        {
            addValidationElement("Only upload SQL files.", [  'alert', 'alert-danger' ]);
            errors++;
            return;
        }

        //| Syntax validation
        reader.onloadend = (event) =>
        {
            const data = event.target.result;

            checkSyntax(data, 'SELECT', file.name);
            checkSyntax(data, 'FROM', file.name);
            checkSyntax(data, ';', file.name)

            if (fileErrors === 0)
            {
                addValidationElement(`${file.name} validated successfully, no errors found.`, [ 'alert', 'alert-success']);
            }
        }

        reader.readAsText(file);


    }
}

function checkSyntax(data, requirement, fileName)
{
    if (data.includes(requirement) === false)
    {
        addValidationElement(`Syntax error: ${fileName} does not include ${requirement}`, [ 'alert', 'alert-danger' ]);
    }
}

function addValidationElement(message, classes)
{
    const validationElement = document.createElement('p');
    classes.forEach(item => validationElement.classList.add(item));
    validationElement.textContent = message;
    validationMessages.appendChild(validationElement);

    fileErrors++;
    errors++;
}

function updateFileCounter(remove = false)
{
    if (remove) fileNumber--;
    else fileNumber++;

    fileCounter.textContent = fileNumber === 1 ? `${fileNumber} File Selected` : `${fileNumber} Files Selected`;
}