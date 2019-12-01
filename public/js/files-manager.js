const filesManager = (() => {
  const cache = {
    Net: new Map(),
    Model: new Map(),
  };

  const processError = error => {
    const { code, message, data } = error.responseJSON;
    alert(`Error: ${code}: ${message || data}`);
  };

  const syncCache = async (type) => {
    const params = { type }
    const { data } = await axios.get('/storage/list', { params });

    for (const { title, date } of data.list) {
      const params = { title, type };
      const { data } = await axios.get('/storage/file', { params }).catch(processError);
      cache[type].set(title, { title, date, data: data.file })
    }
  };

  syncCache('Net');
  syncCache('Model');

  const loadList = type => Array.from(cache[type], ([_k, v]) => v);

  const loadFile = async (title, type = 'Net') => {
    const params = { title, type };
    const payload = await axios.get('/storage/file', { params }).catch(processError);
    return payload.data.file || {};
  };

  const updateFile = async (title, data, type = 'Net') => {
    const body = { title, type, data };
    await axios.post('/storage/update', body).catch(processError);
    alert('The file is successfully update.');
  };

  const createFile = async (title, isUpdate, data = {}, type = 'Net') => {
    const body = { title, type, data };
    await axios.post('/storage/create', body).then(() => {
      alert('The file is successfully save.');
    }).catch(error => {
      const { code, message } = error.response.data;
      if (code === 73401 && isUpdate) return updateFile(title, data);
      else alert(`Error: ${code}: ${message}`);
    });
  };

  const deleteFile = (title, type = 'Net') => {
    const body = { title, type };
    axios.post('/storage/delete', body).then(() => {
      alert('The file is successfully delete.');
    }, processError);
  };

  return {
    loadList,
    loadFile,
    createFile,
    deleteFile,
  }
})();
