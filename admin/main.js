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
  statusText.innerText = e.target.checked ? 'Enabled' : 'Disabled';
  console.log(e.target.checked);
})

const getAttendance = (subject) => {
  let url = `${api}?action=getAttendance&userToken=${adminToken}&subject=${subject}`;
  axios.get(url)
    .then(function(response) {
      attendanceData = response.data;
      console.log(attendanceData);
      if (attendanceData.status) {
        formStatus.checked = attendanceData.isActive;
        statusText.innerText = attendanceData.isActive ? 'Enabled' : 'Disabled';
        studentsCount.innerText = attendanceData.attendees.length;
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
      submit.classList.remove('is-loading');
      showModal("Error", error, 'error')
    });
}
/*
changeSubjectStatus
userToken;
subject;
newState;
*/

const updateAttendees = (attendees) => {
  let attendeesNos = attendees.map(student => student.rollNo).join('\n');
  numbersArea.value = attendeesNos;
  table.innerHTML = '';
  attendees.forEach((student) => {
    var formattedDate = moment(student.date, 'YYYY-MM-DDThh:mm:ss:sssZ').format('hh:mm A')
    table.append(`
      <tr>
        <td width="5%">${student.student.rollNo}</td>
        <td>${student.student.name}</td>
        <td class="level-right"><span class="tag is-black">${formattedDate}</span></td>
      </tr>
    `)
  })
}
const shareAttendance = () => {
  console.log('share');
}

const copyAttendance = () => {
  console.log('Copy');
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

// The following code is based off a toggle menu by @Bradcomp
// source: https://gist.github.com/Bradcomp/a9ef2ef322a8e8017443b626208999c1
(function() {
  var burger = document.querySelector('.burger');
  var menu = document.querySelector('#' + burger.dataset.target);
  burger.addEventListener('click', function() {
    burger.classList.toggle('is-active');
    menu.classList.toggle('is-active');
  });

  if (parameter.subject) {
    subject = parameter.subject;
    subjectText.innerText = subject;
    getAttendance(subject);
  } else {
    content.style.display = 'none';
  }
  if (localStorage.getItem('adminToken')) {
    adminToken = localStorage.getItem('adminToken');
    let parameter = getParameter();
  } else {
    showModal('Alert', 'You are not logged in. Please login first', 'error');
    if (subject) {
      sessionStorage.setItem('subject', subject);
    }
    window.location.replace('./login');
  }
})();