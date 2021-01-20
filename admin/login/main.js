const modal = document.querySelector('.modal');
const inputUsername = document.querySelector('#username');
const inputPassword = document.querySelector('#password');
const inputSubmit = document.querySelector('#submit');

var adminToken = null;


const handleSubmit = () => {
  let username = inputUsername.value;
  let password = inputPassword.value;

  if (username.length == 0 || password.length == 0) {
    return showModal('Error', 'Some feilds are empty', 'error')
  }

  submit.classList.add('is-loading');
  let url = `${api}?action=login&username=${username}&password=${password}`;
  axios.get(url)
    .then(function(response) {
      submit.classList.remove('is-loading');
      if (response.data.status) {
        localStorage.setItem('adminToken', response.data.userToken);
        let subject = sessionStorage.getItem('subject');
        let link = subject ? '/admin?subject=' + subject : '/admin';
        window.location.replace(link);
        if (subject)
          sessionStorage.removeItem('subject')
      } else {
        showModal('Error', response.data.message, 'error');
      }
    })
    .catch(function(error) {
      submit.classList.remove('is-loading');
      showModal("Error", error, 'error')
    });
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

if (localStorage.getItem('adminToken')) {
  adminToken = localStorage.getItem('adminToken');
  showModal("Alert", 'You are already logged in. Please logout', 'error');
  window.location.replace('/admin');
}