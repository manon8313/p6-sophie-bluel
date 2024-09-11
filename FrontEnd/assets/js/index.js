// Fonction pour obtenir les œuvres depuis l'API
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
  
//fonction pour les images de la galerie
async function renderWorks() {
    const works = await getWorks();
    const gallery = document.querySelector('.gallery');
    gallery.innerHTML = '';

    for (const work of works) {
        //creer les elements
        const figure = document.createElement('figure');
        const img = document.createElement('img');
        const figcaption = document.createElement('figcaption');

        // contenu aux elements
        img.src = work.imageUrl;
        img.alt = work.title;
        figcaption.innerText = work.title;
        figure.setAttribute('data-categoryid', work.category.id);
        figure.setAttribute('data-id', work.id);

        //element au DOM
        figure.appendChild(img);
        figure.appendChild(figcaption);
        gallery.appendChild(figure);
    }
}

// Appeler la fonction pour afficher les œuvres lorsque la page est chargée
document.addEventListener('DOMContentLoaded', renderWorks);


//Fonction pour obtenir les œuvres depuis l'API
async function getCategories() {
    const categoriesResponse = await fetch("http://localhost:5678/api/categories");
    if (!categoriesResponse.ok) {
      throw new Error('Network response was not ok');
    }
    return await categoriesResponse.json();{
        console.error('Il y a eu un problème avec la récupération des œuvres:', error);
        return [];
      }
}


  

  