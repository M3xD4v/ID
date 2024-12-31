let studentsData = {};
let useIframeView = false; 

async function loadData() {
  try {
    const response = await fetch('2004500.json');
    studentsData = await response.json();
    displayStudents(studentsData);
  } catch (error) {
    console.error('Error loading data:', error);
  }
}

function displayStudents(students) {
  const studentList = document.getElementById('studentList');
  studentList.innerHTML = '';

  Object.entries(students).forEach(([id, student]) => {
    const card = document.createElement('div');
    card.className = 'student-card';
    card.innerHTML = `
      <div class="student-id">ID: ${id}</div>
      <div class="student-info">
        <span>Numele:</span> ${student.personalInfo.Numele}
      </div>
      <div class="student-info">
        <span>Facultatea:</span> ${student.personalInfo.Facultatea}
      </div>
      <div class="student-info">
        <span>Specializarea:</span> ${student.personalInfo.spec}
      </div>
       <div class="student-info">
        <span>Frecvența:</span> ${student.personalInfo.Frecventa}
      </div>
    `;

    card.addEventListener('click', () => showModal(id,student));
    studentList.appendChild(card);
  });
}
function showModal(id, student) {
  const modal = document.getElementById('modal');
  const modalContent = document.getElementById('modalContent');
  modalContent.innerHTML = ''; 

  if (useIframeView) {
    
    const iframe = document.createElement('iframe');
    iframe.src = `/HTML/${id}.html`;
    iframe.style.width = '100%';
    iframe.style.height = '500px';
    iframe.style.border = 'none';
    modalContent.appendChild(iframe);
  } else {
        
          let content = `
        <div class="student-id">ID: ${id}</div>
        <h2 class="section-title">Personal Information</h2>
        <div class="student-info">
          <span>Numele:</span> ${student.personalInfo.Numele}
        </div>
        <div class="student-info">
          <span>Facultatea:</span> ${student.personalInfo.Facultatea}
        </div>
        <div class="student-info">
          <span>Specializarea:</span> ${student.personalInfo.spec}
        </div>
        <div class="student-info">
          <span>Frecvența:</span> ${student.personalInfo.Frecventa}
        </div>
      `;

    if (student.orders && student.orders.length > 0) {
      content += `
        <h2 class="section-title">Orders</h2>
        <table class="data-table">
          <thead>
            <tr>
              ${Object.keys(student.orders[0]).map(key => `<th>${key}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${student.orders.map(order => `
              <tr>
                ${Object.values(order).map(value => `<td>${value}</td>`).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    }

      if (student.courseNotes && student.courseNotes.length > 0) {
          content += `
              <h2 class="section-title">Course Notes</h2>
              <table class="data-table">
                <thead>
                <tr>
                ${Object.keys(student.courseNotes[0]).map(key => `<th>${key}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
                ${student.courseNotes.map(note => `
                    <tr>
                      ${Object.values(note).map(value => `<td>${value}</td>`).join('')}
                    </tr>
                  `).join('')}
              </tbody>
        </table>
          `;
    }
    if (student.mediaAn) {
        content += `
          <h2 class="section-title">Academic Performance</h2>
            <div class="student-info">
                <span>Media:</span> ${student.mediaAn.media}
            </div>
            <div class="student-info">
                <span>Credite:</span> ${student.mediaAn.credite}
             </div>
        `;
    }
      if (student.frequency && student.frequency.length > 0) {
        content += `
          <h2 class="section-title">Frequency</h2>
            ${student.frequency.map(freq => `
            <div class="student-info">
               <span>Course:</span> ${freq.title}
               <br>
               <span>Professor:</span> ${freq.profesor}
            </div>
            <table class="data-table nested-table">
                <thead>
                <tr>
                  <th>Title</th>
                  <th>Date</th>
                  <th>Grade</th>
              </tr>
             </thead>
            <tbody>
              ${freq.courses.map(course => `
                <tr>
                   <td>${course.title}</td>
                   <td>${course.data}</td>
                    <td>${course.nota}</td>
                 </tr>
                `).join('')}
              </tbody>
            </table>
         `).join('')}
    `;
      }
      modalContent.innerHTML = content;
  }
  modal.style.display = 'block';
}
document.querySelector('.close-btn').addEventListener('click', () => {
  document.getElementById('modal').style.display = 'none';
});

window.addEventListener('click', (event) => {
  const modal = document.getElementById('modal');
  if (event.target === modal) {
    modal.style.display = 'none';
  }
});

document.getElementById('searchInput').addEventListener('input', (e) => {
  const searchTerm = e.target.value.toLowerCase();
  const filteredStudents = Object.fromEntries(
    Object.entries(studentsData).filter(([id, student]) =>
      student.personalInfo.Numele.toLowerCase().includes(searchTerm) ||
      student.personalInfo.Facultatea.toLowerCase().includes(searchTerm) ||
      student.personalInfo.spec.toLowerCase().includes(searchTerm) ||
        id.includes(searchTerm)
    )
  );
  displayStudents(filteredStudents);
});

document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.createElement('button');
  toggleBtn.id = 'toggleViewBtn';
  toggleBtn.textContent = 'Switch to iFrame View';
  toggleBtn.classList.add("student-card")
  toggleBtn.style.color = "#abb2bf"
  toggleBtn.addEventListener('click', () => {
    useIframeView = !useIframeView;
    toggleBtn.textContent = useIframeView ? 'Switch to JSON View' : 'Switch to Iframe View';
  });

  document.querySelector('.container').insertBefore(toggleBtn, document.getElementById('studentList')); 
});

loadData();