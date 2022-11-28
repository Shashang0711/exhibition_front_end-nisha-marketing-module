/************* Main Js File ************************
	Template Name: HYPESTREET
	Author: Netizens Technologies
    Developer: Kaushik Kaklotar
	Version: 1.0
	Copyright 2022
	Please ❤ this if you like it!
*************************************************************/


/*------------------------------------------------------------------------------------ 
	==============
	= J S INDEX  =
	==============
	01 - PASSWORD
-------------------------------------------------------------------------------------*/


/*=====================================================================
01 - PASSWORD
=====================================================================*/

const $inp = $(".otp-inputs input");
$inp.on({
  paste(ev) { // Handle Pasting
    const clip = ev.originalEvent.clipboardData.getData('number').trim();
    if (!/\d{6}/.test(clip)) return ev.preventDefault(); // Invalid. Exit here
    const s = [...clip];
    $inp.val(i => s[i]).eq(5).focus(); 
  },
  input(ev) { 
    const i = $inp.index(this);
    if (this.value) $inp.eq(i + 1).focus();
  },
  keydown(ev) { 
    const i = $inp.index(this);
    if (!this.value && ev.key === "Backspace" && i) $inp.eq(i - 1).focus();
  }
});