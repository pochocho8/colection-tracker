const authScreen = document.getElementById('authScreen');
const registerScreen = document.getElementById('registerScreen');
const appScreen = document.getElementById('appScreen');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const registerForm = document.getElementById('registerForm');
const registerError = document.getElementById('registerError');
const btnGoToRegister = document.getElementById('btnGoToRegister');
const btnGoToLogin = document.getElementById('btnGoToLogin');
const btnLogout = document.getElementById('btnLogout');
const userDisplay = document.getElementById('userDisplay');
const collectionsGrid = document.getElementById('collectionsGrid');
const dashboardEmpty = document.getElementById('dashboardEmpty');
const dashboardSection = document.getElementById('dashboardSection');
const detailSection = document.getElementById('detailSection');
const btnBack = document.getElementById('btnBack');
const btnNewCollection = document.getElementById('btnNewCollection');
const btnDeleteDatabase = document.getElementById('btnDeleteDatabase');
const btnDeleteCollection = document.getElementById('btnDeleteCollection');
const btnDownloadCollection = document.getElementById('btnDownloadCollection');
const switchPublic = document.getElementById('switchPublic');
const switchContainer = document.getElementById('switchContainer');
const btnToggleView = document.getElementById('btnToggleView');
const btnBackToMy = document.getElementById('btnBackToMy');
const publicSection = document.getElementById('publicSection');
const publicGrid = document.getElementById('publicGrid');
const publicEmpty = document.getElementById('publicEmpty');
const btnLogin = document.getElementById('btnLogin');
const modalOverlay = document.getElementById('modalOverlay');
const btnCancelModal = document.getElementById('btnCancelModal');
const formNewCollection = document.getElementById('formNewCollection');
const formAddItem = document.getElementById('formAddItem');
const itemImagenFile = document.getElementById('itemImagenFile');
const itemObservaciones = document.getElementById('itemObservaciones');
const itemsList = document.getElementById('itemsList');
const imageModal = document.getElementById('imageModal');
const imageModalImg = document.getElementById('imageModalImg');
const btnCloseImageModal = document.getElementById('btnCloseImageModal');
const switchLabelPrivado = document.getElementById('switchLabelPrivado');
const switchLabelPublico = document.getElementById('switchLabelPublico');

const confirmModal = document.getElementById('confirmModal');
const confirmTitle = document.getElementById('confirmTitle');
const confirmMessage = document.getElementById('confirmMessage');
const btnCancelConfirm = document.getElementById('btnCancelConfirm');
const btnConfirmAction = document.getElementById('btnConfirmAction');

let currentUser = null;
let currentCollectionId = null;
let selectedIcon = 'star';
let confirmCallback = null;
let allPublicCollections = [];

let isPublicView = true;
let currentIsOwner = false;
let inPublicBrowsingMode = true;
let isAdmin = false;

const adminSection = document.getElementById('adminSection');
const btnAdminPanel = document.getElementById('btnAdminPanel');
const adminTableBody = document.getElementById('adminTableBody');
const adminEmpty = document.getElementById('adminEmpty');
const btnBackToApp = document.getElementById('btnBackToApp');
const adminBannedBody = document.getElementById('adminBannedBody');
const adminBannedEmpty = document.getElementById('adminBannedEmpty');

const iconSVGs = {
    star: '<svg role="img" aria-label="Estrella" viewBox="0 0 24 24" width="1.25rem" height="1.25rem" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>',
    cube: '<svg role="img" aria-label="Cubo" viewBox="0 0 24 24" width="1.25rem" height="1.25rem" fill="currentColor"><path d="M21 16.5c0 .38-.21.71-.53.88l-7.9 4.44c-.16.12-.36.18-.57.18-.21 0-.41-.06-.57-.18l-7.9-4.44A.991.991 0 013 16.5v-9c0-.38.21-.71.53-.88l7.9-4.44c.16-.12.36-.18.57-.18.21 0 .41.06.57.18l7.9 4.44c.32.17.53.5.53.88v9zM12 4.15L6.04 7.5 12 10.85l5.96-3.35L12 4.15zM5 15.91l6 3.38v-6.71L5 9.21v6.7zm14 0v-6.7l-6 3.38v6.71l6-3.39z"/></svg>',
    trophy: '<svg role="img" aria-label="Trofeo" viewBox="0 0 24 24" width="1.25rem" height="1.25rem" fill="currentColor"><path d="M20.2 2H3.8C2.8 2 2 2.8 2 3.8v3.4c0 3.1 2.3 5.7 5.3 6.1.7 2.3 2.8 4 5.2 4.4V21h-3c-.6 0-1 .4-1 1s.4 1 1 1h6c.6 0 1-.4 1-1s-.4-1-1-1h-3v-3.3c2.4-.4 4.5-2.1 5.2-4.4 3-.4 5.3-3 5.3-6.1V3.8c0-1-.8-1.8-1.8-1.8zM4 7.2V4h2v5.9c-1.2-.7-2-2-2-2.7zm16 0c0 .8-.8 2-2 2.7V4h2v3.2z"/></svg>',
    sparkle: '<svg role="img" aria-label="Brillo" viewBox="0 0 24 24" width="1.25rem" height="1.25rem" fill="currentColor"><path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8L12 2zm0 4.8L10.2 12 2 12l8.2 1.2L12 18l1.8-4.8L22 12l-8.2-1.2L12 6.8z"/></svg>'
};

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function showError(element, message) {
    element.textContent = message;
    element.classList.add('visible');
}

function showSuccess(element, message) {
    element.textContent = message;
    element.classList.add('visible', 'success-msg');
}

function hideError(element) {
    element.classList.remove('visible', 'success-msg');
}

function showScreen(screen) {
    authScreen.style.display = 'none';
    registerScreen.style.display = 'none';
    appScreen.style.display = 'none';
    if (screen === 'auth') {
        authScreen.style.display = 'flex';
    } else if (screen === 'register') {
        registerScreen.style.display = 'flex';
    } else {
        appScreen.style.display = 'flex';
    }
}

function showConfirmModal(title, message, callback) {
    confirmTitle.textContent = title;
    confirmMessage.textContent = message;
    confirmModal.style.display = 'flex';
    confirmCallback = callback;
}

function hideConfirmModal() {
    confirmModal.style.display = 'none';
    confirmCallback = null;
}

loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    hideError(loginError);
    var username = document.getElementById('loginUsername').value.trim();
    var password = document.getElementById('loginPassword').value;
    if (!username || !password) return;
    fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username, password: password }),
        credentials: 'same-origin'
    })
    .then(function(response) {
        return response.json().then(function(data) {
            if (!response.ok || !data.ok) {
                throw new Error(data.mensaje || 'Error al iniciar sesion');
            }
            return data;
        });
    })
    .then(function(data) {
        currentUser = { nomUsu: data.usuario.nomUsu };
        userDisplay.textContent = data.usuario.nomUsu;
        isAdmin = data.esAdmin === true;
        updateHeaderUI();
        showScreen('app');
        publicSection.style.display = 'none';
        dashboardSection.style.display = 'block';
        inPublicBrowsingMode = false;
        isPublicView = false;
        loginForm.reset();
        loadCollections();
    })
    .catch(function(error) {
        showError(loginError, error.message);
    });
});

btnGoToRegister.addEventListener('click', function() {
    hideError(loginError);
    loginForm.reset();
    showScreen('register');
});

btnGoToLogin.addEventListener('click', function() {
    hideError(registerError);
    registerForm.reset();
    showScreen('auth');
});

registerForm.addEventListener('submit', function(e) {
    e.preventDefault();
    hideError(registerError);
    var username = document.getElementById('registerUsername').value.trim();
    var email = document.getElementById('registerEmail').value.trim();
    var password = document.getElementById('registerPassword').value;
    if (!username || !email || !password) return;
    fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username, email: email, password: password }),
        credentials: 'same-origin'
    })
    .then(function(response) {
        return response.json().then(function(data) {
            if (!response.ok || !data.ok) {
                throw new Error(data.mensaje || 'Error al registrarse');
            }
            return data;
        });
    })
    .then(function() {
        registerForm.reset();
        document.getElementById('loginUsername').value = username;
        showScreen('auth');
        loginError.classList.remove('success-msg');
        showSuccess(loginError, 'Cuenta creada correctamente. Inicia sesión.');
    })
    .catch(function(error) {
        showError(registerError, error.message);
    });
});

function readFileAsDataURL(file) {
    return new Promise(function(resolve, reject) {
        var reader = new FileReader();
        reader.onload = function() { resolve(reader.result); };
        reader.onerror = function() { reject(reader.error); };
        reader.readAsDataURL(file);
    });
}

function updateSwitchLabels() {
    if (switchPublic.checked) {
        switchContainer.classList.remove('private');
        switchContainer.classList.add('public');
    } else {
        switchContainer.classList.remove('public');
        switchContainer.classList.add('private');
    }
}

btnLogin.addEventListener('click', function() {
    showScreen('auth');
});

function updateHeaderUI() {
    var loggedIn = currentUser !== null;
    btnLogin.style.display = loggedIn ? 'none' : 'inline-flex';
    btnLogout.style.display = loggedIn ? 'inline-flex' : 'none';
    userDisplay.style.display = loggedIn ? 'inline' : 'none';
    btnAdminPanel.style.display = loggedIn && isAdmin ? 'flex' : 'none';
    btnNewCollection.style.display = loggedIn ? 'inline-flex' : 'none';
    btnDeleteDatabase.style.display = loggedIn ? 'inline-flex' : 'none';
    btnToggleView.style.display = loggedIn ? 'inline-flex' : 'none';
    btnBackToMy.style.display = 'inline-flex';
    btnBackToMy.textContent = loggedIn ? 'Mis Colecciones' : 'Iniciar Sesion';
}

btnLogout.addEventListener('click', function() {
    fetch('/api/auth/logout', { method: 'POST', credentials: 'same-origin' })
    .catch(function(error) {
        console.error('Error al cerrar sesion:', error);
    })
    .then(function() {
        currentUser = null;
        currentCollectionId = null;
        isAdmin = false;
        adminSection.style.display = 'none';
        loginForm.reset();
        hideError(loginError);
        updateHeaderUI();
        showScreen('app');
        dashboardSection.style.display = 'none';
        publicSection.style.display = 'block';
        isPublicView = true;
        inPublicBrowsingMode = true;
        loadPublicCollections();
    });
});

function loadCollections() {
    fetch('api/colecciones/list', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })
    .then(function(response) {
        return response.json().then(function(data) {
            if (!response.ok || !data.ok) {
                throw new Error(data.mensaje || 'Error al cargar colecciones');
            }
            return data;
        });
    })
    .then(function(data) {
        renderCollections(data.colecciones);
    })
    .catch(function(error) {
        collectionsGrid.innerHTML = '<div class="error-message">' + error.message + '</div>';
    });
}

function loadPublicCollections() {
    fetch('api/colecciones/publicas', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })
    .then(function(response) {
        return response.json().then(function(data) {
            if (!response.ok || !data.ok) {
                throw new Error(data.mensaje || 'Error al cargar colecciones publicas');
            }
            return data;
        });
    })
    .then(function(data) {
        renderPublicCollections(data.colecciones);
    })
    .catch(function(error) {
        publicGrid.innerHTML = '<div class="error-message">' + error.message + '</div>';
    });
}

function toggleView() {
    if (!currentUser) {
        showScreen('auth');
        return;
    }
    isPublicView = !isPublicView;
    inPublicBrowsingMode = isPublicView;
    
    if (isPublicView) {
        dashboardSection.style.display = 'none';
        publicSection.style.display = 'block';
        btnToggleView.querySelector('span').textContent = 'Mis Colecciones';
        loadPublicCollections();
    } else {
        publicSection.style.display = 'none';
        dashboardSection.style.display = 'block';
        btnToggleView.querySelector('span').textContent = 'Explorar Publicas';
        inPublicBrowsingMode = false;
        loadCollections();
    }
}

function backToDashboard() {
    currentCollectionId = null;
    detailSection.style.display = 'none';
    if (currentUser && !inPublicBrowsingMode) {
        dashboardSection.style.display = 'block';
        loadCollections();
    } else {
        publicSection.style.display = 'block';
        loadPublicCollections();
    }
}

async function openPublicCollection(id) {
    if (!currentUser) {
        showScreen('auth');
        return;
    }
    currentCollectionId = id;
    inPublicBrowsingMode = isPublicView;
    dashboardSection.style.display = 'none';
    publicSection.style.display = 'none';
            detailSection.style.display = 'block';
    await loadCollectionDetail(id);
    loadItems(id);
}

function downloadCollection(id, btnElement) {
    if (!currentUser) {
        showScreen('auth');
        return;
    }
    if (btnElement && btnElement.classList.contains('downloaded')) {
        return;
    }
    
    fetch('api/colecciones/download?id=' + id, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin'
    })
    .then(function(response) {
        return response.json().then(function(data) {
            if (!response.ok || !data.ok) {
                throw new Error(data.mensaje || 'Error al agregar');
            }
            return data;
        });
    })
    .then(function(data) {
        if (btnElement) {
            btnElement.classList.add('downloaded');
            btnElement.textContent = 'Agregada';
        }
        
        alert('Colección agregada exitosamente');
    })
    .catch(function(error) {
        alert(error.message);
    });
}

function renderCollections(colecciones) {
    if (!colecciones || colecciones.length === 0) {
        collectionsGrid.style.display = 'none';
        dashboardEmpty.style.display = 'flex';
        return;
    }
    
    collectionsGrid.style.display = 'grid';
    dashboardEmpty.style.display = 'none';
    
    collectionsGrid.innerHTML = colecciones.map(col => {
        const publicBadge = '';
        
        var cardStyle = col.imagenUrl ? ' style="background-image: url(\'' + col.imagenUrl + '\')"' : '';
        return '<div class="collection-card' + (col.imagenUrl ? ' has-image' : '') + '" data-id="' + col.ideCol + '" data-name="' + escapeHtml(col.nomCol) + '"' + cardStyle + '>' +
            '<div style="display: flex; justify-content: space-between; align-items: start;">' +
                '<div class="collection-card-icon" style="flex: 1; margin-bottom: 0.5rem;">' +
                    (iconSVGs[col.icono] || iconSVGs.star) +
                    '<span>' + escapeHtml(col.nomCol) + '</span>' +
                    publicBadge +
                '</div>' +
                '<button class="collection-card-delete" title="Eliminar coleccion">Borrar colección</button>' +
            '</div>' +
            '<div class="collection-card-count">' + col.conseguidos + '/' + col.totalItems + '</div>' +
            '<div class="collection-card-wish">' + col.deseados + ' en lista de deseos</div>' +
            '<div class="collection-card-progress">' +
                '<div class="collection-card-progress-conseguidos" style="width: ' + (col.totalItems > 0 ? (col.conseguidos / col.totalItems) * 100 : 0) + '%"></div>' +
                '<div class="collection-card-progress-deseados" style="width: ' + (col.totalItems > 0 ? (col.deseados / col.totalItems) * 100 : 0) + '%"></div>' +
            '</div>' +
        '</div>';
    }).join('');
}

function renderPublicCollections(colecciones) {
    allPublicCollections = colecciones || [];
    filterPublicCollections();
}

function filterPublicCollections() {
    var searchTerm = document.getElementById('publicSearchInput').value.trim().toLowerCase();
    var colecciones = searchTerm
        ? allPublicCollections.filter(function(col) { return col.nomCol.toLowerCase().includes(searchTerm); })
        : allPublicCollections;

    if (!colecciones || colecciones.length === 0) {
        publicGrid.style.display = 'none';
        publicEmpty.style.display = 'flex';
        if (searchTerm) {
            publicEmpty.querySelector('p').textContent = 'No se encontraron colecciones con ese nombre';
            publicEmpty.querySelector('span').textContent = 'Prueba con otro termino de busqueda';
        } else {
            publicEmpty.querySelector('p').textContent = 'No hay colecciones publicas todavia';
            publicEmpty.querySelector('span').textContent = 'Se el primero en hacer publica tu coleccion';
        }
        return;
    }
    
    publicGrid.style.display = 'grid';
    publicEmpty.style.display = 'none';
    
    publicGrid.innerHTML = colecciones.map(function(col) {
        var cardStyle = col.imagenUrl ? ' style="background-image: url(\'' + col.imagenUrl + '\')"' : '';
        return '<div class="collection-card' + (col.imagenUrl ? ' has-image' : '') + '" data-id="' + col.ideCol + '"' + cardStyle + '>' +
            '<div class="collection-card-icon">' +
                (iconSVGs[col.icono] || iconSVGs.star) +
                '<span>' + escapeHtml(col.nomCol) + '</span>' +
            '</div>' +
            '<div class="public-card-info">' +
                col.totalItems + ' elemento' + (col.totalItems !== 1 ? 's' : '') +
            '</div>' +
            '<button class="btn-download" data-action="download" title="Agregar coleccion">Agregar coleccion</button>' +
        '</div>';
    }).join('');
}

function openCollection(id) {
    currentCollectionId = id;
    dashboardSection.style.display = 'none';
    detailSection.style.display = 'block';
    loadCollectionDetail(id);
    loadItems(id);
}

btnBack.addEventListener('click', backToDashboard);

btnToggleView.addEventListener('click', toggleView);

document.getElementById('btnPublicSearch').addEventListener('click', filterPublicCollections);

document.getElementById('publicSearchInput').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        filterPublicCollections();
    }
});

btnBackToMy.addEventListener('click', () => {
    if (!currentUser) {
        showScreen('auth');
        return;
    }
    isPublicView = false;
    inPublicBrowsingMode = false;
    publicSection.style.display = 'none';
    dashboardSection.style.display = 'block';
    btnToggleView.querySelector('span').textContent = 'Explorar Publicas';
    loadCollections();
});

btnDownloadCollection.addEventListener('click', () => {
    if (currentCollectionId) {
        downloadCollection(currentCollectionId, btnDownloadCollection);
    }
});

switchPublic.addEventListener('change', function() {
    updateSwitchLabels();
    if (!currentCollectionId || !currentIsOwner) return;
    
    fetch('api/colecciones/update?id=' + currentCollectionId, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            nombre: document.getElementById('detailTitle').textContent,
            icono: document.querySelector('#detailIcon svg')?.getAttribute('data-icon') || 'star',
            publica: switchPublic.checked 
        }),
        credentials: 'same-origin'
    })
    .then(function(response) {
        return response.json().then(function(data) {
            if (!response.ok || !data.ok) {
                throw new Error(data.mensaje || 'Error al actualizar');
            }
            return data;
        });
    })
    .then(function(data) {
        loadCollections();
    })
    .catch(function(error) {
        alert(error.message);
        switchPublic.checked = !switchPublic.checked;
        updateSwitchLabels();
    });
});

function loadCollectionDetail(id) {
    fetch('api/colecciones/get?id=' + id, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin'
    })
    .then(function(response) {
        return response.json().then(function(data) {
            if (!response.ok || !data.ok) {
                throw new Error(data.mensaje || 'Error al obtener detalles');
            }
            return data;
        });
    })
    .then(function(data) {
        const col = data.coleccion;
        const detailHeader = document.querySelector('.detail-header');
        document.getElementById('detailIcon').innerHTML = iconSVGs[col.icono] || iconSVGs.star;
        document.getElementById('detailTitle').textContent = col.nomCol;
        document.getElementById('statConseguidos').textContent = col.conseguidos + ' Conseguidos';
        document.getElementById('statDeseados').textContent = col.deseados + ' Deseados';
        document.getElementById('statTotal').textContent = col.totalItems + ' Total';
        
        if (col.imagenUrl) {
            detailHeader.style.backgroundImage = 'url("' + col.imagenUrl + '")';
            detailHeader.classList.add('has-image');
        } else {
            detailHeader.style.backgroundImage = '';
            detailHeader.classList.remove('has-image');
        }
        
        const pctCons = col.totalItems > 0 ? (col.conseguidos / col.totalItems) * 100 : 0;
        const pctDes = col.totalItems > 0 ? (col.deseados / col.totalItems) * 100 : 0;

        document.getElementById('detailProgressPercent').textContent = Math.round(pctCons) + '%';
        document.getElementById('detailProgressFillCons').style.width = pctCons + '%';
        document.getElementById('detailProgressFillDes').style.width = pctDes + '%';
        
        currentIsOwner = data.isOwner !== undefined ? data.isOwner : true;
        
        const addItemSection = document.getElementById('addItemSection');
        
        if (currentIsOwner && !inPublicBrowsingMode) {
            switchContainer.style.display = 'flex';
            switchPublic.checked = col.publica || false;
            updateSwitchLabels();
            btnDeleteCollection.style.display = 'flex';
            btnDownloadCollection.style.display = 'none';
            addItemSection.style.display = 'block';
        } else {
            switchContainer.style.display = 'none';
            btnDeleteCollection.style.display = 'none';
            btnDownloadCollection.style.display = 'flex';
            addItemSection.style.display = 'none';
        }
        
    })
    .catch(function(error) {
        console.error('Error:', error);
    });
}

function loadItems(coleccionId) {
    fetch('api/items/list?coleccion=' + coleccionId, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin'
    })
    .then(function(response) {
        return response.json().then(function(data) {
            if (!response.ok || !data.ok) {
                throw new Error(data.mensaje || 'Error al obtener items');
            }
            return data;
        });
    })
    .then(function(data) {
        renderItems(data.items);
    })
    .catch(function(error) {
        itemsList.innerHTML = '<div class="error-message">' + error.message + '</div>';
    });
}

function renderItems(items) {
    if (!items || items.length === 0) {
            if (currentIsOwner && !inPublicBrowsingMode) {
                itemsList.innerHTML = '<div class="empty-state"><p>No hay elementos en esta colección</p><span>Añade tu primer elemento arriba</span></div>';
            } else {
                itemsList.innerHTML = '<div class="empty-state"><p>No hay elementos en esta colección</p></div>';
            }
        return;
    }
    
    if (!currentIsOwner || inPublicBrowsingMode) {
    itemsList.innerHTML = items.map(function(item) {
        var imgHtml;
        if (item.imagenUrl) {
            imgHtml = '<img class="item-thumbnail" src="' + escapeHtml(item.imagenUrl) + '" alt="" width="40" height="40" loading="lazy">';
        } else {
            imgHtml = '<div class="item-thumbnail item-thumbnail-placeholder"><svg aria-hidden="true" viewBox="0 0 24 24" width="1.25rem" height="1.25rem" fill="currentColor"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg></div>';
        }
        return '<div class="item-card">' +
            '<div class="item-info">' +
                imgHtml +
                '<div style="display: flex; flex-direction: column; min-width: 0;">' +
                    '<span class="item-name">' + escapeHtml(item.nomItem) + '</span>' +
                    (item.observaciones ? '<span class="item-observaciones">' + escapeHtml(item.observaciones) + '</span>' : '') +
                '</div>' +
            '</div>' +
        '</div>';
    }).join('');
    return;
}

itemsList.innerHTML = items.map(function(item) {
        var imgHtml;
        if (item.imagenUrl) {
            imgHtml = '<img class="item-thumbnail" src="' + escapeHtml(item.imagenUrl) + '" alt="" width="40" height="40" loading="lazy">';
        } else {
            imgHtml = '<div class="item-thumbnail item-thumbnail-placeholder"><svg aria-hidden="true" viewBox="0 0 24 24" width="1.25rem" height="1.25rem" fill="currentColor"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg></div>';
        }

        var statusIcon, statusText, statusBtnClass;
        if (item.estado === 'conseguido') {
            statusIcon = '<svg aria-hidden="true" viewBox="0 0 24 24" width="0.875rem" height="0.875rem" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>';
            statusText = 'Conseguido';
            statusBtnClass = 'btn-status-conseguido';
        } else if (item.estado === 'deseado') {
            statusIcon = '<svg aria-hidden="true" viewBox="0 0 24 24" width="0.875rem" height="0.875rem" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>';
            statusText = 'Deseado';
            statusBtnClass = 'btn-status-deseado';
        } else {
            statusIcon = '';
            statusText = 'Ninguno';
            statusBtnClass = 'btn-status-ninguno';
        }
        
        var obsHtml = '<textarea class="item-observaciones-input" data-item-id="' + item.ideItem + '" placeholder="+ Observaciones" rows="1">' + escapeHtml(item.observaciones || '') + '</textarea>';

        return '<div class="item-card estado-' + item.estado + '" data-id="' + item.ideItem + '">' +
            '<div class="item-info">' +
                imgHtml +
                '<div style="display: flex; flex-direction: column; min-width: 0; flex: 1;">' +
                    '<span class="item-name">' + escapeHtml(item.nomItem) + '</span>' +
                    obsHtml +
                '</div>' +
            '</div>' +
            '<div class="item-actions">' +
                '<button class="btn-status ' + statusBtnClass + '" data-item-id="' + item.ideItem + '" data-status="' + item.estado + '">' +
                    statusIcon +
                    '<span>' + statusText + '</span>' +
                '</button>' +
                '<button class="btn-outline-danger" data-item-id="' + item.ideItem + '" data-action="delete">Eliminar</button>' +
            '</div>' +
        '</div>';
    }).join('');
}

function toggleItemStatus(itemId, status, checked) {
    const nuevoEstado = checked ? status : 'ninguno';
    
    fetch('api/items/update?id=' + itemId, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado }),
        credentials: 'same-origin'
    })
    .then(function(response) {
        return response.json().then(function(data) {
            if (!response.ok || !data.ok) {
                throw new Error(data.mensaje || 'Error al actualizar');
            }
            return data;
        });
    })
    .then(function(data) {
        loadItems(currentCollectionId);
        loadCollectionDetail(currentCollectionId);
        loadCollections();
    })
    .catch(function(error) {
        alert(error.message);
    });
}

function deleteItem(itemId) {
    showConfirmModal('Eliminar elemento', '¿Estás seguro de que quieres eliminar este elemento?', function() {
        fetch('api/items/delete?id=' + itemId, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'same-origin'
        })
        .then(function(response) {
            return response.json().then(function(data) {
                if (!response.ok || !data.ok) {
                    throw new Error(data.mensaje || 'Error al eliminar item');
                }
                return data;
            });
        })
        .then(function(data) {
            hideConfirmModal();
            loadItems(currentCollectionId);
            loadCollectionDetail(currentCollectionId);
            loadCollections();
        })
        .catch(function(error) {
            alert(error.message);
        });
    });
}

function deleteCollection(id, nombre) {
    showConfirmModal(
        'Eliminar coleccion',
        '¿Estas seguro de que quieres eliminar "' + nombre + '"? Esta accion eliminara la coleccion y todos sus items.',
        function() {
            fetch('api/colecciones/delete?id=' + id, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'same-origin'
            })
            .then(function(response) {
                return response.json().then(function(data) {
                    if (!response.ok || !data.ok) {
                        throw new Error(data.mensaje || 'Error al eliminar');
                    }
                    return data;
                });
            })
            .then(function(data) {
                hideConfirmModal();
                loadCollections();
            })
            .catch(function(error) {
                alert(error.message);
            });
        }
    );
}

btnDeleteCollection.addEventListener('click', function() {
    if (currentCollectionId) {
        showConfirmModal(
            'Eliminar coleccion',
            '¿Estas seguro? Esta accion eliminara la coleccion y todos sus items.',
            function() {
                fetch('api/colecciones/delete?id=' + currentCollectionId, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'same-origin'
                })
                .then(function(response) {
                    return response.json().then(function(data) {
                        if (!response.ok || !data.ok) {
                            throw new Error(data.mensaje || 'Error al eliminar');
                        }
                        return data;
                    });
                })
                .then(function(data) {
                    hideConfirmModal();
                    backToDashboard();
                })
                .catch(function(error) {
                    alert(error.message);
                });
            }
        );
    }
});

btnConfirmAction.addEventListener('click', () => {
    if (confirmCallback) {
        confirmCallback();
    }
});

btnCancelConfirm.addEventListener('click', hideConfirmModal);

confirmModal.addEventListener('click', (e) => {
    if (e.target === confirmModal) {
        hideConfirmModal();
    }
});

btnDeleteDatabase.addEventListener('click', function() {
    showConfirmModal(
        'Eliminar base de datos',
        '¿Estas seguro? Esta accion eliminara TODAS tus colecciones y items. No se puede deshacer.',
        function() {
            fetch('api/database/delete', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'same-origin'
            })
            .then(function(response) {
                return response.json().then(function(data) {
                    if (!response.ok || !data.ok) {
                        throw new Error(data.mensaje || 'Error al eliminar');
                    }
                    return data;
                });
            })
            .then(function(data) {
                hideConfirmModal();
                backToDashboard();
            })
            .catch(function(error) {
                alert(error.message);
            });
        }
    );
});

btnNewCollection.addEventListener('click', () => {
    modalOverlay.style.display = 'flex';
});

btnCancelModal.addEventListener('click', () => {
    modalOverlay.style.display = 'none';
    formNewCollection.reset();
    selectedIcon = 'star';
    updateIconSelection();
});

modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
        modalOverlay.style.display = 'none';
        formNewCollection.reset();
        selectedIcon = 'star';
        updateIconSelection();
    }
});

formAddItem.addEventListener('submit', async function(e) {
    e.preventDefault();
    const nombre = document.getElementById('itemNombre').value.trim();
    const estado = document.getElementById('itemEstado').value;
    const obsText = itemObservaciones.value.trim() || null;
    if (!nombre || !currentCollectionId) return;
    var imagenUrl = null;
    var fileInput = document.getElementById('itemImagenFile');
    if (fileInput.files && fileInput.files[0]) {
        try {
            imagenUrl = await readFileAsDataURL(fileInput.files[0]);
        } catch (err) {
            alert('Error al leer la imagen');
            return;
        }
    }
    fetch('api/items/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coleccion: currentCollectionId, nombre: nombre, estado: estado, imagenUrl: imagenUrl, observaciones: obsText }),
        credentials: 'same-origin'
    })
    .then(function(response) {
        return response.json().then(function(data) {
            if (!response.ok || !data.ok) {
                throw new Error(data.mensaje || 'Error al anadir item');
            }
            return data;
        });
    })
    .then(function(data) {
        document.getElementById('itemNombre').value = '';
        document.getElementById('itemEstado').value = 'ninguno';
        itemObservaciones.value = '';
        itemImagenFile.value = '';
        loadItems(currentCollectionId);
        loadCollectionDetail(currentCollectionId);
    })
    .catch(function(error) {
        alert(error.message);
    });
});

document.querySelector('.icon-options')?.addEventListener('click', (e) => {
    const opt = e.target.closest('.icon-option');
    if (!opt) return;
    selectedIcon = opt.dataset.icon;
    updateIconSelection();
});

formNewCollection.addEventListener('submit', async function(e) {
    e.preventDefault();
    const nombre = document.getElementById('collectionName').value.trim();
    if (!nombre) return;
    var imagenUrl = null;
    var fileInput = document.getElementById('collectionImage');
    if (fileInput.files && fileInput.files[0]) {
        try {
            imagenUrl = await readFileAsDataURL(fileInput.files[0]);
        } catch (err) {
            alert('Error al leer la imagen');
            return;
        }
    }
    fetch('api/colecciones/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: nombre, icono: selectedIcon, imagenUrl: imagenUrl }),
        credentials: 'same-origin'
    })
    .then(function(response) {
        return response.json().then(function(data) {
            if (!response.ok || !data.ok) {
                throw new Error(data.mensaje || 'Error al crear coleccion');
            }
            return data;
        });
    })
    .then(function(data) {
        modalOverlay.style.display = 'none';
        formNewCollection.reset();
        selectedIcon = 'star';
        updateIconSelection();
        document.getElementById('collectionImage').value = '';
        loadCollections();
    })
    .catch(function(error) {
        alert(error.message);
    });
});

function updateIconSelection() {
    document.querySelectorAll('.icon-option').forEach(opt => {
        opt.classList.toggle('selected', opt.dataset.icon === selectedIcon);
    });
}

function toggleAdminPanel() {
    if (adminSection.style.display === 'none') {
        dashboardSection.style.display = 'none';
        publicSection.style.display = 'none';
        detailSection.style.display = 'none';
        adminSection.style.display = 'flex';
        loadAdminCollections();
        loadAdminBannedUsers();
    } else {
        adminSection.style.display = 'none';
        dashboardSection.style.display = 'block';
        loadCollections();
    }
}

btnAdminPanel.addEventListener('click', toggleAdminPanel);
btnBackToApp.addEventListener('click', () => {
    adminSection.style.display = 'none';
    dashboardSection.style.display = 'block';
    loadCollections();
});

function loadAdminCollections() {
    fetch('api/admin/colecciones', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin'
    })
    .then(function(response) {
        return response.json().then(function(data) {
            if (!response.ok || !data.ok) {
                throw new Error(data.mensaje || 'Error al cargar colecciones');
            }
            return data;
        });
    })
    .then(function(data) {
        renderAdminCollections(data.colecciones);
    })
    .catch(function(error) {
        adminTableBody.innerHTML = '<tr><td colspan="4" class="error-message">' + error.message + '</td></tr>';
    });
}

function renderAdminCollections(colecciones) {
    if (!colecciones || colecciones.length === 0) {
        adminTableBody.innerHTML = '';
        document.querySelector('.admin-table').style.display = 'none';
        adminEmpty.style.display = 'flex';
        return;
    }
    
    document.querySelector('.admin-table').style.display = 'table';
    adminEmpty.style.display = 'none';

    adminTableBody.innerHTML = colecciones.map(col => {
        const ownerName = col.ownerName || 'Desconocido';
        return '<tr>' +
            '<td><strong>' + escapeHtml(col.nomCol) + '</strong></td>' +
            '<td>' + escapeHtml(ownerName) + '</td>' +
            '<td>' + col.totalItems + '</td>' +
            '<td class="admin-actions">' +
                '<button class="btn-admin-delete" data-action="admin-delete" data-id="' + col.ideCol + '" data-name="' + escapeHtml(col.nomCol) + '">Eliminar</button>' +
                '<button class="btn-admin-ban" data-action="admin-ban" data-user-id="' + col.ideUsu + '" data-name="' + escapeHtml(ownerName) + '">Banear</button>' +
            '</td>' +
        '</tr>';
    }).join('');
}

function adminDeleteCollection(id, nombre) {
    showConfirmModal(
        'Eliminar coleccion',
        '¿Estas seguro de que quieres eliminar la coleccion "' + nombre + '"? Esta accion no se puede deshacer.',
        function() {
            fetch('api/admin/colecciones/delete?id=' + id, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'same-origin'
            })
            .then(function(response) {
                return response.json().then(function(data) {
                    if (!response.ok || !data.ok) {
                        throw new Error(data.mensaje || 'Error al eliminar');
                    }
                    return data;
                });
            })
            .then(function(data) {
                hideConfirmModal();
                loadAdminCollections();
            })
            .catch(function(error) {
                alert(error.message);
            });
        }
    );
}

function adminBanUser(userId, username) {
    showConfirmModal(
        'Banear usuario',
        '¿Estas seguro de que quieres banear a "' + username + '"? Se eliminaran todas sus colecciones y no podra acceder a su cuenta.',
        function() {
            fetch('api/admin/usuarios/ban', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: userId }),
                credentials: 'same-origin'
            })
            .then(function(response) {
                return response.json().then(function(data) {
                    if (!response.ok || !data.ok) {
                        throw new Error(data.mensaje || 'Error al banear');
                    }
                    return data;
                });
            })
            .then(function(data) {
                hideConfirmModal();
                loadAdminCollections();
                alert('Usuario baneado y colecciones eliminadas');
            })
            .catch(function(error) {
                alert(error.message);
            });
        }
    );
}

function loadAdminBannedUsers() {
    fetch('api/admin/usuarios/banned', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin'
    })
    .then(function(response) {
        return response.json().then(function(data) {
            if (!response.ok || !data.ok) {
                throw new Error(data.mensaje || 'Error al cargar usuarios baneados');
            }
            return data;
        });
    })
    .then(function(data) {
        renderAdminBannedUsers(data.usuarios);
    })
    .catch(function(error) {
        adminBannedBody.innerHTML = '<tr><td colspan="2" class="error-message">' + error.message + '</td></tr>';
    });
}

function renderAdminBannedUsers(usuarios) {
    if (!usuarios || usuarios.length === 0) {
        adminBannedBody.innerHTML = '';
        document.querySelectorAll('.admin-table')[1].style.display = 'none';
        adminBannedEmpty.style.display = 'flex';
        return;
    }
    
    document.querySelectorAll('.admin-table')[1].style.display = 'table';
    adminBannedEmpty.style.display = 'none';

    adminBannedBody.innerHTML = usuarios.map(usu => {
        return '<tr>' +
            '<td>' + escapeHtml(usu.nomUsu) + '</td>' +
            '<td class="admin-actions">' +
                '<button class="btn-admin-unban" data-action="admin-unban" data-id="' + usu.ideUsu + '" data-name="' + escapeHtml(usu.nomUsu) + '">Desbanear</button>' +
            '</td>' +
        '</tr>';
    }).join('');
}

function adminUnbanUser(userId, username) {
    showConfirmModal(
        'Desbanear usuario',
        '¿Estas seguro de que quieres desbanear a "' + username + '"? Podra volver a acceder a su cuenta.',
        function() {
            fetch('api/admin/usuarios/unban', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: userId }),
                credentials: 'same-origin'
            })
            .then(function(response) {
                return response.json().then(function(data) {
                    if (!response.ok || !data.ok) {
                        throw new Error(data.mensaje || 'Error al desbanear');
                    }
                    return data;
                });
            })
            .then(function(data) {
                hideConfirmModal();
                loadAdminBannedUsers();
                alert('Usuario desbaneado correctamente');
            })
            .catch(function(error) {
                alert(error.message);
            });
        }
    );
}

function checkSession() {
    fetch('api/colecciones/list', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin'
    })
    .then(function(response) {
        if (response.ok) {
            return response.json().then(function(data) {
                if (data.ok) {
                    currentUser = { nomUsu: data.nomUsu };
                    userDisplay.textContent = data.nomUsu;
                    isAdmin = data.esAdmin === true;
                    updateHeaderUI();
                    publicSection.style.display = 'none';
                    dashboardSection.style.display = 'block';
                    inPublicBrowsingMode = false;
                    isPublicView = false;
                    renderCollections(data.colecciones);
                }
            });
        }
    })
    .catch(function(error) { console.error('Error al verificar sesion:', error); });
}

document.addEventListener('DOMContentLoaded', () => {
    loadPublicCollections();
    checkSession();
});

function openImageModal(url) {
    if (!url) return;
    imageModalImg.src = url;
    imageModal.style.display = 'flex';
}

function closeImageModal() {
    imageModal.style.display = 'none';
    imageModalImg.src = '';
}

btnCloseImageModal.addEventListener('click', closeImageModal);

imageModal.addEventListener('click', function(e) {
    if (e.target === imageModal) {
        closeImageModal();
    }
});

itemsList.addEventListener('click', function(e) {
    const statusBtn = e.target.closest('.btn-status');
    if (statusBtn) {
        e.preventDefault();
        const itemId = parseInt(statusBtn.dataset.itemId);
        const currentStatus = statusBtn.dataset.status;
        let nextStatus;
        if (currentStatus === 'ninguno') {
            nextStatus = 'conseguido';
        } else if (currentStatus === 'conseguido') {
            nextStatus = 'deseado';
        } else {
            nextStatus = 'ninguno';
        }
        toggleItemStatus(itemId, nextStatus, nextStatus !== 'ninguno');
        return;
    }

    const deleteBtn = e.target.closest('[data-action="delete"]');
    if (deleteBtn) {
        e.preventDefault();
        const itemId = parseInt(deleteBtn.dataset.itemId);
        deleteItem(itemId);
        return;
    }

    const obsInput = e.target.closest('.item-observaciones-input');
    if (obsInput) {
        return;
    }

    const img = e.target.closest('.item-thumbnail');
    if (img && img.tagName === 'IMG') {
        openImageModal(img.src);
        return;
    }
});

collectionsGrid.addEventListener('click', function(e) {
    const deleteBtn = e.target.closest('.collection-card-delete');
    if (deleteBtn) {
        e.stopPropagation();
        const card = deleteBtn.closest('.collection-card');
        if (card) {
            const id = parseInt(card.dataset.id);
            const name = card.dataset.name;
            deleteCollection(id, name);
        }
        return;
    }

    const card = e.target.closest('.collection-card');
    if (card) {
        const id = parseInt(card.dataset.id);
        openCollection(id);
    }
});

itemsList.addEventListener('focusout', function(e) {
    const textarea = e.target.closest('.item-observaciones-input');
    if (!textarea) return;
    const itemId = parseInt(textarea.dataset.itemId);
    if (!itemId) return;
    var oldValue = textarea.defaultValue || '';
    var newValue = textarea.value.trim();
    if (newValue === oldValue) return;
    fetch('api/items/update?id=' + itemId, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ observaciones: newValue || '' }),
        credentials: 'same-origin'
    })
    .then(function(response) {
        return response.json().then(function(data) {
            if (!response.ok || !data.ok) {
                throw new Error(data.mensaje || 'Error al actualizar');
            }
            return data;
        });
    })
    .then(function(data) {
        loadItems(currentCollectionId);
    })
    .catch(function(error) {
        alert(error.message);
    });
});

publicGrid.addEventListener('click', function(e) {
    const downloadBtn = e.target.closest('[data-action="download"]');
    if (downloadBtn) {
        e.stopPropagation();
        const card = downloadBtn.closest('.collection-card');
        if (card) {
            const id = parseInt(card.dataset.id);
            downloadCollection(id, downloadBtn);
        }
        return;
    }

    const card = e.target.closest('.collection-card');
    if (card) {
        const id = parseInt(card.dataset.id);
        openPublicCollection(id);
    }
});

adminTableBody.addEventListener('click', function(e) {
    const deleteBtn = e.target.closest('[data-action="admin-delete"]');
    if (deleteBtn) {
        const id = parseInt(deleteBtn.dataset.id);
        const name = deleteBtn.dataset.name;
        adminDeleteCollection(id, name);
        return;
    }

    const banBtn = e.target.closest('[data-action="admin-ban"]');
    if (banBtn) {
        const userId = parseInt(banBtn.dataset.userId);
        const name = banBtn.dataset.name;
        adminBanUser(userId, name);
    }
});

adminBannedBody.addEventListener('click', function(e) {
    const unbanBtn = e.target.closest('[data-action="admin-unban"]');
    if (unbanBtn) {
        const id = parseInt(unbanBtn.dataset.id);
        const name = unbanBtn.dataset.name;
        adminUnbanUser(id, name);
    }
});


