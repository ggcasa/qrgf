const vinInputDiv = document.querySelector('.vinInput');
for (let i = 0; i < 17; i++) {
    const input = document.createElement('input');
    input.type = 'text';
    input.maxLength = 1;
    input.pattern = '[A-HJ-NPR-Za-hj-npr-z0-9]';
    input.className = 'vin-char';
    vinInputDiv.appendChild(input);
}

document.querySelectorAll('.vin-char').forEach((input, index, inputs) => {
  input.addEventListener('input', (e) => {
    e.target.value = e.target.value.toUpperCase();
    if (e.target.value && index < inputs.length - 1) {
      inputs[index + 1].focus();
    }
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Backspace' && !e.target.value && index > 0) {
      inputs[index - 1].focus();
    }
  });
});


// const parseButton = document.createElement('button');
// parseButton.textContent = 'Parse VIN';
// vinInputDiv.appendChild(parseButton);

// parseButton.addEventListener('click', () => {
//   const vin = Array.from(document.querySelectorAll('.vin-char')).map(input => input.value).join('');
//   const result = parseStellantisVin(vin);
//   console.log(result);
// }); 

function generateVinQr() {
  const vin = Array.from(document.querySelectorAll('.vin-char')).map(input => input.value).join('');
  const qrcodeDiv = document.getElementById('qrcode');
  qrcodeDiv.innerHTML = '';
  new QRCode(qrcodeDiv, vin);
} 

