window.onload = () => {
  const history = [];
  const historyMaxLength = 50;
  
  const updateHistory = () {
    const { json } = getCurrentModel();
    history.unshift(json);
    history.length = historyMaxLength;
  };

  $('#sandbox').on('DOMSubtreeModified', updateHistory);
  $('#top-svg').on('DOMSubtreeModified', updateHistory);
};
