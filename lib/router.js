window.__SWAP_ROUTER__ = window.__SWAP_ROUTER__ || (function() {
  function getBody(markup) {
    const match = /(<body>)((.|\s)+)(<\/body>)/.exec(markup);
    return match && match[2] || '';
  }
  function getTitle(markup) {
    const match = /(?:<title>)((.|\n)+)(?:(<\/title>))/m.exec(markup);
    return match && match[1] || '';
  }
  function shouldSwap(a) {
    const uri = a.getAttribute('href');
    const target = a.getAttribute('target');
    return target !== '_blank' && !/\.[a-zA-Z]+\//.test(uri);
  }

  window.addEventListener('popstate', function(event) {
    console.log('pop state', event);
  });
  window.addEventListener('click', function(event) {
    if (event.target.tagName === 'A' && shouldSwap(event.target)) {
      if (!event.defaultPrevented) {
        event.preventDefault();
      }
      const href = event.target.getAttribute('href');
      fetch(href).then(function(resp) {
        if (resp.status !== 200) {
          throw new Error('Could not get data at ' + href);
        }
        return resp.text();
      }).then((html) => {
        const title = getTitle(html)
        history.pushState({}, title, href);
        document.title = title;
        document.body.innerHTML = getBody(html);
      }).catch((err) => {
        console.error('Failed to fetch next page', err);
      });
    }
  }, true);
})();
