async function init(){
    // Fait appel à la fonction work qui récupère les travaux et qui les affiche grace à la fonction displayWorks
    const works = await getWorks();
    displayWorks(works);

    // Faire appel à la récupération des catégories doit se faire UNIQUEMENT si je ne suis PAS connecté
    //  Ternaire :
    // Variable = condition ? valeur si vrai : valeur si faux
    const token = localStorage.getItem('token') ? localStorage.getItem('token') : null;

    if(!token){
        const categories = await getCategories();
        displayFilters(categories, works);
    } else {
        // Cacher l'élément de filtre si connecté
        document.querySelector('.filter').style.display = 'none';
        //peupler la modale 
        populateWorks(works)
    }

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
            if (articleToDelete) {
                articleToDelete.remove();
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

// Fonction pour remplir les œuvres dans la galerie
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
          const filteredWorks = filterWorks(works, categoryId);
          displayWorks(filteredWorks); // Afficher les œuvres filtrées
      }
  });
}

// // Appeler la fonction pour afficher les filtres et les œuvres lorsque la page est chargée
// document.addEventListener('DOMContentLoaded', renderFiltersAndWorks);

    // Variable simulant l'état de connexion de l'utilisateur
    let isLoggedIn = true; 

    // Sélectionner l'élément <li> avec l'ID "login-btn"
    const loginButton = document.getElementById('login-btn');

    // Fonction pour mettre à jour l'interface en fonction de l'état de connexion
    function updateLoginStatus() {
        if (isLoggedIn) {
            // Transformer le mot "Login" en "Logout" si l'utilisateur est connecté
            loginButton.textContent = 'Logout';
            console.log('Utilisateur connecté');
        } else {
            // Sinon afficher "Login"
            loginButton.textContent = 'Login';
            console.log('Utilisateur déconnecté');
        }
    }

    // Gérer le clic sur le bouton login/logout
    loginButton.addEventListener('click', function() {
        if (isLoggedIn) {
            // Lorsqu'on clique sur "Logout" :
            localStorage.removeItem('token'); 
            isLoggedIn = false; 
            
            // Rediriger l'utilisateur vers la page d'accueil
            window.location.href = 'http://127.0.0.1:5500/FrontEnd/login.html'; 
        } else {
            // Rediriger vers la page de login ou toute autre action de connexion
            window.location.href = '/login'; 
        }
    });

    // Appeler la fonction dès le chargement de la page pour afficher le bon état
    updateLoginStatus();


    // Récupérer les éléments du DOM
    const modifyButton = document.getElementById('modifier-btn');
    const modal = document.getElementById('mondal1');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const modalImage = document.getElementById('modalImage');

    // Fonction pour ouvrir la modale
    function openModifyModal(imageUrl) {
        modal.setAttribute('aria-hidden', 'false'); 
        modal.showModal(); 
    }

   //(à remplacer par la véritable URL)
    const work = { imageUrl: 'http://127.0.0.1:5500/FrontEnd/imageUrl' }; 


    modifyButton.addEventListener('click', () => {
        openModifyModal(work.imageUrl); 
        console.log('marche')
    });


    // Gestionnaire d'événements pour fermer la modale
    closeModalBtn.addEventListener('click', () => {
        modal.setAttribute('aria-hidden', 'true'); 
        modal.close();
    });

// Gestionnaire d'événements pour fermer la modale en cliquant en dehors (sur l'overlay)
    modal.addEventListener('click', (event) => {
    const rect = modal.querySelector('.modal-wrapper').getBoundingClientRect();
    
    // Vérifier si le clic est en dehors de la modale (modal-wrapper)
    if (!(event.clientX >= rect.left && event.clientX <= rect.right &&
          event.clientY >= rect.top && event.clientY <= rect.bottom)) {
        modal.setAttribute('aria-hidden', 'true');
        modal.close(); 
    }
});

 

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


document.addEventListener('DOMContentLoaded', () => {
    // Récupération des éléments
    const modal1 = document.getElementById('mondal1');
    const modal2 = document.getElementById('mondal2');
    const openPhotoButton = document.getElementById('photoButton');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const arrowPrevious = document.getElementById('arrowPrevious');

    // Ouvrir le premier modal
    document.getElementById('modifier-btn').addEventListener('click', () => {
        modal1.showModal(); // Affiche le premier modal
    });

    // Ouvrir le deuxième modal en fermant le premier
    openPhotoButton.addEventListener('click', () => {
        modal1.close(); // Ferme le premier modal
        modal2.showModal(); // Ouvre le deuxième modal
    });

    // Fermer le premier modal
    closeModalBtn.addEventListener('click', () => {
        modal1.close();
    });

    // Fermer le deuxième modal
    arrowPrevious.addEventListener('click', () => {
        modal2.close();
    });
});











