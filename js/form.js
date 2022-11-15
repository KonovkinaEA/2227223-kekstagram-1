import { scaleValue } from './scale.js';
import { changeEffect, removeFilter } from './effects.js';
import { isFormValid } from './validation.js';
import { sendData } from './api.js';

const body = document.querySelector('body');
const initialImgUpload = document.querySelector('.img-upload__start');
const form = document.querySelector('.img-upload__form');
const editImg = form.querySelector('.img-upload__overlay');
const imgPreview = editImg.querySelector('.img-upload__preview');
const uploadFile = form.querySelector('#upload-file');
const imgDescr = form.querySelector('.text__description');
const hashtags = form.querySelector('.text__hashtags');
const slider = form.querySelector('.effect-level__slider');
const submitButton = form.querySelector('#upload-submit');

let postMessage = undefined;

const closeOption = () => {
  body.classList.remove('modal-open');
  editImg.classList.add('hidden');

  form.removeEventListener('change', changeEffect);
  form.removeEventListener('submit', submitForm);
  removeFilter();

  uploadFile.value = '';
  imgDescr.value = '';
  hashtags.value = '';
};

const escClose = (keyEvent) => {
  if (keyEvent.keyCode === 27) {
    closeOption();
    document.removeEventListener('keydown', escClose);
  }
};

const buttonClose = () => {
  document.addEventListener('keydown', escClose);
  editImg.querySelector('.img-upload__cancel').addEventListener('click', () => {
    closeOption();
    document.removeEventListener('keydown', escClose);
  });
};

initialImgUpload.onchange = () => {
  editImg.classList.remove('hidden');
  slider.classList.add('hidden');
  body.classList.add('modal-open');

  scaleValue.value = '100%';
  imgPreview.style = `transform: scale(${scaleValue})`;

  form.addEventListener('change', changeEffect);
  form.addEventListener('submit', submitForm);

  buttonClose();
};

const removeMessage = (messageBlock, abortController) => {
  abortController.abort();
  document.addEventListener('keydown', escClose);
  body.removeChild(messageBlock);
};

const messageEscClose = (evt, messageBlock, abortController) => {
  if (evt.keyCode === 27) {
    removeMessage(messageBlock, abortController);
  }
};

const messageClickOutsideClose = (evt, messageBlock, isSuccess, abortController) => {
  const selector = `.${isSuccess ? 'success' : 'error'}__inner`;
  if (!evt.target.closest(selector)) {
    removeMessage(messageBlock, abortController);
  }
};

const showLoadingMessage = () => {
  const messageTemplate = document.querySelector('#messages').content.querySelector('div');
  const message = messageTemplate.cloneNode(true);

  body.append(message);

  return message;
};

const hideLoadingMessage = () => body.removeChild(postMessage);

const createMessage = (isSuccess) => {
  const messageTemplate = document.querySelector(`#${isSuccess ? 'success' : 'error'}`).content.querySelector('section');
  const message = messageTemplate.cloneNode(true);
  const button = message.querySelector('button');
  const abortController = new AbortController();

  document.removeEventListener('keydown', escClose);

  body.append(message);

  button.onclick = () => removeMessage(message, abortController);
  message.onclick = (evt) => messageClickOutsideClose(evt, message, isSuccess, abortController);

  document.addEventListener('keydown', (evt) => messageEscClose(evt, message, abortController), { signal: abortController.signal });
};

const blockSubmitButton = () => {
  submitButton.disabled = true;
  postMessage = showLoadingMessage();
};

const unblockSubmitButton = () => {
  submitButton.disabled = false;
  hideLoadingMessage();
};

const successSending = () => {
  closeOption();
  createMessage(true);
};

const failSending = () => createMessage(false);

function submitForm(evt) {
  evt.preventDefault();
  if (isFormValid()) {
    blockSubmitButton();
    sendData(successSending, failSending, new FormData(evt.target), unblockSubmitButton);
  }
}
