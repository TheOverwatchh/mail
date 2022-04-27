document.addEventListener('DOMContentLoaded', function() {
  // By default, load the inbox
  load_mailbox('inbox');

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);


});

function compose_email(way, id) {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#single-email-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  if(way == "reply") {
    fetch(`/emails/${id}`)
    .then(response => response.json())
    .then(email => {
      var email = email;

    document.querySelector('#compose-recipients').value = email.sender;
    document.querySelector('#compose-subject').value = 'Re: ' + email.subject;
    document.querySelector('#compose-body').value = 'On ' + email.timestamp + ', ' +email.sender + ' wrote: ' + email.body;
    })} else {
    document.querySelector('#compose-recipients').value = '';
    document.querySelector('#compose-subject').value = '';
    document.querySelector('#compose-body').value = '';
  }
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#single-email-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';

  //get emails 
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
      var receivedEmails = emails;

    
      // Show the mailbox
      document.querySelector('#emails-view').innerHTML = `
      <h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>
      <ul id="email-display-list">
           
      </ul>
    `
     receivedEmails.forEach(email => {
       //create and style the element for the sender
          var sender = document.createElement('span');
          sender.innerHTML = email.sender;
          sender.classList.add= "sender";
       // create and style the element for the timestamp   
          var timestamp = document.createElement('small');
          timestamp.classList.add('timestamp');
          timestamp.innerHTML= email.timestamp;
       // create and style the elemento for the li   
          var li = document.createElement('li');

          console.log(email.read)
          
          if(email.read == true){
            li.classList.add('single-email-read');
          } else {
            li.classList.add('single-email-nonread');
          }
          li.innerHTML = `${email.subject}`;
       //create and style the element for the button for arquive
          var btn = document.createElement('button');
          btn.classList.add('btn');    
          btn.classList.add('btn-secondary');
          btn.classList.add('btn-arquive');
          var i = document.createElement('i');
          i.classList.add('fas');
          i.classList.add('fa-envelope');  
          btn.appendChild(i);
       // incorporate those elements inside the ul and li   
        const ul = document.querySelector('#email-display-list');
        ul.appendChild(li);
        li.appendChild(sender);
        li.appendChild(btn);
        li.appendChild(timestamp);


        li.onclick = function() {
          const id = email.id //workin
          load_email(id) // workin
        }

        btn.onclick = function() {
          //reconhecer o exato email no qual o botão foi apertado
          const id = email.id // working 
          const archived = email.archived
          //alternar o status do email
          if(archived == true) {
            fetch(`/emails/${id}`, {
              method: 'PUT',
              body: JSON.stringify({
                  archived: false
              })
            })
            .then(() => document.location.reload(true))
          } else {
            fetch(`/emails/${id}`, {
              method: 'PUT',
              body: JSON.stringify({
                  archived: true
              })
            })
            .then(() => document.location.reload(true))
          }
          
        }
     });
  })
  return false
}

function send_email() {
   const recipients  = document.querySelector('input#compose-recipients').value;
   const subject  = document.querySelector('input#compose-subject').value;
   const body  = document.querySelector('textarea#compose-body').value;


   if (recipients == '' || subject == '' || body == '') {
     document.querySelector('#alert').innerHTML = 'All the fields are needed.';
   } else {
    fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
        recipients: recipients,
        subject: subject,
        body: body
      })
    })
    .then(response => response.json())
    .then(result => {
      console.log(result);
    });
    load_mailbox('sent');
   }
}

function load_email(id) {
   // Show email view and hide other views
   document.querySelector('#emails-view').style.display = 'none';
   document.querySelector('#single-email-view').style.display = 'block';
   document.querySelector('#compose-view').style.display = 'none';
 
  fetch(`/emails/${id}`)
  .then(response => response.json())
  .then(email => {
    var email = email;
  

    

  document.querySelector('span#sender-space').innerHTML = email.sender
  document.querySelector('small#timestamp-space').innerHTML = email.timestamp
  document.querySelector('span#recipients-space').innerHTML = email.recipients
  document.querySelector('h2#subject-space').innerHTML = email.subject
  document.querySelector('p#body-space').innerHTML = email.body

  document.querySelector('#replytheemail').onclick = function() {
    //alert(email.id) workin
    compose_email('reply', email.id)
    return false
  }

});

fetch(`/emails/${id}`, {
  method: 'PUT',
  body: JSON.stringify({
      read: true 
  })
})



}

