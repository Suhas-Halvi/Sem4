/* =====================================================
   MUSIC.JS
   Handles background music playback. Browsers block
   autoplay with sound, so playback starts on the first
   user interaction anywhere on the page, then can be
   muted/unmuted via the floating widget.
   ===================================================== */

(function(){
  'use strict';

  const audio = document.getElementById('bg-music');
  const widget = document.getElementById('music-widget');
  const toggleBtn = document.getElementById('music-toggle');
  const iconNote = document.getElementById('icon-note');
  const iconMuted = document.getElementById('icon-muted');

  audio.volume = 0.45;
  let started = false;
  let userMuted = false;

  function startMusicOnce(){
    if (started) return;
    started = true;
    audio.play().catch(() => {
      // Autoplay blocked or no audio source provided — fail silently.
      // The user can still press the music widget manually.
      widget.classList.add('paused');
      iconNote.style.display = 'none';
      iconMuted.style.display = 'block';
    });
    document.removeEventListener('click', startMusicOnce);
    document.removeEventListener('keydown', startMusicOnce);
  }

  document.addEventListener('click', startMusicOnce, { once: true });
  document.addEventListener('keydown', startMusicOnce, { once: true });

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    userMuted = !userMuted;

    if (userMuted){
      audio.pause();
      widget.classList.add('paused');
      iconNote.style.display = 'none';
      iconMuted.style.display = 'block';
    } else {
      audio.play().catch(() => {});
      widget.classList.remove('paused');
      iconNote.style.display = 'block';
      iconMuted.style.display = 'none';
    }
  });

})();
