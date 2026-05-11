const authScreen = document.getElementById('authScreen');
const appScreen = document.getElementById('appScreen');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const loginError = document.getElementById('loginError');
const registerError = document.getElementById('registerError');
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
const publicBadge = document.getElementById('publicBadge');
const btnToggleView = document.getElementById('btnToggleView');
const btnBackToMy = document.getElementById('btnBackToMy');
const publicSection = document.getElementById('publicSection');
const publicGrid = document.getElementById('publicGrid');
const publicEmpty = document.getElementById('publicEmpty');
const modalOverlay = document.getElementById('modalOverlay');
const btnCancelModal = document.getElementById('btnCancelModal');
const formNewCollection = document.getElementById('formNewCollection');
const formAddItem = document.getElementById('formAddItem');
const itemsList = document.getElementById('itemsList');
const confirmModal = document.getElementById('confirmModal');
const confirmTitle = document.getElementById('confirmTitle');
const confirmMessage = document.getElementById('confirmMessage');
const btnCancelConfirm = document.getElementById('btnCancelConfirm');
const btnConfirmAction = document.getElementById('btnConfirmAction');

let currentUser = null;
let currentCollectionId = null;
let selectedIcon = 'star';
let confirmCallback = null;

let isPublicView = false;
let currentIsOwner = false;
let inPublicBrowsingMode = false;
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

function showError(element, message) {
    element.textContent = message;
    element.classList.add('visible');
}

function hideError(element) {
    element.classList.remove('visible');
}

function showScreen(screen) {
    if (screen === 'auth') {
        authScreen.style.display = 'flex';
        appScreen.style.display = 'none';
    } else {
        authScreen.style.display = 'none';
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

document.querySelectorAll('.auth-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
        tab.classList.add('active');
        const target = tab.dataset.tab;
        if (target === 'login') {
            loginForm.classList.add('active');
        } else {
            registerForm.classList.add('active');
        }
        hideError(loginError);
        hideError(registerError);
    });
});

loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    hideError(loginError);
    
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    if (!username || !password) {
        showError(loginError, 'Completa todos los campos');
        return;
    }
    
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
        currentUser = data.usuario;
        userDisplay.textContent = currentUser.nomUsu;
        isAdmin = data.esAdmin === true;
        btnAdminPanel.style.display = isAdmin ? 'flex' : 'none';
        showScreen('app');
        loadCollections();
    })
    .catch(function(error) {
        showError(loginError, error.message);
    });
});

registerForm.addEventListener('submit', function(e) {
    e.preventDefault();
    hideError(registerError);
    
    const username = document.getElementById('registerUsername').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    
    if (!username || !email || !password) {
        showError(registerError, 'Completa todos los campos');
        return;
    }
    
    if (username.length < 3) {
        showError(registerError, 'El usuario debe tener al menos 3 caracteres');
        return;
    }
    
    if (password.length < 6) {
        showError(registerError, 'La contraseña debe tener al menos 6 caracteres');
        return;
    }
    
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
    .then(function(data) {
        currentUser = data.usuario;
        userDisplay.textContent = currentUser.nomUsu;
        showScreen('app');
        loadCollections();
    })
    .catch(function(error) {
        showError(registerError, error.message);
    });
});

btnLogout.addEventListener('click', function() {
    fetch('/api/auth/logout', { method: 'POST', credentials: 'same-origin' })
    .catch(function(error) {
        console.error('Error al cerrar sesion:', error);
    })
    .then(function() {
        currentUser = null;
        currentCollectionId = null;
        isAdmin = false;
        btnAdminPanel.style.display = 'none';
        adminSection.style.display = 'none';
        loginForm.reset();
        registerForm.reset();
        hideError(loginError);
        hideError(registerError);
        showScreen('auth');
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

async function openPublicCollection(id) {
    currentCollectionId = id;
    inPublicBrowsingMode = isPublicView;
    dashboardSection.style.display = 'none';
    publicSection.style.display = 'none';
    detailSection.style.display = 'block';
    await loadCollectionDetail(id);
    loadItems(id);
}

function downloadCollection(id, btnElement) {
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
                throw new Error(data.mensaje || 'Error al descargar');
            }
            return data;
        });
    })
    .then(function(data) {
        if (btnElement) {
            btnElement.classList.add('downloaded');
            btnElement.querySelector('span').textContent = 'Descargada';
        }
        
        alert('Colección descargada exitosamente');
    })
    .catch(function(error) {
        alert(error.message);
    });
}

function renderCollections(colecciones) {
    if (!colecciones || colecciones.length === 0) {
        collectionsGrid.style.display = 'none';
        dashboardEmpty.style.display = 'block';
        return;
    }
    
    collectionsGrid.style.display = 'grid';
    dashboardEmpty.style.display = 'none';
    
    const trashIcon = '<svg role="img" aria-label="Eliminar" viewBox="0 0 24 24" width="1rem" height="1rem" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>';
    
    collectionsGrid.innerHTML = colecciones.map(col => {
        const porcentaje = col.totalItems > 0 ? Math.round((col.conseguidos / col.totalItems) * 100) : 0;
        const publicBadge = col.publica ? '<span class="public-badge" style="margin-left: 0.5rem;">Pública</span>' : '';
        
        return '<div class="collection-card" data-id="' + col.ideCol + '">' +
            '<div style="display: flex; justify-content: space-between; align-items: start;">' +
                '<div class="collection-card-icon" style="flex: 1; margin-bottom: 0.5rem;" onclick="openCollection(' + col.ideCol + ')">' +
                    (iconSVGs[col.icono] || iconSVGs.star) +
                    '<span>' + col.nomCol + '</span>' +
                    publicBadge +
                '</div>' +
                '<button class="collection-card-delete" onclick="deleteCollection(' + col.ideCol + ', \'' + col.nomCol + '\')" title="Eliminar coleccion">' +
                    trashIcon +
                '</button>' +
            '</div>' +
            '<div class="collection-card-count" onclick="openCollection(' + col.ideCol + ')">' + col.conseguidos + '/' + col.totalItems + '</div>' +
            '<div class="collection-card-wish" onclick="openCollection(' + col.ideCol + ')">' + col.deseados + ' en lista de deseos</div>' +
            '<div class="collection-card-progress" onclick="openCollection(' + col.ideCol + ')">' +
                '<div class="collection-card-progress-conseguidos" style="width: ' + (col.totalItems > 0 ? (col.conseguidos / col.totalItems) * 100 : 0) + '%"></div>' +
                '<div class="collection-card-progress-deseados" style="width: ' + (col.totalItems > 0 ? (col.deseados / col.totalItems) * 100 : 0) + '%"></div>' +
            '</div>' +
        '</div>';
    }).join('');
}

function renderPublicCollections(colecciones) {
    if (!colecciones || colecciones.length === 0) {
        publicGrid.style.display = 'none';
        publicEmpty.style.display = 'block';
        return;
    }
    
    publicGrid.style.display = 'grid';
    publicEmpty.style.display = 'none';
    
    const downloadIcon = '<svg role="img" aria-label="Descargar" viewBox="0 0 24 24" width="1rem" height="1rem" fill="currentColor"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>';
    
    publicGrid.innerHTML = colecciones.map(col => {
        return '<div class="collection-card" data-id="' + col.ideCol + '">' +
            '<div class="collection-card-icon" onclick="openPublicCollection(' + col.ideCol + ')">' +
                (iconSVGs[col.icono] || iconSVGs.star) +
                '<span>' + col.nomCol + '</span>' +
                '<span class="public-badge" style="margin-left: 0.5rem;">Por ' + (col.ownerName || 'Anónimo') + '</span>' +
            '</div>' +
            '<div style="font-size: 0.8rem; color: var(--color-text-secondary); margin-bottom: 0.75rem;">' +
                col.totalItems + ' item' + (col.totalItems !== 1 ? 's' : '') +
            '</div>' +
            '<button class="btn-download" onclick="downloadCollection(' + col.ideCol + ', this)" title="Descargar coleccion">' +
                downloadIcon +
                '<span>Descargar</span>' +
            '</button>' +
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

function backToDashboard() {
    currentCollectionId = null;
    detailSection.style.display = 'none';
    if (isPublicView) {
        publicSection.style.display = 'block';
        loadPublicCollections();
    } else {
        inPublicBrowsingMode = false;
        dashboardSection.style.display = 'block';
        loadCollections();
    }
}

btnBack.addEventListener('click', backToDashboard);

btnToggleView.addEventListener('click', toggleView);

btnBackToMy.addEventListener('click', () => {
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
        if (switchPublic.checked) {
            publicBadge.style.display = 'inline-block';
        } else {
            publicBadge.style.display = 'none';
        }
        
        loadCollections();
    })
    .catch(function(error) {
        alert(error.message);
        switchPublic.checked = !switchPublic.checked;
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
        document.getElementById('detailIcon').innerHTML = iconSVGs[col.icono] || iconSVGs.star;
        document.getElementById('detailTitle').textContent = col.nomCol;
        document.getElementById('statConseguidos').textContent = col.conseguidos + ' Conseguidos';
        document.getElementById('statDeseados').textContent = col.deseados + ' Deseados';
        document.getElementById('statTotal').textContent = col.totalItems + ' Total';
        
        const obtenidosPct = col.totalItems > 0 ? (col.conseguidos / col.totalItems) * 100 : 0;
        const deseadosPct = col.totalItems > 0 ? (col.deseados / col.totalItems) * 100 : 0;
        const porcentaje = col.totalItems > 0 ? Math.round((col.conseguidos / col.totalItems) * 100) : 0;
        
        document.getElementById('detailProgressPercent').textContent = porcentaje + '%';
        
        const progressBar = document.getElementById('detailProgressBar');
        progressBar.innerHTML = '<div class="detail-progress-obtained" style="width: ' + obtenidosPct + '%"></div>' +
                               '<div class="detail-progress-wished" style="width: ' + deseadosPct + '%"></div>';
        
        currentIsOwner = data.isOwner !== undefined ? data.isOwner : true;
        
        const addItemSection = document.getElementById('addItemSection');
        
        if (currentIsOwner && !inPublicBrowsingMode) {
            switchContainer.style.display = 'flex';
            switchPublic.checked = col.publica || false;
            btnDeleteCollection.style.display = 'flex';
            btnDownloadCollection.style.display = 'none';
            publicBadge.style.display = col.publica ? 'inline-block' : 'none';
            addItemSection.style.display = 'block';
        } else {
            switchContainer.style.display = 'none';
            btnDeleteCollection.style.display = 'none';
            btnDownloadCollection.style.display = 'flex';
            publicBadge.style.display = 'inline-block';
            publicBadge.textContent = 'Pública - Por ' + (col.ownerName || 'Anónimo');
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
            itemsList.innerHTML = '<div class="empty-state"><p>No hay items en esta coleccion</p><span>Añade tu primer item abajo</span></div>';
        } else {
            itemsList.innerHTML = '<div class="empty-state"><p>No hay items en esta coleccion</p></div>';
        }
        return;
    }
    
    if (!currentIsOwner || inPublicBrowsingMode) {
        itemsList.innerHTML = '<div class="public-items-list">' +
            items.map(item => '<div class="public-item-name">' + item.nomItem + '</div>').join('') +
        '</div>';
        return;
    }
    
    itemsList.innerHTML = items.map(item => {
        const tiene = item.estado === 'conseguido';
        const deseado = item.estado === 'deseado';
        const badgeClass = 'badge-' + item.estado;
        const badgeText = item.estado === 'conseguido' ? '✓ Conseguido' : 
                          item.estado === 'deseado' ? '★ Deseado' : '- Ninguno';
        
        return '<div class="item-card estado-' + item.estado + '" data-id="' + item.ideItem + '">' +
            '<div class="item-checkboxes">' +
                '<label class="item-checkbox ' + (tiene ? 'checked' : '') + '">' +
                    '<input type="checkbox" ' + (tiene ? 'checked' : '') + ' onchange="toggleItemStatus(' + item.ideItem + ', \'conseguido\', this.checked)">' +
                    '<span>Tengo</span>' +
                '</label>' +
                '<label class="item-checkbox ' + (deseado ? 'checked' : '') + '">' +
                    '<input type="checkbox" ' + (deseado ? 'checked' : '') + ' onchange="toggleItemStatus(' + item.ideItem + ', \'deseado\', this.checked)">' +
                    '<span>Deseo</span>' +
                '</label>' +
            '</div>' +
            '<span class="item-name">' + item.nomItem + '</span>' +
            '<span class="item-status-badge ' + badgeClass + '">' + badgeText + '</span>' +
            '<button class="item-delete-btn" onclick="deleteItem(' + item.ideItem + ')">Eliminar</button>' +
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
    if (!confirm('¿Estas seguro de que quieres eliminar este item?')) {
        return;
    }
    
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
        loadItems(currentCollectionId);
        loadCollectionDetail(currentCollectionId);
        loadCollections();
    })
    .catch(function(error) {
        alert(error.message);
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

formAddItem.addEventListener('submit', function(e) {
    e.preventDefault();
    const nombre = document.getElementById('itemNombre').value.trim();
    const estado = document.getElementById('itemEstado').value;
    if (!nombre || !currentCollectionId) return;
    fetch('api/items/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coleccion: currentCollectionId, nombre: nombre, estado: estado }),
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

formNewCollection.addEventListener('submit', function(e) {
    e.preventDefault();
    const nombre = document.getElementById('collectionName').value.trim();
    if (!nombre) return;
    fetch('api/colecciones/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: nombre, icono: selectedIcon }),
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
        adminSection.style.display = 'block';
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
        adminEmpty.style.display = 'block';
        return;
    }
    
    document.querySelector('.admin-table').style.display = 'table';
    adminEmpty.style.display = 'none';
    
    const deleteIcon = '<svg role="img" aria-label="Eliminar" viewBox="0 0 24 24" width="1rem" height="1rem" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>';
    const banIcon = '<svg role="img" aria-label="Banear usuario" viewBox="0 0 24 24" width="1rem" height="1rem" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM4 12c0-4.42 3.58-8 8-8 1.85 0 3.55.63 4.9 1.69L5.69 16.9C4.63 15.55 4 13.85 4 12zm8 8c-1.85 0-3.55-.63-4.9-1.69L18.31 7.1C19.37 8.45 20 10.15 20 12c0 4.42-3.58 8-8 8z"/></svg>';
    
    adminTableBody.innerHTML = colecciones.map(col => {
        const ownerName = col.ownerName || 'Desconocido';
        return '<tr>' +
            '<td>' + (iconSVGs[col.icono] || iconSVGs.star) + ' ' + col.nomCol + '</td>' +
            '<td>' + ownerName + '</td>' +
            '<td>' + col.totalItems + '</td>' +
            '<td class="admin-actions">' +
                '<button class="btn-admin-delete" onclick="adminDeleteCollection(' + col.ideCol + ', \'' + col.nomCol.replace(/'/g, "\\'") + '\')" title="Eliminar">' + deleteIcon + ' Eliminar</button>' +
                '<button class="btn-admin-ban" onclick="adminBanUser(' + col.ideUsu + ', \'' + ownerName.replace(/'/g, "\\'") + '\')" title="Banear usuario">' + banIcon + ' Banear</button>' +
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
        adminBannedEmpty.style.display = 'block';
        return;
    }
    
    document.querySelectorAll('.admin-table')[1].style.display = 'table';
    adminBannedEmpty.style.display = 'none';
    
    const unbanIcon = '<svg role="img" aria-label="Desbanear usuario" viewBox="0 0 24 24" width="1rem" height="1rem" fill="currentColor"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>';
    
    adminBannedBody.innerHTML = usuarios.map(usu => {
        return '<tr>' +
            '<td>' + usu.nomUsu + '</td>' +
            '<td class="admin-actions">' +
                '<button class="btn-admin-unban" onclick="adminUnbanUser(' +usu.ideUsu + ', \'' + usu.nomUsu.replace(/'/g, "\\'") + '\')" title="Desbanear usuario">' + unbanIcon + ' Desbanear</button>' +
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
                    renderCollections(data.colecciones);
                    showScreen('app');
                } else {
                    showScreen('auth');
                }
            });
        } else {
            showScreen('auth');
        }
    })
    .catch(function(error) {
        showScreen('auth');
    });
}

document.addEventListener('DOMContentLoaded', () => {
    checkSession();
});
