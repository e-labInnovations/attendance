const modal = document.querySelector('.modal');
const inputRegNo = document.getElementById('regNo');
const inputRollNo = document.getElementById('rollNo');
const inputName = document.getElementById('name');
const avatar = document.getElementById('avatar');
const title = document.querySelector('.title')
const form = document.getElementById('form');
const submit = document.getElementById('submit');
const msg = document.getElementById('msg');

var isOpen = true;
var student = { status: false };
var subject = null;
const api = "https://script.google.com/macros/s/AKfycbyGwfwpGj18FB9kbLo4J-zml08bxTgWfLquMdoo6h6m2PwaXQsnkuUy7w/exec";

const CancelToken = axios.CancelToken;
let cancel;

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
      setStudent(regNo, rollNo);
    }
  }
}

const addAttendance = () => {
  if (!student.status) {
    showModal("Error", "Student not found please fill the form and wait for student name", 'error')
  } else {
    if (!(localStorage.getItem('regNo') && localStorage.getItem('rollNo'))) {
      localStorage.setItem('regNo', student.regNo);
      localStorage.setItem('rollNo', student.rollNo);
    }

    submit.classList.add('is-loading');
    let url = `${api}?action=addAttendance&subject=${subject}&regNo=${student.regNo}&rollNo=${student.rollNo}`;
    axios.get(url)
      .then(function(response) {
        submit.classList.remove('is-loading');
        localStorage.setItem(subject, true);
        submit.remove();
        inputRegNo.disabled = true;
        inputRollNo.disabled = true;
        msg.innerHTML = `
                      <p class="has-text-grey">
                        You are submitted your attendance.
                      </p>
                      `
        if (response.data.success) {
          showModal('Success', response.data.message, 'success');
        } else {
          showModal('Error', response.data.message, 'error');
        }
      })
      .catch(function(error) {
        submit.classList.remove('is-loading');
        showModal("Error", error, 'error')
      });
  }
}

const setStudent = (regNo, rollNo) => {
  let url = `${api}?action=getStudent&regNo=${regNo}&rollNo=${rollNo}`;
  inputName.parentNode.classList.add('is-loading');
  inputName.placeholder = 'Please Wait Fetching...';
  inputName.value = '';

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
      inputName.parentNode.classList.remove('is-loading');
      if (response.data.status) {
        student = response.data;
        inputName.value = student.name;
        avatar.src = 'https://ui-avatars.com/api/?size=128&background=random&length=1&name=' + student.name;
      } else {
        showModal("Error", response.data.message, 'error');
      }
    })
    .catch(function(error) {
      //inputName.parentNode.classList.remove('is-loading');
      //inputName.placeholder = 'Name';
      if (axios.isCancel(error)) {
        console.log("get Request canceled");
      } else {
        showModal("Error", error, 'error')
      }
    });
}

const checkIsOpen = (subject) => {
  let url = `${api}?action=isOpen&subject=${subject}`;
  submit.innerText = 'Loading..';
  axios.get(url)
    .then(function(response) {
      submit.innerText = 'Submit';
      isOpen = response.data.isOpen;
      if (!isOpen) {
        submit.remove();
        msg.innerHTML = `
        <p class="has-text-grey">
          The form ${response.data.subject} is no longer accepting new attendance.
          Try contacting <span class="has-text-danger"> Shivani </span> if you think this is a mistake.
        </p>
        `
      } else {
        submit.disabled = false;
      }
    })
    .catch(function(error) {
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

const getParameter = () => {
  var pairs = window.location.search.substring(1).split("&"),
    obj = {},
    pair,
    i;

  for (i in pairs) {
    if (pairs[i] === "") continue;

    pair = pairs[i].split("=");
    obj[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
  }

  return obj;
}

(function() {
  let parameter = getParameter();
  let regNo = localStorage.getItem('regNo');
  let rollNo = localStorage.getItem('rollNo');

  if (parameter.subject) {
    subject = parameter.subject;
    title.innerText = subject;
    checkIsOpen(subject);

    if (localStorage.getItem(subject)) {
      submit.remove();
      msg.innerHTML = `
              <p class="has-text-grey">
                You already submitted your attendance.
                Try contacting <span class="has-text-danger"> Shivani </span> if you think this is a mistake.
              </p>
              `
    }

    if (regNo && rollNo) {
      inputRegNo.value = regNo;
      inputRollNo.value = rollNo;
      inputRegNo.disabled = true;
      inputRollNo.disabled = true;
      setStudent(regNo, rollNo);
    }
  } else {
    form.innerHTML = `<h1> Home </h1>`
  }

})();