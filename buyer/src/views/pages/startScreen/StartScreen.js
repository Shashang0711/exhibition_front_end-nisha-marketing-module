import React from 'react';
import logo from '../../../assets/images/icon/logo.svg'

const StartScreen = () => {
    return (
        <div class="app-sc splash-sc">
            <div class="logo">
                <a href="#!"><img src={logo} alt="Logo" /></a>
            </div>
        </div>
    )
}

export default StartScreen