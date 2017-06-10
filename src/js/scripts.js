document.addEventListener('DOMContentLoaded', () => {
  const stage = document.querySelector('.stage');
  // const addHover = () => stage.classList.add('hover');
  // const removeHover = () => stage.classList.remove('hover');
  // const toggleHover = (event) => {
  //   event.stopPropagation();
  //   if (stage.classList.contains('hover')) {
  //     removeHover();
  //   } else {
  //     addHover();
  //   }
  // };

  // stage.addEventListener('touchstart', () => stage.setAttribute('data-touch', 'true'));
  // stage.addEventListener('touchend', toggleHover);

  const requestMaker = function (searchTerm = 'raccoon') {
    return new Request(`https://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=${searchTerm}`, {
      method: 'GET',
      mode: 'cors',
      redirect: 'follow'
    });
  };

  const giphyCreator = (json) => {
    const data = json.data;
    let media = null;
    let ready = '';

    if (data.image_mp4_url) {
      ready = 'canplay';
      media = document.createElement('video');
      media.src = data.image_mp4_url;
      media.autoplay = true;
      media.loop = true;
    } else {
      ready = 'load';
      media = document.createElement('img');
      media.src = data.image_url;
      media.title = "Trash Panda";
    }

    media.addEventListener(ready, () => {
      stage.classList.add('hover');
    });

    stage.insertAdjacentElement('beforeEnd', media);
  };

  fetch(requestMaker())
    .then(response => response.json())
    .then(giphyCreator)
    .catch((e) => {
      console.error(e);
    })
});


/* old
  const requestMaker = function (searchTerm = 'raccoon') {
    return new Request(`http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=${searchTerm}`, {
      method: 'GET',
      mode: 'cors',
      redirect: 'follow'
    });
  }

  const raccoon = requestMaker();
  const trashPanda = requestMaker('trash+panda');

  Promise.all(
      [raccoon, trashPanda].map(request => {
        return fetch(request).then(response => response.json())
      })
    )
    .then((jsons) => {
      const rand = Math.round(Math.random());
      const url = jsons[rand].data.image_url;
      const img = document.createElement('img');
      img.src = url;
      img.title = "Trash Panda";
      stage.insertAdjacentElement('beforeEnd', img);
      img.addEventListener('load', () => {
        stage.removeAttribute('disabled');
      });
    })
    .catch((e) => {
      console.error(e);
    })
*/
