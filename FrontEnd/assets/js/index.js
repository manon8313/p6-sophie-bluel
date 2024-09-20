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
      figure.setAttribute('data-categoryid', work.categoryId); // Assuming work has a categoryId

      // Ajouter les éléments dans le DOM
      figure.appendChild(img);
      figure.appendChild(figcaption);
      gallery.appendChild(figure);
  });
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
    let isLoggedIn = true; // Remplace par la logique réelle (par ex. en vérifiant un token)

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
















