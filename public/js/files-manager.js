const filesManager = (() => {
  const processError = error => {
    const { code, message, data } = error.responseJSON;
    alert(`Error: ${code}: ${message || data}`);
  };

  const loadList = async (type = 'Net') => {
    const params = { type };
    const payload = (await axios.get('/storage/list', { params }));
    return payload.data.list || [];
  };

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
