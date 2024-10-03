

function checkAadhar(value){
  let aadharRegex = /(^[2-9]{1}[0-9]{3}\s[0-9]{4}\s[0-9]{4})/;
  if (!aadharRegex.test(value)) {
    document.getElementById('aadharError').style.display = 'block';
    document.getElementById('submit').disabled = true;
  }else{
    document.getElementById('aadharError').style.display = 'none';
    document.getElementById('submit').disabled = false;
  }
}
function checkMobile(value){
  let mobileRegex = /(^[6-9]\d{9})/;
  if (!mobileRegex.test(value)) {
    document.getElementById('mobileError').style.display = 'block';
    document.getElementById('submit').disabled = true;
  }else{
    document.getElementById('mobileError').style.display = 'none';
    document.getElementById('submit').disabled = false;
  }
}
function checkRation(value){
  let rationRegex = /(^([0-9]){8,12}\s*)/;
  if (!rationRegex.test(value)) {
    document.getElementById('rationError').style.display = 'block';
    document.getElementById('submit').disabled = true;
  }else{
    document.getElementById('rationError').style.display = 'none';
    document.getElementById('submit').disabled = false;
  }
}

function checkEpic(val){
  // Define the combined regex pattern for old and new EPIC formats
    const epicRegex = /(^[A-Z]{2}\/[0-9]{1,2}\/[0-9]{3}\/[0-9]{6}$)|(^[A-Z]{3}[0-9]{7}$)/i;
    const epicNo = val; // Get the value of the EPIC number input

    if (!epicRegex.test(epicNo)) {
      // Show error message if EPIC number is invalid
      document.getElementById('epicError').style.display = 'block';
      document.getElementById('submit').disabled = true;
    } else {
      // Show success message if EPIC number is valid
      document.getElementById('epicError').style.display = 'none';
      document.getElementById('submit').disabled = false;
    }
}
const dropdown = document.getElementById('hasRation');
var rationFields = document.getElementById('rationDetails');
// Add event listener for dropdown selection change
dropdown.addEventListener('change', function() {
  if (this.value === 'yes') {
    // Show bank account fields if 'Yes' is selected
    rationFields.style.display = 'block';
  } else {
    // Hide bank account fields if 'No' is selected
    rationFields.style.display = 'none';
  }
});
const health = document.getElementById('hasDisease');
var healthFields = document.getElementById('healthFields');
// Add event listener for dropdown selection change
health.addEventListener('change', function() {
  if (this.value === 'yes') {
    // Show bank account fields if 'Yes' is selected
    healthFields.style.display = 'block';
  } else {
    // Hide bank account fields if 'No' is selected
    healthFields.style.display = 'none';
  }
});
//health card availibilty
const healthCard = document.getElementById('hasHealthCard');
const healthCardFields = document.getElementById('healthCardFields');
// Add event listener for dropdown selection change
healthCard.addEventListener('change', function() {
  if (this.value === 'yes') {
    // Show bank account fields if 'Yes' is selected
    healthCardFields.style.display = 'block';
  } else {
    // Hide bank account fields if 'No' is selected
    healthCardFields.style.display = 'none';
  }
});

function checkHouse(val){
const houseType = document.getElementById('hd');
const katchaPakkaGhar = document.getElementById('kpd');

  console.log('hashouse ' + val)
  if (val === 'yes') {
    console.log('hashouse : yes ')
    katchaPakkaGhar.style.display = 'block';
    houseType.style.display = 'none';
  }else if(val === '0'){
    katchaPakkaGhar.style.display = 'none';
    houseType.style.display = 'none';
  }
   else {
    console.log('hashouse : no')
    katchaPakkaGhar.style.display = 'none';
    houseType.style.display = 'block';
  }
}
function getCourse(val){
// Define career courses based on educational qualification
  const careerCourses = {
    highschool: ["General Studies", "Vocational Courses", "Polytechnic"],
    intermediate: ["Arts", "Science", "Commerce"],
    graduation: ["B.Tech", "B.Sc", "B.Arts", "B.Com"],
    postgraduation: ["M.Tech", "M.Sc", "M.A", "MBA", "PhD"],
    diploma: ["Diploma in Engineering", "Diploma in Nursing", "Diploma in Education"]
  };
  // Get the qualification and courses dropdown elements
  const qualificationDropdown = document.getElementById('qualification');
  const coursesDropdown = document.getElementById('courses');
  const courseFields = document.getElementById('courseFields');
  const otherCourseFields = document.getElementById('otherCourseFields');
  // Add event listener for changes in the qualification dropdown
  // qualificationDropdown.addEventListener('change', function() {
    const selectedQualification = val;
    if (selectedQualification === '') {
      courseFields.style.display = "none";
      otherCourseFields.style.display = "none";
    }else if (selectedQualification === "other") {
      courseFields.style.display = "none";
      otherCourseFields.style.display = "block";
    }
    else{
      courseFields.style.display = "block";
      otherCourseFields.style.display = "none";
    // Clear existing options in the courses dropdown
      coursesDropdown.innerHTML = '<option value="">Select Course</option>';

      // Check if a valid qualification is selected and populate career courses
      if (careerCourses[selectedQualification]) {
        careerCourses[selectedQualification].forEach(course => {
          const option = document.createElement('option');
          option.value = course;
          option.textContent = course;
          coursesDropdown.appendChild(option);
        });
      }
    }
  // });
}
  document.addEventListener('DOMContentLoaded', function() {
    const villageSelect = document.getElementById('village');
    const wardSelect = document.getElementById('ward');

    const villageWardMapping = {
      1: [1, 2, 3],
      2: [4, 5, 6, 7],
      3: [8, 9, 10],
      4: [11, 12, 13, 14]
    };
    villageSelect.addEventListener('change', function() {
    const selectedVillage = this.value;
    console.log(selectedVillage);
    // Clear the existing ward dropdown options
    wardSelect.innerHTML = '<option value="">Select Ward</option>';

    if (selectedVillage) {
      // Get the wards for the selected village
      const wards = villageWardMapping[selectedVillage];

      // Populate the ward dropdown
      wards.forEach(ward => {
        const option = document.createElement('option');
        option.value = ward;
        option.textContent = 'Ward ' + ward;
        wardSelect.appendChild(option);
      });
    }
  });
});
