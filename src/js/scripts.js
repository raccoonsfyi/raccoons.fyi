document.addEventListener('DOMContentLoaded', () => {
  const stage = document.querySelector('.stage');
  const addHover = () => stage.classList.add('hover');
  const removeHover = () => stage.classList.remove('hover');
  const toggleHover = (event) => {
    event.stopPropagation();
    if (stage.classList.contains('hover')) {
      removeHover();
    } else {
      addHover();
    }
  };

  stage.addEventListener('touchstart', () => stage.setAttribute('data-touch', 'true'));
  stage.addEventListener('touchend', toggleHover);

  const requestMaker = function (searchTerm = 'raccoon') {
    return new Request(`https://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=${searchTerm}`, {
      method: 'GET',
      mode: 'cors',
      redirect: 'follow'
    });
  };

  const canAutoplay = new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.className = 'visuallyhidden';
    video.autoplay = true;
    video.src = "data:video/mp4;base64,AAAAFGZ0eXBNU05WAAACAE1TTlYAAAOUbW9vdgAAAGxtdmhkAAAAAM9ghv7PYIb+AAACWAAACu8AAQAAAQAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAnh0cmFrAAAAXHRraGQAAAAHz2CG/s9ghv4AAAABAAAAAAAACu8AAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAABAAAAAAFAAAAA4AAAAAAHgbWRpYQAAACBtZGhkAAAAAM9ghv7PYIb+AAALuAAANq8AAAAAAAAAIWhkbHIAAAAAbWhscnZpZGVBVlMgAAAAAAABAB4AAAABl21pbmYAAAAUdm1oZAAAAAAAAAAAAAAAAAAAACRkaW5mAAAAHGRyZWYAAAAAAAAAAQAAAAx1cmwgAAAAAQAAAVdzdGJsAAAAp3N0c2QAAAAAAAAAAQAAAJdhdmMxAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAFAAOABIAAAASAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGP//AAAAEmNvbHJuY2xjAAEAAQABAAAAL2F2Y0MBTUAz/+EAGGdNQDOadCk/LgIgAAADACAAAAMA0eMGVAEABGjuPIAAAAAYc3R0cwAAAAAAAAABAAAADgAAA+gAAAAUc3RzcwAAAAAAAAABAAAAAQAAABxzdHNjAAAAAAAAAAEAAAABAAAADgAAAAEAAABMc3RzegAAAAAAAAAAAAAADgAAAE8AAAAOAAAADQAAAA0AAAANAAAADQAAAA0AAAANAAAADQAAAA0AAAANAAAADQAAAA4AAAAOAAAAFHN0Y28AAAAAAAAAAQAAA7AAAAA0dXVpZFVTTVQh0k/Ou4hpXPrJx0AAAAAcTVREVAABABIAAAAKVcQAAAAAAAEAAAAAAAAAqHV1aWRVU01UIdJPzruIaVz6ycdAAAAAkE1URFQABAAMAAAAC1XEAAACHAAeAAAABBXHAAEAQQBWAFMAIABNAGUAZABpAGEAAAAqAAAAASoOAAEAZABlAHQAZQBjAHQAXwBhAHUAdABvAHAAbABhAHkAAAAyAAAAA1XEAAEAMgAwADAANQBtAGUALwAwADcALwAwADYAMAA2ACAAMwA6ADUAOgAwAAABA21kYXQAAAAYZ01AM5p0KT8uAiAAAAMAIAAAAwDR4wZUAAAABGjuPIAAAAAnZYiAIAAR//eBLT+oL1eA2Nlb/edvwWZflzEVLlhlXtJvSAEGRA3ZAAAACkGaAQCyJ/8AFBAAAAAJQZoCATP/AOmBAAAACUGaAwGz/wDpgAAAAAlBmgQCM/8A6YEAAAAJQZoFArP/AOmBAAAACUGaBgMz/wDpgQAAAAlBmgcDs/8A6YEAAAAJQZoIBDP/AOmAAAAACUGaCQSz/wDpgAAAAAlBmgoFM/8A6YEAAAAJQZoLBbP/AOmAAAAACkGaDAYyJ/8AFBAAAAAKQZoNBrIv/4cMeQ==";
    video.addEventListener('canplay', () => {
      let timeout = setTimeout(() => {
        resolve(false);
      }, 300);

      video.addEventListener('playing', function playing() {
        clearTimeout(timeout);
        resolve(true);
      });
    });

    document.body.appendChild(video);
  });

  fetch(requestMaker())
    .then(response => response.json())
    .then((json) => {
      const data = json.data;
      let media = null;
      let ready = '';

      canAutoplay.then((autoplay) => {
        if (autoplay) {
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

        const onready = () => {
          console.log('ready')
          stage.removeAttribute('disabled');
          media.removeEventListener(ready, onready)
        }

        media.addEventListener(ready, onready);

        stage.insertAdjacentElement('beforeEnd', media);
      });
    })
    .catch((e) => {
      console.error(e);
    });
});
