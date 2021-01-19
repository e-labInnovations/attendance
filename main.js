const modal = document.querySelector('.modal');
const inputRegNo = document.getElementById('regNo');
const inputRollNo = document.getElementById('rollNo');
const inputName = document.getElementById('name');


// The following code is based off a toggle menu by @Bradcomp
// source: https://gist.github.com/Bradcomp/a9ef2ef322a8e8017443b626208999c1
(function() {})();

const validateRegNo = () => {
  let regNo = inputRegNo.value;
  if (regNo.length !== 8) {
    inputRegNo.classList.remove('is-success')
    inputRegNo.classList.add('is-danger')
  } else {
    inputRegNo.classList.remove('is-danger')
    inputRegNo.classList.add('is-success')
  }
}

const validateRollNo = () => {
  let regNo = inputRegNo.value;
  let rollNo = inputRollNo.value;
  validateRegNo();
  if (rollNo.length == 0 || rollNo.length > 2) {
    inputRollNo.classList.remove('is-success')
    inputRollNo.classList.add('is-danger')
  } else {
    inputRollNo.classList.remove('is-danger')
    inputRollNo.classList.add('is-success')
  }
}

const addAttendance = () => {
  let regNo = inputRegNo.value;
  let rollNo = inputRollNo.value;
  if (regNo.length !== 8 || rollNo.length == 0 || rollNo.length > 2) {
    showModal("Error", "Please enter correct Register No and Roll Number")
  } else {

    axios.get('https://script.google.com/a/gptcthirurangadi.in/macros/s/AKfycbzY-4QPZVlbBd_apLUEdaEA2SintrJ4YQ0BIPOExGHWBeptnGg/exec', {
        action:'getStudent',
        regNo,
        rollNo
      })
      .then(function(response) {
        console.log(response);
      })
      .catch(function(error) {
        console.log(error);
      });
  }
}

const showModal = (title, message, status) => {
  let modalCardTitle = document.querySelector('.modal-card-title');
  let modalCardBody = document.querySelector('.modal-card-body');
  modalCardTitle.innerHTML = title;
  modalCardBody.innerHTML = message;
  modal.classList.add('is-active');
}

const closeModal = () => {
  modal.classList.remove('is-active')
}