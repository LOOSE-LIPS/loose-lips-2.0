<div class="perspective-text">
  <div class="perspective-line">
    <p style="margin-left: 23px" class="text-black dark:text-white">LOOSE</p>
  </div>
  <div class="perspective-line">
    <p style="margin-left: 56px" class="text-black dark:text-white">LIPS</p>
  </div>
  <div class="perspective-line">
    <p style="margin-left: 14px" class="text-black dark:text-white">2.0</p>
  </div>
</div>

<div
  class="flex flex-col justify-center items-start max-w-2xl mx-auto mb-16 hover:transform-rotate(4deg)"
>
  <img src="images/logo-loose-lips.gif" alt="" style="margin-top: -2vh;" />

  <a
    href="#featured"
    style="
width: 0;
height: 0;
border-left: 40px solid transparent;
border-right: 40px solid transparent;
border-top: 25px solid #8ef6cf;
display: block;
margin:auto;
margin-top:5%;
color: white;
z-index:15;
transform: translate(-50%, 0px);"
  />
  <p
    class="font-bold text-2xl md:text-4xl tracking-tight mb-4 text-black dark:text-white"
    style="margin: auto;transform: rotate(-15deg);"
  >
    HAVE A LOOKSY
  </p>
</div>

<style>
  .perspective-text {
    color: white;
    font-family: Arial;
    font-size: 12.2em;
    font-weight: 900;
    letter-spacing: -8px;
    text-transform: uppercase;
    perspective: 23rem;
    z-index: 10;
    position: absolute;
    margin-left: 1.5em;
  }
  .perspective-line {
    height: 1.4em;
    overflow-x: hidden !important;
    position: static;
  }

  .viewAll:hover {
    text-decoration: underline;
  }

  p {
    margin: 0;
    height: 1.4em;
    line-height: 1.4em;
    transition: all 0.5s ease-in-out;
  }
  .perspective-line {
    height: 1.4em;
    position: static;
    overflow-x: hidden;
  }
  p {
    margin: 0;
    height: 1.4em;
    line-height: 1.4em;
    transition: all 0.5s ease-in-out;
  }
  .perspective-line {
    position: static;
    overflow-x: hidden !important;
  }
  .perspective-line:hover p {
    transform: translate(0, -50px);
    transform: rotate(4deg);
  }
  .perspective-line:nth-child(1) {
    left: 29px;
  }
  .perspective-line:nth-child(2) {
    left: 58px;
  }
  .perspective-line:nth-child(3) {
    left: 87px;
  }
  .perspective-line:nth-child(4) {
    left: 116px;
  }
  .perspective-line:nth-child(5) {
    left: 145px;
  }
  .perspective-line:hover p {
    transform: translate(0, -50px);
  }
  p {
    transition: all 0.5s ease-in-out;
  }
  :global(body) {
    /* this will apply to <body> */
    background-image: radial-gradient(black 1px, transparent 0);
    background-size: 40px 40px;
    background-position: -19px -19px;
  }
</style>
