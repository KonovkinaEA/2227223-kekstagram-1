const getData = (onSuccess, onError) => {
  fetch('https://26.javascript.pages.academy/kekstagram/data')
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(`${response.status} ${response.statusText}`);
    })
    .then((data) => {
      onSuccess(data);
    })
    .catch((err) => {
      onError(err);
    });
};

const sendData = (onSuccess, onError, body, unblockSubmitButton) => {
  fetch('https://26.javascript.pages.academy/kekstagram',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: body
    })
    .then((response) => {
      if (response.ok) {
        onSuccess();
      } else {
        onError('Не удалось загрузить пост. Попробуйте ещё раз');
      }
    })
    .catch(() => {
      onError('Не удалось загрузить пост. Попробуйте ещё раз');
    })
    .finally(() => {
      unblockSubmitButton();
    });
};

export {getData, sendData};
