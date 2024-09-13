//vérifier les deux champs ne sont pas vide (a l'envoie du formulaire)
const loginButton = document.querySelector('.loginButton')
loginButton.addEventListener('click', (e) => {
    e.preventDefault()
    console.log('kjjh')
})
    //si un des deux champs est vide afficher un message d'erreure
    //si les champs sont correctement remplis faire appel a l'api

//les deux champs sont remplis:
    //si le login ou le mot de passe nest pas bon afficher un message d'erreure
    //si tous est bon enregirstre le token dans le localStorage et redirige sur le page d'accueil










// appel Api

async function postuserlogin() {
    try {
        const worksResponse = await fetch("http://localhost:5678/api/users/login");
        if (!worksResponse.ok) {
            throw new Error('Network response was not ok');
        }
        return await worksResponse.json();
    } catch (error) {
        console.error('Il y a eu un problème avec la récupération des œuvres:', error);
        return [];
    }
  }


