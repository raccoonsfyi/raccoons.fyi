'use strict';

document.addEventListener('DOMContentLoaded', function () {

  // Stage element
  var stage = document.querySelector('.stage');

  // Stage helper funcs
  var addHover = function addHover() {
    return stage.classList.add('hover');
  };
  var removeHover = function removeHover() {
    return stage.classList.remove('hover');
  };
  var toggleHover = function toggleHover(event) {
    event.stopPropagation();
    if (stage.classList.contains('hover')) {
      removeHover();
    } else {
      addHover();
    }
  };

  // Stage events
  stage.addEventListener('touchstart', function () {
    return stage.setAttribute('data-touch', 'true');
  });
  stage.addEventListener('touchend', toggleHover);

  // Request maker
  var requestMaker = function requestMaker() {
    var searchTerm = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'raccoon';

    return new Request('https://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=' + searchTerm, {
      method: 'GET',
      mode: 'cors',
      redirect: 'follow'
    });
  };

  // Autoplay checker
  var canAutoplay = new Promise(function (resolve, reject) {
    var video = document.createElement('video');
    video.className = 'visuallyhidden';
    video.autoplay = true;
    video.src = "data:video/mp4;base64,AAAAFGZ0eXBNU05WAAACAE1TTlYAAAOUbW9vdgAAAGxtdmhkAAAAAM9ghv7PYIb+AAACWAAACu8AAQAAAQAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAnh0cmFrAAAAXHRraGQAAAAHz2CG/s9ghv4AAAABAAAAAAAACu8AAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAABAAAAAAFAAAAA4AAAAAAHgbWRpYQAAACBtZGhkAAAAAM9ghv7PYIb+AAALuAAANq8AAAAAAAAAIWhkbHIAAAAAbWhscnZpZGVBVlMgAAAAAAABAB4AAAABl21pbmYAAAAUdm1oZAAAAAAAAAAAAAAAAAAAACRkaW5mAAAAHGRyZWYAAAAAAAAAAQAAAAx1cmwgAAAAAQAAAVdzdGJsAAAAp3N0c2QAAAAAAAAAAQAAAJdhdmMxAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAFAAOABIAAAASAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGP//AAAAEmNvbHJuY2xjAAEAAQABAAAAL2F2Y0MBTUAz/+EAGGdNQDOadCk/LgIgAAADACAAAAMA0eMGVAEABGjuPIAAAAAYc3R0cwAAAAAAAAABAAAADgAAA+gAAAAUc3RzcwAAAAAAAAABAAAAAQAAABxzdHNjAAAAAAAAAAEAAAABAAAADgAAAAEAAABMc3RzegAAAAAAAAAAAAAADgAAAE8AAAAOAAAADQAAAA0AAAANAAAADQAAAA0AAAANAAAADQAAAA0AAAANAAAADQAAAA4AAAAOAAAAFHN0Y28AAAAAAAAAAQAAA7AAAAA0dXVpZFVTTVQh0k/Ou4hpXPrJx0AAAAAcTVREVAABABIAAAAKVcQAAAAAAAEAAAAAAAAAqHV1aWRVU01UIdJPzruIaVz6ycdAAAAAkE1URFQABAAMAAAAC1XEAAACHAAeAAAABBXHAAEAQQBWAFMAIABNAGUAZABpAGEAAAAqAAAAASoOAAEAZABlAHQAZQBjAHQAXwBhAHUAdABvAHAAbABhAHkAAAAyAAAAA1XEAAEAMgAwADAANQBtAGUALwAwADcALwAwADYAMAA2ACAAMwA6ADUAOgAwAAABA21kYXQAAAAYZ01AM5p0KT8uAiAAAAMAIAAAAwDR4wZUAAAABGjuPIAAAAAnZYiAIAAR//eBLT+oL1eA2Nlb/edvwWZflzEVLlhlXtJvSAEGRA3ZAAAACkGaAQCyJ/8AFBAAAAAJQZoCATP/AOmBAAAACUGaAwGz/wDpgAAAAAlBmgQCM/8A6YEAAAAJQZoFArP/AOmBAAAACUGaBgMz/wDpgQAAAAlBmgcDs/8A6YEAAAAJQZoIBDP/AOmAAAAACUGaCQSz/wDpgAAAAAlBmgoFM/8A6YEAAAAJQZoLBbP/AOmAAAAACkGaDAYyJ/8AFBAAAAAKQZoNBrIv/4cMeQ==";
    video.addEventListener('canplay', function () {
      var timeout = setTimeout(function () {
        resolve(false);
      }, 300);

      video.addEventListener('playing', function playing() {
        clearTimeout(timeout);
        resolve(true);
      });
    });

    document.body.appendChild(video);
  });

  // Fetch dat gif (or mp4)
  fetch(requestMaker()).then(function (response) {
    return response.json();
  }).then(function (json) {
    var data = json.data;
    var media = null;
    var ready = '';

    canAutoplay.then(function (autoplay) {
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

      var onready = function onready() {
        stage.removeAttribute('disabled');
        media.removeEventListener(ready, onready);

        /*const yaySound = document.createElement('audio');
        yaySound.src = "https://c6.rbxcdn.com/d29ab66b69e75d810d4e446fb36754d2";
        document.body.appendChild(yaySound);
        const playYay = () => yaySound.play();
         stage.addEventListener('touchstart', playYay);
        stage.addEventListener('mouseover', playYay);*/
      };

      media.addEventListener(ready, onready);

      stage.insertAdjacentElement('beforeEnd', media);
    });
  }).catch(function (e) {
    console.error(e);
  });
});
