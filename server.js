import { createServer } from "http";
import escapeHtml from "escape-html";
import {PageList} from "./components/PageList.js"
import {Page} from "./components/Page.js"
import { readFile } from "fs/promises";

const Router = ({url}) => {
  if (url.pathname === "/") {
    return <PageList />;
  }
  const slug = url.pathname.slice(1)
  return <Page slug={slug} />
}

createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  try {
    if (url.pathname === "/client.js") {
      const content = await readFile("client.js", 'utf8')
      res.setHeader("Content-Type", "text/javascript");
      res.end(content);
    } else {
      await sendHTML(
        res,
        <Router url={url}/>
      )
    }
  } catch (e) {
    console.log(e)
    res.statusCode = 500
    res.end("err")
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
    return (await Promise.all(jsx.map(child => renderJSXToHTML(child)))).join("")
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
