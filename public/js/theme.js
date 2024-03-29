let lightTheme = false;
function switchTheme(ele = document.getElementById('theme-switcher'), theme = !lightTheme) {
    lightTheme = theme;
    document.documentElement.dataset.theme = lightTheme ? 'light' : 'dark';

    if(lightTheme) {
        ele.classList.remove('dark');
        setCookie('theme', 'light', 720);
    }else {
        ele.classList.add('dark');
        setCookie('theme', 'dark', 720);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const theme = getCookie('theme');
    if(theme != "") {
        switchTheme(document.getElementById('theme-switcher'), theme === "light")
    }

    document.getElementById('theme-switcher').addEventListener('click', function () { switchTheme(this) });
});