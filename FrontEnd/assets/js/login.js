document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForms');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const errorContainer = document.getElementById('errorContainer');

   
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault(); 

        // Récupérer les valeurs des champs
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        // Réinitialiser le message d'erreur
        errorContainer.innerHTML = '';

        // Vérifier que les champs ne sont pas vides
        if (!email || !password) {
            errorContainer.innerHTML = '<p style="color: red;">Les champs email et mot de passe sont requis.</p>';
            return;
        }

        // Préparer les données pour l'appel API
        const data = {
            email: email,
            password: password,
        };

        try {
            // Faire l'appel API en POST à la route /users/login
            const response = await fetch('http://localhost:5678/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            // Vérifier si la réponse est dans la plage des codes de succès (200-299)
            if (response.ok) {
                // Convertir la réponse en JSON
                const responseData = await response.json();
                // Vérifier la présence du token dans la réponse
                if (responseData.token) {
                    // Stocker le token dans le localStorage
                    localStorage.setItem('token', responseData.token);
                    console.log('Token stocké dans le localStorage.');
                    // Rediriger vers la page d'accueil ou une autre page
                    window.location.href = '/';
                } else {
                    throw new Error('Token manquant dans la réponse.');
                }
            } else {
                // Obtenir et lancer une erreur basée sur le message de l'API
                const errorData = await response.json();
                throw new Error(errorData.message || 'Informations de connexion incorrectes.');
            }

        } catch (error) {
            // Afficher un message d'erreur si l'appel échoue
            errorContainer.innerHTML = `<p style="color: red;">${error.message}</p>`;
        }
    });
});

function storeToken(token) {
    localStorage.setItem('token', token);


}




