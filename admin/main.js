const modal = document.querySelector('.modal');
const studentsCount = document.querySelector('#studentsCount');
const table = document.querySelector('#table');
const formStatus = document.querySelector('#formStatus');
const statusText = document.querySelector('#statusText');
const numbersArea = document.querySelector('#numbersArea');
const content = document.querySelector('#content');
const subjectText = document.querySelector('#subject');


var adminToken = null;
var subject = null;
var attendanceData = null;

formStatus.addEventListener('change', (e) => {
  let newStatus = e.target.checked;
  statusText.innerText = 'Loading..';
  let url = `${api}?action=changeSubjectStatus&userToken=${adminToken}&subject=${subject}&newState=${newStatus}`;
  axios.get(url)
    .then(function(response) {
      if (response.data.status) {
        statusText.innerText = response.data.isActive ? 'Enabled' : 'Disabled';
        if (response.data.isActive) {
          alertify.success('Enabled');
        } else {
          alertify.error('Disabled');
        }
      } else {
        if (response.data.autherized) {
          showModal('Error', response.data.message, 'error');
        } else {
          showModal('Error', response.data.message, 'error');
          localStorage.removeItem('adminToken');
          window.location = '/admin/login'
        }
      }
    })
    .catch(function(error) {
      showModal("Error", error, 'error')
    });
})
const getAttendance = (subject) => {
  let url = `${api}?action=getAttendance&userToken=${adminToken}&subject=${subject}`;
  axios.get(url)
    .then(function(response) {
      attendanceData = response.data;
      if (attendanceData.status) {
        formStatus.checked = attendanceData.isActive;
        statusText.innerText = attendanceData.isActive ? 'Enabled' : 'Disabled';
        studentsCount.innerText = attendanceData.attendees.length;
        updateAttendees(attendanceData.attendees);
      } else {
        if (attendanceData.autherized) {
          showModal('Error', attendanceData.message, 'error');
        } else {
          showModal('Error', attendanceData.message, 'error');
          localStorage.removeItem('adminToken');
          window.location = '/admin/login'
        }
      }
    })
    .catch(function(error) {
      showModal("Error", error, 'error')
    });
}

const updateAttendees = (attendees) => {
  let attendeesNos = attendees.map(student => student.rollNo).join('\n');
  numbersArea.value = attendeesNos;
  table.innerHTML = '';
  attendees.forEach((student) => {
    var formattedDate = moment(student.date, 'YYYY-MM-DDThh:mm:ss:sssZ').format('hh:mmA DD/MM/YY');
    var newRow = table.insertRow();
    var cell0 = newRow.insertCell();
    var text0 = document.createElement('span');
    text0.className = 'tag is-black';
    text0.innerText = student.student.rollNo;
    cell0.appendChild(text0);
    var cell1 = newRow.insertCell();
    var text1 = document.createTextNode(student.student.name);
    cell1.appendChild(text1);
    var cell2 = newRow.insertCell();
    cell2.classList.add('level-right')
    var text2 = document.createElement('span');
    var text2 = document.createTextNode(formattedDate);
    cell2.appendChild(text2);
  })
}
const shareAttendance = async () => {
  let shareData = {
    text: numbersArea.value
  }

  try {
    await navigator.share(shareData)
    alertify.success('Success');
  } catch (err) {
    alertify.error('Error: ' + err);
  }
}

const copyAttendance = () => {
  copyToClipboard(numbersArea);
  alertify.success('Copied');
}

const logout = () => {
  localStorage.removeItem('adminToken');
  window.location = './login';
}

const copyToClipboard = (elem) => {
  // create hidden text element, if it doesn't already exist
  var targetId = "_hiddenCopyText_";
  var isInput = elem.tagName === "INPUT" || elem.tagName === "TEXTAREA";
  var origSelectionStart, origSelectionEnd;
  if (isInput) {
    // can just use the original source element for the selection and copy
    target = elem;
    origSelectionStart = elem.selectionStart;
    origSelectionEnd = elem.selectionEnd;
  } else {
    // must use a temporary form element for the selection and copy
    target = document.getElementById(targetId);
    if (!target) {
      var target = document.createElement("textarea");
      target.style.position = "absolute";
      target.style.left = "-9999px";
      target.style.top = "0";
      target.id = targetId;
      document.body.appendChild(target);
    }
    target.textContent = elem.textContent;
  }
  // select the content
  var currentFocus = document.activeElement;
  target.focus();
  target.setSelectionRange(0, target.value.length);

  // copy the selection
  var succeed;
  try {
    succeed = document.execCommand("copy");
  } catch (e) {
    succeed = false;
  }
  // restore original focus
  if (currentFocus && typeof currentFocus.focus === "function") {
    currentFocus.focus();
  }

  if (isInput) {
    // restore prior selection
    elem.setSelectionRange(origSelectionStart, origSelectionEnd);
  } else {
    // clear temporary content
    target.textContent = "";
  }
  return succeed;
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
  var burger = document.querySelector('.burger');
  var menu = document.querySelector('#' + burger.dataset.target);
  burger.addEventListener('click', function() {
    burger.classList.toggle('is-active');
    menu.classList.toggle('is-active');
  });

  let parameter = getParameter();
  if (localStorage.getItem('adminToken')) {
    adminToken = localStorage.getItem('adminToken');
    if (parameter.subject) {
      subject = parameter.subject;
      subjectText.innerText = subject;
      getAttendance(subject);
    } else {
      content.style.display = 'none';
    }
  } else {
    showModal('Alert', 'You are not logged in. Please login first', 'error');
    if (subject) {
      sessionStorage.setItem('subject', subject);
    }
    window.location.replace('./login');
  }
})();