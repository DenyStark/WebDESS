const processError = error => {
  const { code, message, data } = error.responseJSON;
  alert(`Error: ${code}: ${message || data}`);
};

async function loadList(type = 'Net') {
  const params = { type };
  const payload = (await axios.get('/storage/list', { params }));
  return payload.data.list || [];
}

async function loadFile(title, type = 'Net') {
  const params = { title, type };
  const payload = await axios.get('/storage/file', { params }).catch(processError);
  return payload.data.file || {};
}

async function updateFile(title, data, type = 'Net') {
  const body = { title, type, data };
  await axios.post('/storage/update', body).catch(processError);
  alert('The file is successfully update.');
}

async function createFile(title, isUpdate, data = {}, type = 'Net') {
  const body = { title, type, data };
  await axios.post('/storage/create', body).catch(error => {
    const { code, message } = error.response.data;
    if (code === 73401 && isUpdate) updateFile(title, data);
    else alert(`Error: ${code}: ${message}`);
  });

  alert('The file is successfully save.');
}

function deleteFile(title, type = 'Net') {
  const body = { title, type };
  axios.post('/storage/delete', body).then(() => {
    alert('The file is successfully delete.');
  }, processError);
}
