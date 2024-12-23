async function init(){
    // Fait appel à la fonction work qui récupère les travaux et qui les affiche grace à la fonction displayWorks
    const works = await getWorks();
    displayWorks(works);

    // Faire appel à la récupération des catégories doit se faire UNIQUEMENT si je ne suis PAS connecté
    //  Ternaire :
    // Variable = condition ? valeur si vrai : valeur si faux
    const token = localStorage.getItem('token') ? localStorage.getItem('token') : null;

    // Si l'utilisateur n'est PAS connecté
    if(!token){
        const categories = await getCategories();
        displayFilters(categories, works);
        return; // la fonction init s'arrête ici si on entre dans le if
    } 

    // Si on arrive ici, l'utilisateur est connecté

    // Cacher l'élément de filtre si connecté
    document.querySelector('.filter').style.display = 'none';
    //peupler la modale 
    populateWorks(works)

    
    // On affiche le bandeau "edition"
     // Création dynamique du bandeau "édition"
     const modeEditionBanner = document.createElement('div');
     modeEditionBanner.id = 'modeedition';
     modeEditionBanner.innerHTML = '<h2><i class="fa-regular fa-pen-to-square"></i> Mode Édition</h2>';
     document.body.insertBefore(modeEditionBanner, document.querySelector('header'));
 
     modeEditionBanner.style.display = 'block';
     console.log("Bandeau d'édition affiché:", modeEditionBanner.style.display);

    // On affiche le bouton "modifier"
    const modifierBtn = `<div class="container">
                            <i class="fa-regular fa-pen-to-square"></i>
                            <button id="modifier-btn">Modifier</button>
                        </div>`
    document.querySelector('.main-container').insertAdjacentHTML('beforeend', modifierBtn);
    
    modalEvent();

    // On change "Login" en "Logout"
    updateLoginStatus();


}
init()


// appel Api

async function getWorks() {
  try {
      const worksResponse = await fetch("http://localhost:5678/api/works");
      if (!worksResponse.ok) {
          throw new Error('Network response was not ok');
      }
      return await worksResponse.json();
  } catch (error) {
      console.error('Il y a eu un problème avec la récupération des œuvres:', error);
      return [];
  }
}

async function getCategories() {
  try {
      const categoriesResponse = await fetch("http://localhost:5678/api/categories");
      if (!categoriesResponse.ok) {
          throw new Error('Network response was not ok');
      }
      return await categoriesResponse.json();
  } catch (error) {
      console.error('Il y a eu un problème avec la récupération des catégories:', error);
      return [];
  }
}

// Fonction pour afficher les œuvres dans la galerie
function displayWorks(works) {
  const gallery = document.querySelector('.gallery');
  gallery.innerHTML = '';

  works.forEach(work => {
      // Créer les éléments pour chaque œuvre
      const figure = document.createElement('figure');
      const img = document.createElement('img');
      const figcaption = document.createElement('figcaption');

      // Assigner les propriétés aux éléments
      img.src = work.imageUrl;
      img.alt = work.title;
      figcaption.innerText = work.title;
      figure.setAttribute('data-categoryid', work.categoryId);
      figure.setAttribute('data-id', work.id);

      // Ajouter les éléments dans le DOM
      figure.appendChild(img);
      figure.appendChild(figcaption);
      gallery.appendChild(figure);
  });
}


// Fonction pour attacher les événements de suppression
function attachDeleteEvents() {
    const trashIcons = document.querySelectorAll('.fa-trash-can');
    trashIcons.forEach(icon => {
        icon.addEventListener('click', async (event) => {
            const workId = event.target.getAttribute('data-id');  
            console.log(`Suppression de l'élément avec l'ID : ${workId}`);

            // Supprimer l'article du DOM
            const articleToDelete = document.querySelector(`article[data-id="${workId}"]`);
            const figureToDelete = document.querySelector(`figure[data-id="${workId}"]`);
            if (articleToDelete && figureToDelete) {
                articleToDelete.remove();
                figureToDelete.remove();
            }

            // Appeler l'API pour supprimer l'élément côté serveur
            try {
                await deleteWork(workId);
                console.log(`Élément avec l'ID ${workId} supprimé côté serveur.`);
            } catch (error) {
                console.error(`Erreur lors de la suppression de l'élément avec l'ID ${workId} :`, error);
            }
        });
    });
}

// Fonction pour remplir les œuvres dans la modal
function populateWorks(works) {
    const gallery = document.querySelector('.gallery-modal');
    gallery.innerHTML = ''; 

    works.forEach(work => {
        const article = `
            <article data-id="${work.id}">
                <img src="${work.imageUrl}" alt="${work.title}">
                <i class="fa-solid fa-trash-can" data-id="${work.id}"></i>
            </article>`;
        
        gallery.insertAdjacentHTML("afterbegin", article); 
    });

    // Attacher les événements de suppression après avoir ajouté les articles dans le DOM
    attachDeleteEvents();
}


// Fonction pour filtrer les œuvres par catégorie
function filterWorks(works, categoryId) {
    if (categoryId === 'all') {
        return works; // Si 'Tous' est sélectionné, afficher toutes les œuvres
    }
    return works.filter(work => work.categoryId == categoryId);
  }
  
  // Fonction pour gérer les filtres et les œuvres
  async function displayFilters(categories, works) {
  
      const filter = document.querySelector('.filter');
      
      // Vérifiez que l'élément `.filter` existe
      if (!filter) {
          console.error("L'élément avec la classe 'filter' n'a pas été trouvé dans le DOM.");
          return;
      }
  
      // Ajouter le bouton "Tous" par défaut
      filter.innerHTML = '<button type="button" data-id="all">Tous</button>';
  
      // Créer un bouton pour chaque catégorie
      categories.forEach(category => {
          const button = document.createElement('button');
          button.type = 'button';
          button.textContent = category.name;
          button.setAttribute('data-id', category.id);
  
          filter.appendChild(button);
      });
  
      // Gérer les événements de clic sur les boutons de filtre
      filter.addEventListener('click', (event) => {
          const categoryId = event.target.getAttribute('data-id');
  
          if (categoryId) {
              // Retirer la classe active de tous les boutons
              document.querySelectorAll('.filter button').forEach(button => {
                  button.classList.remove('active');
              });
  
              // Ajouter la classe active au bouton cliqué
              event.target.classList.add('active');
  
              // Filtrer les œuvres et afficher les œuvres filtrées
              const filteredWorks = filterWorks(works, categoryId);
              displayWorks(filteredWorks); // Afficher les œuvres filtrées
          }
      });
  }
  


    function updateLoginStatus() {
        const loginButton = document.getElementById('login-btn');
        loginButton.textContent = 'Logout';
        // Gérer le clic sur le bouton login/logout
        loginButton.addEventListener('click', () => {
            // Lorsqu'on clique sur "Logout" :
            localStorage.removeItem('token'); 
            
            // Rediriger l'utilisateur vers la page d'accueil
            window.location.href = 'login.html'; 
        });
    }

    const modalEvent = () => {
        const modal1 = document.getElementById('mondal1');
        const modal2 = document.getElementById('mondal2');
        const openPhotoButton = document.getElementById('photoButton');
        const closeModalBtn1 = document.getElementById('closeModalBtn'); // Modale 1
        const closeModalBtn2 = document.getElementById('closeModal2Btn'); // Modale 2
        const arrowPrevious = document.getElementById('arrowPrevious');
    
        // Fonction pour ouvrir une modale et mettre à jour l'accessibilité
        function openModal(modal) {
            modal.setAttribute('aria-hidden', 'false');
            modal.showModal();
        }
    
        

        // Ouvrir le premier modal
        document.getElementById('modifier-btn').addEventListener('click', () => {
            openModal(modal1);
        });
    
        // Ouvrir le deuxième modal en fermant le premier
        openPhotoButton.addEventListener('click', () => {
            modal1.close(); 
            openModal(modal2);
        });
    
        // Fermer le premier modal
        closeModalBtn1.addEventListener('click', () => {
            modal1.close();
            modal1.setAttribute('aria-hidden', 'true');
        });
    
        // Fermer le deuxième modal
        closeModalBtn2.addEventListener('click', () => {
            modal2.close(); 
            resetForm();
            modal2.setAttribute('aria-hidden', 'true');
        });

           // Gérer le clic de la flèche pour revenir à la modale 1
           arrowPrevious.addEventListener('click', () => {
            modal2.close(); // Ferme la modale 2
            resetForm();
            openModal(modal1);  // Rouvre la modale 1
            });
         
             // Gérer la fermeture de la modale en cliquant à l'extérieur
        [modal1, modal2].forEach(modal => {
            modal.addEventListener('click', (event) => {
                const backdrop = document.querySelector('dialog:-internal-dialog-in-top-layer::backdrop')
                if(backdrop == null){
                    modal.close();
                    modal.setAttribute('aria-hidden', 'true');
                    resetForm();
                }
            });

            modal.querySelector('.modal-wrapper').addEventListener('click', (event) => {
                event.stopPropagation(); // Empêche la propagation de l'événement click vers le modal
            });
        });
    
    }

    function resetForm() {
        const previewImage = document.getElementById('previewImage');
        previewImage.src = '#';
        previewImage.style.display = 'none';

        const title = document.querySelector('#title')
        title.value = "";

        const category = document.querySelector('#category-input')
        category.selectedIndex = 0;
    }



// Appel de l'API pour supprimer une œuvre
async function deleteWork(workId) {
    try {
        const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.ok) {
            console.log(`L'œuvre avec l'ID ${workId} a été supprimée du serveur.`);
        } else if (response.status === 401) {
            console.error('Erreur 401 : non autorisé, token invalide ou expiré.');
        } else {
            console.error('Erreur lors de la suppression sur le serveur.');
        }
    } catch (error) {
        console.error('Il y a eu un problème lors de la suppression:', error);
    }
}



// Fonction pour gérer la soumission du formulaire d'ajout d'œuvre
document.getElementById('form-add-new-work').addEventListener('submit', async (event) => {
    event.preventDefault(); // Empêche le rechargement de la page

    const fileInput = document.getElementById('file');
    const titleInput = document.getElementById('title');
    const categoryInput = document.getElementById('category-input');

    const formData = new FormData();
    formData.append('image', fileInput.files[0]);
    formData.append('title', titleInput.value);
    formData.append('category', categoryInput.value);

    try {
        const response = await fetch("http://localhost:5678/api/works", {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: formData,
        });

        if (response.ok) {
            const newWork = await response.json();
            console.log('Nouvelle œuvre ajoutée:', newWork);

            // Mettre à jour l'affichage des œuvres
            const works = await getWorks(); // Récupère toutes les œuvres
            displayWorks(works);
            populateWorks(works);

            // Fermer la modale
            document.getElementById('mondal2').close();

             // Réinitialiser le formulaire
             resetForm();
             
        } else {
            console.error('Erreur lors de l\'ajout de l\'œuvre:', response.statusText);
        }
    } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'œuvre:', error);
    }
});




document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-add-new-work');
    const fileInput = document.getElementById('file');
    const titleInput = document.getElementById('title');
    const categoryInput = document.getElementById('category-input');
    const previewImage = document.getElementById('previewImage');
    const errorContainer1 = document.getElementById('errorContainer1');
    const button = document.getElementById('submitBtn');

    // Fonction pour afficher un message d'erreur
    function showError(message) {
        errorContainer1.innerHTML = `<p style="color: red;">${message}</p>`;
    }

    // Image preview handler
    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        
        if (file) {
            const fileSizeInMB = file.size / (1024 * 1024); 
            const validTypes = ['image/jpeg', 'image/png'];

            // Validation du type et de la taille
            if (!validTypes.includes(file.type)) {
                showError('Seules les images JPG et PNG sont acceptées.');
                fileInput.value = '';
                previewImage.style.display = 'none';
                return;
            }

            if (fileSizeInMB > 4) {
                showError('La taille de l\'image doit être inférieure à 4 Mo.');
                fileInput.value = ''; 
                previewImage.style.display = 'none';
                return;
            }

            // Prévisualisation de l'image sélectionnée
            const reader = new FileReader();
            reader.onload = function(e) {
                previewImage.src = e.target.result;
                previewImage.style.display = 'block'; 
            };
            reader.readAsDataURL(file);
        } else {
            previewImage.src = '#';
            previewImage.style.display = 'none'; 
        }
    });

    
    form.addEventListener('input', () => {
        // Utilise checkValidity pour valider tous les champs
        const isValid = form.checkValidity();
        button.style.backgroundColor = isValid ? '#1D6154' : 'grey';
        button.disabled = !isValid; // Désactive le bouton tant que le formulaire n'est pas valide
    });

    // Soumission du formulaire
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Reset error messages
        errorContainer1.innerHTML = '';

        // Validate title and category
        const title = titleInput.value.trim();
        const category = categoryInput.value;

        if (!title || !category) {
            showError('Le titre et la catégorie sont requis.');
            return;
        }

        const file = fileInput.files[0];
        if (!file) {
            showError('Veuillez sélectionner une image.');
            return;
        }

        const formData = new FormData();
        formData.append('image', file);
        formData.append('title', title);
        formData.append('category', category);

        try {
            const response = await fetch('http://localhost:5678/api/works', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const responseData = await response.json();
                console.log('Photo ajoutée avec succès:', responseData);
                window.location.href = 'gallery.html'; 

                // Mise à jour de la galerie
                const works = await getWorks();
                displayWorks(works);

                // Fermer la modale
                document.getElementById('mondal2').close();

                  // Ajouter la nouvelle image à la galerie sans recharger la page
                    addImageToGallery(newWork.imageUrl, title);

                    // Réinitialiser le formulaire
                    resetForm();
                    previewImage.style.display = 'none';
                    errorContainer1.textContent = '';


            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erreur lors de l\'ajout de la photo.');
            }

        } catch (error) {
            showError(error.message);
        }
    });

    function validerEtReset() {
        const form = document.getElementById('form-add-new-work');
        if (form) {
            form.reset(); // Réinitialise le formulaire
        }
    }
    

    
});