const processFaulure = (faulure) => {
  const { code, message, data } = faulure.responseJSON;
  alert(`Error: ${code}: ${message || data}`);
};

async function loadList() {
  const { list } = (await axios.get('/storage/list')).data;
  return list || [];
}

async function loadFile(title) {
  const params = { title };
  const { data } = await axios.get('/storage/file', { params }).catch(processFaulure);
  return data.file || {};
}

async function updateFile(title, data) {
  const body = { title, data };
  await axios.post('/storage/update', body).catch(processFaulure);
  alert('The file is successfully update.');
}

async function createFile(title, isUpdate, data = {}) {
  const body = { title, data };
  await axios.post('/storage/create', body).catch((faulure) => {
    const { code, message } = faulure.responseJSON;
    if (code === 73401 && isUpdate) updateFile(title, data);
    else alert(`Error: ${code}: ${message}`);
  });

  alert('The file is successfully save.');
}

function deleteFile(title) {
  const body = { title };
  axios.post('/storage/delete', body).then(() => {
    alert('The file is successfully delete.');
  }, processFaulure);
}
