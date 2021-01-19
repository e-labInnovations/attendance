const modal = document.querySelector('.modal');
const inputRegNo = document.getElementById('regNo');
const inputRollNo = document.getElementById('rollNo');
const inputName = document.getElementById('name');
const avatar = document.getElementById('avatar');
const title = document.querySelector('.title')

var student = {};
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
  let regNo = inputRegNo.value;
  let rollNo = inputRollNo.value;
  if (regNo.length !== 8 || rollNo.length == 0 || rollNo.length > 2) {
    showModal("Error", "Please enter correct Register No and Roll Number")
  } else {
    if (!(regNo && rollNo)) {
      localStorage.setItem('regNo', regNo);
      localStorage.setItem('rollNo', rollNo);
    }
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
        showModal("Error", response.data.message);
      }
    })
    .catch(function(error) {
      //inputName.parentNode.classList.remove('is-loading');
      //inputName.placeholder = 'Name';
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
  
  if(parameter.subject){
    title.innerText = parameter.subject;
  
  if (regNo && rollNo) {
    inputRegNo.value = regNo;
    inputRollNo.value = rollNo;
    inputRegNo.disabled = true;
    inputRollNo.disabled = true;
    setStudent(regNo, rollNo);
  }
  } else {}
  
})();