async function getWorks() {
    const worksResponse = await fetch("http://localhost:5678/api/works");
  
    return await worksResponse.json();
  }
  
  // Fonction pour ajouter une section de portfolio avec un projet
function createPortfolioSection() {
    // Créer les éléments
    const section = document.createElement('section');
    const title = document.createElement('h2');
    const galleryDiv = document.createElement('div');
    const figure = document.createElement('figure');
    const img = document.createElement('img');
    const figCaption = document.createElement('figcaption');
  
    // Définir les attributs et le contenu des éléments
    section.id = 'portfolio';
    title.innerText = 'Mes Projets';
    galleryDiv.className = 'gallery';
    img.src = 'assets/images/abajour-tahina.png';
    img.alt = 'Abajour Tahina';
    figCaption.innerText = 'Abajour Tahina';
  
    // Assembler les éléments
    figure.appendChild(img);
    figure.appendChild(figCaption);
    galleryDiv.appendChild(figure);
    section.appendChild(title);
    section.appendChild(galleryDiv);
  
    // Ajouter la section au document
    document.body.appendChild(section);
  }
  
  // Appeler la fonction pour créer la section de portfolio
  createPortfolioSection();
  