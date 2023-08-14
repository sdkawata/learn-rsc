import {hydrateRoot} from 'react-dom/client';


function unstringifyJSX(key, value) {
    if (value === "$RE") {
      return Symbol.for("react.element");
    } else if (typeof value === "string" && value.startsWith("$")) {
      return value.slice(1);
    }
    return value;
}

const initialJSX = () => {
    return JSON.parse(window.__INITIANL_CLIENT_JSX__STRING__, unstringifyJSX);
}

const root = hydrateRoot(document, initialJSX())

const navigate = async (href) => {
    console.log("navigate!!!", href)
    const response = await fetch(href + "?jsx")
    const jsx = JSON.parse(await response.text(), unstringifyJSX);
    root.render(jsx)
}

window.addEventListener('click', function (e) {
    if (e.target.tagName !== 'A') {
        return
    }
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
        return
    }
    const href = e.target.getAttribute("href")
    if (! href.startsWith("/")) {
        return
    }
    e.preventDefault()
    window.history.pushState(null, null, href)
    navigate(href)
}, true)

window.addEventListener('popstate', () => {
    navigate(window.location.pathname)
})
