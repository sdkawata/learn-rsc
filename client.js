const navigate = async (href) => {
    console.log("navigate!!!", href)
    const response = await fetch(href)
    const html = await response.text()
    const startIndex = html.indexOf('<body>') + '<body>'.length
    const endIndex = html.indexOf('</body>')
    // console.log(startIndex, endIndex)
    const bodyHtml = html.slice(startIndex, endIndex);
    // console.log(bodyHtml)
    window.document.body.innerHTML = bodyHtml
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