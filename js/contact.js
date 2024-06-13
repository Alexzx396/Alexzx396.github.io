document.getElementById('miFormulario').addEventListener('submit', function(event) {
    event.preventDefault();
  
    let data = {
      personalizations: [
        {
          to: [{ email: 'arcealex257@gmail.com' }],
          subject: 'Nuevo mensaje del formulario de contacto'
        }
      ],
      from: { email: 'sender@example.com' },
      content: [
        {
          type: 'text/plain',
          value: document.getElementById('exampleFormControlTextarea1').value
        }
      ]
    };
  
    fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer TU_API_KEY'
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  });
  