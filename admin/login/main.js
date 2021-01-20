const modal = document.querySelector('.modal');
const inputUsername = document.querySelector('#username');
const inputPassword = document.querySelector('#password');
const inputSubmit = document.querySelector('#submit');

var adminToken = null;



if (localStorage.getItem('adminToken')) {
  adminToken = localStorage.getItem('adminToken');
  alert('adminToken exist:', adminToken);
  window.location = '/admin'
}

const handleSubmit = () => {
  let username = inputUsername.value;
  let password = inputPassword.value;
  
  alert(username + password)
}


const showModal = (title, message, status) => {
  let modalCardTitle = document.querySelector('.modal-card-title');
  let modalCardBody = document.querySelector('.modal-card-body');
  modalCardTitle.innerHTML = title;
  modalCardBody.innerHTML = message;
  if (status == 'error') {
    modal.classList.remove('has-background-success')
    modal.classList.add('has-background-danger')
  } else if (status == 'success') {
    modal.classList.add('has-background-success')
    modal.classList.remove('has-background-danger')
  }
  modal.classList.add('is-active');
}

const closeModal = () => {
  modal.classList.remove('is-active');
}