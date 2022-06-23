let isModalOpen = false;
let isTeamModalOpen = false;
let contrastToggle = false;

function toggleModal() {
  if (isModalOpen) {
    isModalOpen = false;
    return document.body.classList.remove("modal--open");
  }
  isModalOpen = true;
  document.body.classList += " modal--open";
}

function toggleTeamModal() {
  if (isTeamModalOpen) {
    isTeamModalOpen = false;
    return document.body.classList.remove("modal__open");
  }
  isTeamModalOpen = true;
  document.body.classList += " modal__open";
}

function toggleContrast() {
  contrastToggle = !contrastToggle;
  if (contrastToggle) {
    document.body.classList += " dark-theme";
  } else {
    document.body.classList.remove("dark-theme");
  }
}
