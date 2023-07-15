const slideCount = document.querySelector("#slider-count");
const slideValue = document.querySelector("#slider");

const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const generateBtn = document.querySelector("#generatebutton");
const passwordDisplay = document.querySelector("#target");
const indicator = document.querySelector("#indecate");
const copyText = document.querySelector("#copyMsg");
const copy=document.querySelector("#copymsg");
const resetBtn = document.querySelector("#resetbutton");
const checkmsg=document.querySelector("#checkMsg");

let passwordLength = 6;
passwordDisplay.innerHTML="PASSWORD";

slideValue.addEventListener("change", () => {
  slideCount.innerHTML = slideValue.value;
  passwordLength = slideValue.value;
});

let password = "";
let checkCount = 0;


  
copy.addEventListener("click", async() => {
  if(passwordDisplay.innerHTML==="PASSWORD"){
    return;
  }
  try {
        await navigator.clipboard.writeText(passwordDisplay.innerHTML);
        copyText.innerHTML = "copied";
        copyText.style.backgroundColor = "#7F00FF";
      } catch (e) {
        copyText.innerHTML = "Failed";
      }
      setTimeout(() => {
        copyText.innerHTML = "";
        copyText.style.removeProperty("background-color");
      }, 2000);
});

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
  return getRndInteger(0, 9);
}

function generateLowerCase() {
  return String.fromCharCode(getRndInteger(97, 123));
}

function generateUpperCase() {
  return String.fromCharCode(getRndInteger(65, 91));
}

function generateSymbol() {
  const randNum = getRndInteger(0, symbols.length);
  return symbols.charAt(randNum);
}
function setIndicator(color) {
  indicator.style.backgroundColor = color;
  indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function calcStrength() {
  let hasUpper = false;
  let hasLower = false;
  let hasNum = false;
  let hasSym = false;
  if (uppercaseCheck.checked) hasUpper = true;
  if (lowercaseCheck.checked) hasLower = true;
  if (numbersCheck.checked) hasNum = true;
  if (symbolsCheck.checked) hasSym = true;

  if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
    setIndicator("#0f0");
  } else if (
    (hasLower || hasUpper) &&
    (hasNum || hasSym) &&
    passwordLength >= 6
  ) {
    setIndicator("#ff0");
  } else {
    setIndicator("#f00");
  }
}

function shufflePassword(array) {
  //Fisher Yates Method
  for (let i = array.length - 1; i > 0; i--) {
    //random J, find out using random function
    const j = Math.floor(Math.random() * (i + 1));
    //swap number at i index and j index
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  let str = "";
  array.forEach((el) => (str += el));
  return str;
}

function handleCheckBoxChange() {
  checkCount = 0;
  allCheckBox.forEach((checkbox) => {
    if (checkbox.checked) checkCount++;
  });

  //special condition
  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    slideCount.innerHTML = checkCount;
  }
}

allCheckBox.forEach((checkbox) => {
  checkbox.addEventListener("change", handleCheckBoxChange);
});

generateBtn.addEventListener("click", () => {
  //none of the checkbox are selected

  
  if(checkCount===0){
    checkmsg.innerHTML = "checkboxes not ticked";
    checkmsg.style.backgroundColor = "#7F00FF";
    setTimeout(() => {
      checkmsg.innerHTML = "";
      checkmsg.style.removeProperty("background-color");
    }, 2000);
    return;
  }

  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    slideValue.value = checkCount;
    slideCount.innerHTML = checkCount;
  }

  // let's start the jouney to find new password
 
  //remove old password
  password = "";

  let funcArr = [];

  if (uppercaseCheck.checked) funcArr.push(generateUpperCase);

  if (lowercaseCheck.checked) funcArr.push(generateLowerCase);

  if (numbersCheck.checked) funcArr.push(generateRandomNumber);

  if (symbolsCheck.checked) funcArr.push(generateSymbol);

  //compulsory addition
  for (let i = 0; i < funcArr.length; i++) {
    password += funcArr[i]();
  }
  

  //remaining adddition
  for (let i = 0; i < passwordLength - funcArr.length; i++) {
    let randIndex = getRndInteger(0, funcArr.length);
    
    password += funcArr[randIndex]();
  }
  
  //shuffle the password
  password = shufflePassword(Array.from(password));
  
  //show in UI
  passwordDisplay.innerHTML = password;
  
  //calculate strength
  calcStrength();
});

resetBtn.addEventListener("click", () => {
      
      password = "PASSWORD";
      passwordDisplay.innerHTML = password;
      setIndicator("gray");
      slideValue.value = 6;
      slideCount.innerHTML = 6;
      passwordLength = 6;
      checkCount=0;
      uppercaseCheck.checked = false;
      lowercaseCheck.checked = false;
      numbersCheck.checked = false;
      symbolsCheck.checked = false;
});
