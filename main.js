const modal = document.querySelector('.modal');
const inputRegNo = document.getElementById('regNo');
const inputRollNo = document.getElementById('rollNo');
const inputName = document.getElementById('name');
const api = "https://script.google.com/macros/s/AKfycbyGwfwpGj18FB9kbLo4J-zml08bxTgWfLquMdoo6h6m2PwaXQsnkuUy7w/exec";

const CancelToken = axios.CancelToken;
let cancel;

// The following code is based off a toggle menu by @Bradcomp
// source: https://gist.github.com/Bradcomp/a9ef2ef322a8e8017443b626208999c1
(function() {})();

const validateRegNo = () => {
  let regNo = inputRegNo.value;
  let rollNo = inputRollNo.value;
  if (regNo.length !== 8) {
    inputRegNo.classList.remove('is-success')
    inputRegNo.classList.add('is-danger')
  } else {
    inputRegNo.classList.remove('is-danger')
    inputRegNo.classList.add('is-success');
    if (!(rollNo.length == 0 || rollNo.length > 2)) {
      setStudent(regNo, rollNo);
    }
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
    if (regNo.length == 8) {
      console.log('ok');
      setStudent(regNo, rollNo);
    }
  }
}

const addAttendance = () => {
  let regNo = inputRegNo.value;
  let rollNo = inputRollNo.value;
  if (regNo.length !== 8 || rollNo.length == 0 || rollNo.length > 2) {
    showModal("Error", "Please enter correct Register No and Roll Number")
  } else {}
}

const setStudent = (regNo, rollNo) => {
  let url = `${api}?action=getStudent&regNo=${regNo}&rollNo=${rollNo}`;
  inputName.classList.add('is-loading');

  // Cancel previous request
  if (cancel !== undefined) {
    cancel();
  }
  axios.get(url, {
      cancelToken: new CancelToken(function executor(c) {
        cancel = c;
      }),
    })
    .then(function(response) {
      inputName.classList.remove('is-loading');
      if (response.data.status) {
        inputName.value = response.data.name;
      } else {
        showModal("Error", response.data.message);
      }
    })
    .catch(function(error) {
      inputName.classList.remove('is-loading');
      if (axios.isCancel(error)) {
        console.log("post Request canceled");
      } else {
        showModal("Error", error)
      }
    });
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