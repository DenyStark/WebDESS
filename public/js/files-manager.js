const processFaulure = (faulure) => {
  const { code, message, data } = faulure.responseJSON;
  alert(`Error: ${code}: ${message || data}`);
};

async function loadList() {
  const { list } = await $.get('/storage/list');
  return list || [];
}

async function loadFile(title) {
  const query = { title };
  const { file } = await $.get('/storage/file', query).catch(processFaulure);
  return file || {};
}

async function updateFile(title, data) {
  const body = { title, data };
  await $.post('/storage/update', body).catch(processFaulure);
  alert('The file is successfully update.');
}

async function createFile(title, isUpdate, data = {}) {
  const body = { title, data };
  await $.post('/storage/create', body).catch((faulure) => {
    const { code, message } = faulure.responseJSON;
    if (code === 73401 && isUpdate) updateFile(title, data);
    else alert(`Error: ${code}: ${message}`);
  });

  alert('The file is successfully save.');
}

function deleteFile(title) {
  const body = { title };
  $.post('/storage/delete', body).then(() => {
    alert('The file is successfully delete.');
  }, processFaulure);
}
