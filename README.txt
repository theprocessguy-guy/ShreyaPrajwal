SHREYA'S BIRTHDAY SURPRISE — QUICK GUIDE
==========================================

Your website is ready. Before you share it, personalize the photos and add your song.

FILES
-----
index.html   The website
style.css    Design and animations
script.js    Countdown and interactions
assets/      Put your photos and song in this folder

1) ADD YOUR PHOTOS
------------------
Choose 3 photos and rename them exactly:
  photo1.jpg
  photo2.jpg
  photo3.jpg

Put all three files inside the "assets" folder.

Tip: JPG or JPEG is best. If your photo is PNG or WEBP, either convert it to JPG or edit the matching filename in index.html and script.js. Keep the photos reasonably sized (ideally under 2 MB each) so the page loads quickly.

2) ADD YOUR SONG
----------------
Copy your music file into the "assets" folder and rename it:
  song.mp3

The website's music player uses assets/song.mp3. The song plays only after someone taps Play (phones usually block automatic audio). Make sure you have permission to share the audio file; a copyrighted song may be muted or removed by some hosts/platforms.

3) TEST IT
----------
Open index.html in Chrome. Test the countdown, candle buttons, final surprise, and music. The background landscape needs an internet connection because it uses an online image.

4) PUBLISH FOR FREE WITH NETLIFY DROP
-------------------------------------
You need a laptop/desktop for the easiest setup.

A. Keep the folder structure exactly like this:
   shreya_birthday_website/
     index.html
     style.css
     script.js
     assets/
       photo1.jpg
       photo2.jpg
       photo3.jpg
       song.mp3

B. Open https://app.netlify.com/drop in your browser.
C. Sign in or create a free Netlify account if prompted.
D. Drag the whole "shreya_birthday_website" folder onto the drop area. If the folder is rejected, zip the folder and use the upload option if available, or deploy it through Netlify's manual deploy instructions.
E. Wait for deployment. Netlify will show a public link ending in netlify.app.
F. Open that link on your phone and test it before sending it to Shreya on WhatsApp.

Important: A public link means anyone who has the link may be able to open the page and see the photos. Don't include private or intimate pictures. You can change the site name in Netlify's site settings if the generated address is awkward.

5) CHANGE THE BIRTHDAY DATE
---------------------------
The countdown is set to November 2, 2026. To change it, open script.js and edit:
  const birthday = new Date("2026-11-02T00:00:00");

The date uses the visitor's local device time.

6) EDIT THE LETTER
------------------
Open index.html in a text editor and search for "Dear Shreya,". Change the paragraphs to your own words if you want it to sound more like you.

TROUBLESHOOTING
---------------
• Music doesn't play: check that assets/song.mp3 exists and is a real MP3 file; tap Play.
• Photos don't appear: check the filenames and ensure they are inside assets/.
• Countdown is wrong: check the date line in script.js.
• Don't send the local file path: publish first and send the netlify.app URL.
