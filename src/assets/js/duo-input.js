function initKeyboardAnimation() {
  const output = document.getElementById('signatureUseCaseOutput');

  document.querySelectorAll('.screen-button').forEach(function(btn) {
    btn.addEventListener('mousedown', function() {
      btn.classList.add('pressed');
    });
    btn.addEventListener('mouseup', function() {
      btn.classList.remove('pressed');

      if (!output) return;
      const key = btn.getAttribute('data-signature-key');
      if (key === 'BACKSPACE') {
        output.textContent = output.textContent.slice(0, -1);
      } else if (key) {
        output.textContent += key;
      }
    });
    btn.addEventListener('mouseleave', function() {
      btn.classList.remove('pressed');
    });
  });
}

function initDuoInputDemo() {
  const output = document.getElementById('signatureUseCaseOutput');
  const buttons = document.querySelectorAll('.screen-button[data-signature-key]');
  if (!output || !buttons.length) return;

  const sequence = ['D','U','O',' ','I','N','P','U','T'];
  let i = 0;
  let typing = true;

  function pressButton(key) {
    buttons.forEach(function(btn) {
      if (btn.getAttribute('data-signature-key') === key) {
        btn.classList.add('pressed');
        setTimeout(function() { btn.classList.remove('pressed'); }, 200);
      }
    });
  }

  function typeNext() {
    if (typing) {
      if (i < sequence.length) {
        const key = sequence[i];
        pressButton(key);
        output.textContent += key;
        i++;
        setTimeout(typeNext, 320);
      } else {
        // Vänta och börja radera
        setTimeout(deleteNext, 1200);
        typing = false;
      }
    }
  }

  function deleteNext() {
    if (output.textContent.length > 0) {
      pressButton('BACKSPACE');
      output.textContent = output.textContent.slice(0, -1);
      setTimeout(deleteNext, 180);
    } else {
      // Börja om
      i = 0;
      typing = true;
      setTimeout(typeNext, 600);
    }
  }

  setTimeout(typeNext, 1000);
}

document.addEventListener('DOMContentLoaded', () => {
  initKeyboardAnimation();
  initDuoInputDemo();
});