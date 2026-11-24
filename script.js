console.log('script.js loaded!');

// side nav

function OpensideNav() {

    document. getElementById("sideNavJ") .style.width = "250px" ;
}

function closeNav() {
    document. getElementById("sideNavJ") .style.width = "0" ;
}


// img
document.querySelectorAll(".oc-upload-box").forEach((box) => {
  const input = box.querySelector(".oc-img-input");
  const gallery = box.querySelector(".oc-img-gallery");

  input.addEventListener("change", function () {
    const files = Array.from(this.files);

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = function (e) {
        const img = document.createElement("img");
        img.src = e.target.result;
        img.title = "Click to remove";

        img.addEventListener("click", () => {
          img.remove();
        });

        gallery.appendChild(img);
      };

      reader.readAsDataURL(file);
    });

    this.value = "";
  });
});


//Name keydown
const NameInputs = document.querySelectorAll(".ocName, .basic, .basicHeight");
NameInputs.forEach(input => {
    input.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' && input.value.trim() !== '') {
            const textDisplay = document.createElement('span');
            textDisplay.innerText = `${input.placeholder}: ${input.value} `;
            textDisplay.addEventListener('dblclick', function() {
                textDisplay.remove();
                input.value = '';
                input.style.display = ''; 
                input.focus();
            });
            textDisplay.style.display = 'block'; 
            textDisplay.style.margin = '5px 0';
            input.parentNode.insertBefore(textDisplay, input);
            input.style.display = 'none';
        }
    });
});

// informtion keydown

const ocNameInputs = document.querySelectorAll(".information");
ocNameInputs.forEach(input => {
    const container = document.createElement('div');
    container.className = 'popBox';
    input.parentNode.insertBefore(container, input);

    input.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' && input.value.trim() !== '') {
            event.preventDefault(); 

            const entryDiv = document.createElement('div');
            entryDiv.className = 'added-item';
            entryDiv.innerText = `${input.placeholder}: ${input.value.trim()}`;
            entryDiv.style.margin = '5px 0';
            entryDiv.style.cursor = 'pointer';
            entryDiv.title = 'Double click to remove';

            entryDiv.addEventListener('dblclick', function() {
                entryDiv.remove();
                if (container.children.length === 0) {
                    container.style.display = 'none';
                }
            });

            container.appendChild(entryDiv);
            container.style.display = 'flex';

            input.value = '';
            input.focus();
        }
    });
});


// ENTER BTN

const Inputs = document.querySelector('.ocname');
if (Inputs) {
    Inputs.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            saveCurrentOC();
        }
    });
}

// select tag
console.log('dropbox count:', document.querySelectorAll('.dropbox').length);

document.querySelectorAll('.dropbox').forEach(dropbox => {
    const picker = dropbox.querySelector('.dropboxPicker');
    const selectedBox = dropbox.querySelector('.selectedTag');

    console.log({ dropbox, picker, selectedBox });
    if (!picker || !selectedBox) return;

    picker.addEventListener('click', (e) => {
        console.log('picker clicked:', e.target);
        const btn = e.target.closest('.tagoption');
        if (!btn) return;

        const tagValue = btn.dataset.tag || btn.textContent.trim();

        const exists = Array.from(selectedBox.querySelectorAll('.pickedTag'))
            .some(item => item.dataset.tag === tagValue);
        if (exists) return;

        const tagEl = document.createElement('span');
        tagEl.className = 'pickedTag';
        tagEl.dataset.tag = tagValue;

        selectedBox.appendChild(tagEl);
        selectedBox.appendChild(tagEl);
        console.log('added to:', selectedBox, 'children:', selectedBox.children.length);

        btn.style.display = 'none';

        selectedBox.addEventListener('click', (e) => {
            const removeBtn = e.target.closest('.removeTagBtn');
            if (!removeBtn) return;
        
            const tagEl = removeBtn.closest('.pickedTag');
            const tagValue = tagEl.dataset.tag;
            tagEl.remove();
        
            const optionBtn = picker.querySelector(`.tagOption[data-tag="${tagValue}"]`);
            if (optionBtn) optionBtn.style.display = '';
        });
    });
});

window.addEventListener('load', () => {
    document.querySelectorAll('.dropbox').forEach((dropbox) => {
        const picker = dropbox.querySelector('.dropboxPicker');
        const selectedBox = dropbox.parentElement
            ? dropbox.parentElement.querySelector('.selectedTag')
            : null;
        const buttons = dropbox.querySelectorAll('.tagOption');
        const isSingleSelect = dropbox.dataset.single === 'true';

        if (!picker || !selectedBox) return;

        function restoreOptionBtn(tagValue) {
            const matchingBtn = Array.from(buttons).find(
                (btn) => ((btn.dataset.tag || btn.textContent || '').trim() === tagValue)
            );
            if (matchingBtn) {
                matchingBtn.style.display = '';
            }
        }

        buttons.forEach((btn) => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                const tagValue = (btn.dataset.tag || btn.textContent || '').trim();
                if (!tagValue) return;

               
                if (isSingleSelect) {
                    selectedBox.querySelectorAll('.pickedTag').forEach((existingTag) => {
                        restoreOptionBtn(existingTag.dataset.tag);
                        existingTag.remove();
                    });
                } else {
                 
                    const alreadyPicked = Array.from(selectedBox.querySelectorAll('.pickedTag'))
                        .some((item) => item.dataset.tag === tagValue);
                    if (alreadyPicked) return;
                }

                const tagEl = document.createElement('span');
                tagEl.className = 'pickedTag';
                tagEl.dataset.tag = tagValue;

                const label = document.createElement('span');
                label.textContent = tagValue;

                const removeBtn = document.createElement('button');
                removeBtn.type = 'button';
                removeBtn.className = 'removeTagBtn';
                removeBtn.setAttribute('aria-label', `Remove ${tagValue}`);
                removeBtn.textContent = 'x';

                tagEl.appendChild(label);
                tagEl.appendChild(removeBtn);
                selectedBox.appendChild(tagEl);

                btn.style.display = 'none';
            });
        });

        selectedBox.addEventListener('click', (e) => {
            const removeBtn = e.target.closest('.removeTagBtn');
            if (!removeBtn) return;

            const tagEl = removeBtn.closest('.pickedTag');
            if (!tagEl) return;

            const tagValue = tagEl.dataset.tag;
            tagEl.remove();
            restoreOptionBtn(tagValue);
        });
    });
});


// pdf file
const expoBtn = document.querySelector('.expo');
const expoPTF = document.querySelector('.expo');
let isPrinting = false;

function cleanupPrintUnits() {
    document.querySelectorAll('.print-unit').forEach(span => span.remove());
}

if (expoBtn) {
    expoBtn.addEventListener('click', () => {

        cleanupPrintUnits();

        document.querySelectorAll('select').forEach(select => {
            let span = select.nextElementSibling;
            if (!span || !span.classList.contains('print-unit')) {
                span = document.createElement('span');
                span.className = 'print-unit';
                select.parentNode.insertBefore(span, select.nextSibling);
            }

            const selectedText = select.options[select.selectedIndex]?.text || select.value;
            span.innerText = selectedText;
        });

        window.print();

        setTimeout(() => {
            isPrinting = false;
        }, 500);
    });
}

window.addEventListener('afterprint', () => {
    cleanupPrintUnits();
    isPrinting = false;
});

window.addEventListener('beforeprint', () => {
    const colorInputs = document.querySelectorAll(
        'input[type="color"].ocColor, .colorbox input[type="color"]'
    );
    const swatch = document.createElement('span');
    swatch.className = 'print-swatch';
    swatch.style.backgroundColor = picker.value;
    picker.insertAdjacentElement('afterend', swatch);

    colorInputs.forEach(picker => {
        picker.style.backgroundColor = picker.value;

        const next = picker.nextElementSibling;
        if (next && next.classList.contains('print-swatch')) {
            next.style.backgroundColor = picker.value;
            return;
        }

        const swatch = document.createElement('span');
        swatch.className = 'print-swatch';
        swatch.style.backgroundColor = picker.value;
        picker.insertAdjacentElement('afterend', swatch);

        
    });
});

document.querySelectorAll('.print-swatch').forEach(s => s.remove());





// html file
const saveBtn = document.querySelector('.save');

function collectCurrentOC() {
    const items = Array.from(document.querySelectorAll('.added-item'))
        .map(el => el.innerText.trim())
        .filter(Boolean);

    const inputs = Array.from(document.querySelectorAll('input'))
        .filter(inp => inp.type !== 'color' && inp.type !== 'file' && inp.value.trim() !== '')
        .map(inp => `${inp.placeholder ? inp.placeholder + ': ' : ''}${inp.value.trim()}`);

    // 3. 拎埋顏色選擇器 (input[type="color"])
    const colors = Array.from(document.querySelectorAll('input[type="color"]'))
        .map((c, i) => `Color ${i + 1}: ${c.value}`);

    const allDetails = [...items, ...inputs, ...colors];

    const firstItem = items[0] || inputs[0] || '';
    const charName = firstItem.includes(':')
    ? firstItem.split(':')[1].trim()
    : (firstItem || 'Unnamed OC');

    return {
        id: Date.now(),
        name: charName,
        details: allDetails,
        savedAt: new Date().toLocaleString()
    };
}

if (saveBtn) {
    saveBtn.addEventListener('click', () => {
        const ocData = collectCurrentOC();

        const existing = JSON.parse(localStorage.getItem('ocCharacters') || '[]');
        existing.push(ocData);
        localStorage.setItem('ocCharacters', JSON.stringify(existing));

        showSavedMessage(`"${ocData.name}" has been saved!`);
    });
}

function showSavedMessage(message = 'Character saved!') {
    let toast = document.querySelector('.save-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'save-toast';
        document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.classList.add('show');

    clearTimeout(toast._hideTimer);
    toast._hideTimer = setTimeout(() => {
        toast.classList.remove('show');
    }, 2000);
}

// html page
const characterList = document.getElementById('characterList');
    const searchInput = document.getElementById('searchInput');
    let characters = JSON.parse(localStorage.getItem('ocCharacters') || '[]');

function toggleDetails(id) {
    const card = document.querySelector(`.char-card[data-id="${id}"]`);
    if (card) {
        card.classList.toggle('open');
    }
}

function deleteCharacter(id) {
    const targetChar = characters.find(char => char.id === id);
    const charLabel = targetChar?.name || 'this character';

    const confirmed = confirm(`Are you sure you want to delete "${charLabel}"?`);
    if (!confirmed) return;

    characters = characters.filter(char => char.id !== id);
    localStorage.setItem('ocCharacters', JSON.stringify(characters));
    renderCharacters(searchInput ? searchInput.value : '');
}

function renderCharacters(filterText = '') {
    const keyword = filterText.trim().toLowerCase();

    const filtered = characters.filter(char => {
        const combined = `${char.name || ''} ${(char.details || []).join(' ')}`.toLowerCase();
        return combined.includes(keyword);
    });

    if (filtered.length === 0) {
        characterList.innerHTML = '<p>No matching characters found.</p>';
        return;
    }

    characterList.innerHTML = filtered.map(char => {
        const tags = (char.details || [])
            .map(detail => {
                const str = String(detail);
                const hexMatch = str.match (/#[0-9a-fA-F]{3,8}\b/);

                if (hexMatch){
                    const hex = hexMatch[0];
                }
            })
            .join('');

        
            
        return `
            <article class="char-card" data-id="${char.id}">
                <div class="card-header">
                    <button class="char-name-btn" onclick="toggleDetails(${char.id})">
                        ${char.name || 'Unnamed OC'}
                    </button>
                    <button class="delete-btn" onclick="deleteCharacter(${char.id})">Delete</button>
                </div>
                <div class="char-details">
                    <div class="tags">${tags || '<span style="color:white;" >No details saved.</span>'}</div>
                </div>
            </article>
        `;
    }).join('');
}

if (searchInput) {
    searchInput.addEventListener('input', () => {
        renderCharacters(searchInput.value);
    });
}

renderCharacters();