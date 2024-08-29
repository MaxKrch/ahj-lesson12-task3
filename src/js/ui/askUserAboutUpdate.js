import '../../css/modalAskUserAboutUpdate.css';

export default function askUserAboutUpdate(worker) {
  const modal = createModal();
  addEventListenersToModal(modal, worker);
  addModalToPage(modal);
}

const createModal = () => {
  const modal = document.createElement(`aside`);
  modal.classList.add(`modal-update__container`);

  const modalTitle = createModalTitle();
  const modalDescription = createModalDescription();
  const modalButtons = createModalButtonBlock();

  modal.append(modalTitle, modalDescription, modalButtons);

  return modal;
};

const createModalTitle = () => {
  const title = document.createElement(`h2`);
  title.classList.add(`modal-update__title`);
  title.textContent = `Доступна новая версия сайта!`;

  return title;
};

const createModalDescription = () => {
  const description = document.createElement(`div`);
  description.classList.add(`modal-update__description`);
  description.innerHTML = `
		<p>Хотите обновить прямо сейчас?</p>
		<p>(страница перезагрузится)</p>
	`;

  return description;
};

const createModalButtonBlock = () => {
  const buttons = document.createElement(`div`);
  buttons.classList.add(`modal-update__button-block`);

  const buttonCancel = createModalButtonCancel();
  const buttonConfirm = createModalButtonConfirm();

  buttons.append(buttonCancel, buttonConfirm);

  return buttons;
};

const createModalButtonCancel = () => {
  const button = document.createElement(`button`);
  button.classList.add(`modal-update__button`, `modal-update__cancel`);
  button.dataset.id = `buttonCancel`;
  button.textContent = `Не обновлять`;

  return button;
};

const createModalButtonConfirm = () => {
  const button = document.createElement(`button`);
  button.classList.add(`modal-update__button`, `modal-update__confirm`);
  button.dataset.id = `buttonConfirm`;
  button.textContent = `Обновить`;

  return button;
};

const addEventListenersToModal = (modal, worker) => {
  const buttonConfirm = modal.querySelector(`[data-id="buttonConfirm"]`);
  const buttonCancel = modal.querySelector(`[data-id="buttonCancel"]`);

  buttonConfirm.addEventListener(`click`, async () => {
    removeModal(modal);
    worker.postMessage('skipWaiting');
  });

  buttonCancel.addEventListener(`click`, async () => {
    removeModal(modal);
    worker.postMessage('waiting');
  });
};

const addModalToPage = (modal) => {
  document.body.append(modal);
};

const removeModal = (modal) => {
  modal.remove();
};
