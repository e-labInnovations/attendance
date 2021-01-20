const modal = document.querySelector('.modal');


var adminToken = null;


if (localStorage.getItem('adminToken')) {
  adminToken = localStorage.getItem('adminToken');
  alert('adminToken exist:', adminToken);
} else {
  alert('You are not logged in. Please login first');
  window.location = '/admin/login'
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

// The following code is based off a toggle menu by @Bradcomp
// source: https://gist.github.com/Bradcomp/a9ef2ef322a8e8017443b626208999c1
(function() {
    var burger = document.querySelector('.burger');
    var menu = document.querySelector('#'+burger.dataset.target);
    burger.addEventListener('click', function() {
        burger.classList.toggle('is-active');
        menu.classList.toggle('is-active');
    });
})();
 