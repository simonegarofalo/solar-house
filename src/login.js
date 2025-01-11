// login.js
document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("login-form");
  
    form.addEventListener("submit", async function (e) {
      e.preventDefault();
  
      // Raccogli i dati dal form
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
  
      // Prepara i dati per la richiesta
      const userData = {
        email: email,
        password: password,
      };
  
      try {
        // Invia la richiesta POST al backend per il login
        const response = await fetch("http://localhost:3000/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        });
  
        const result = await response.json();
  
        if (response.ok) {
          // Se il login è riuscito, mostra il messaggio di successo
          console.log("Login riuscito:", result);
          alert(result.message);  // Mostra un alert con il messaggio
          // Puoi fare altre operazioni come il salvataggio delle informazioni dell'utente (localStorage, cookie)
        } else {
          // Se c'è un errore, mostra il messaggio di errore
          console.error("Errore nel login:", result);
          alert(result.message);  // Mostra un alert con l'errore
        }
      } catch (error) {
        console.error("Errore nella richiesta:", error);
        alert("Si è verificato un errore nel tentativo di login.");
      }
    });
  });
  