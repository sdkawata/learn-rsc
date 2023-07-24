import { createServer } from "http";
import escapeHtml from "escape-html";
import {PageList} from "./components/PageList.js"
import {Page} from "./components/Page.js"

createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  if (url.pathname === "/") {
    sendHTML(
      res,
      <PageList />
    );
  } else {
    try {
      const slug = url.pathname.slice(1)
      sendHTML(
        res,
        <Page slug={slug}/>
      )
    } catch(e) {
      console.log(e)
      res.statusCode = 500
      res.end("err")
    }
  }
}).listen(8080);

async function sendHTML(res, jsx) {
  const html = await renderJSXToHTML(jsx);
  res.setHeader("Content-Type", "text/html");
  res.end(html);
}

async function renderJSXToHTML(jsx) {
  // console.log(jsx);
  if (typeof jsx === "string" || typeof jsx === "number") {
    return escapeHtml(jsx);
  } else if (jsx == null || typeof jsx === "boolean") {
    return "";
  } else if (Array.isArray(jsx)) {
    const renderedChildren = []
    for (const child of jsx) {
      renderedChildren.push(await renderJSXToHTML(child))
    }
    return renderedChildren.join("");
  } else if (typeof jsx === "object") {
    if (jsx.$$typeof === Symbol.for("react.element")) {
      if (typeof jsx.type === "function") {
        return await renderJSXToHTML(await jsx.type(jsx.props))
      } else {
        let html = "<" + jsx.type;
        for (const propName in jsx.props) {
          if (jsx.props.hasOwnProperty(propName) && propName !== "children") {
            html += " ";
            html += propName;
            html += "=";
            html += escapeHtml(jsx.props[propName]);
          }
        }
        html += ">";
        html += await renderJSXToHTML(jsx.props.children);
        html += "</" + jsx.type + ">";
        return html;
      }
    } else throw new Error("Cannot render an object.");
  } else throw new Error("Not implemented.");
}
