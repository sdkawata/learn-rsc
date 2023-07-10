import { createServer } from "http";
import { readFile, readdir } from "fs/promises";
import escapeHtml from "escape-html";
import {PageList} from "./components/PageList.js"
import {Page} from "./components/Page.js"

createServer(async (req, res) => {
  const postFiles = await readdir("./posts");
  const postSlugs = postFiles.map(file => file.slice(0, file.lastIndexOf(".")))
  const url = new URL(req.url, `http://${req.headers.host}`);
  if (url.pathname === "/") {
    sendHTML(
      res,
      <PageList postSlugs={postSlugs}/>
    );
  } else {
    try {
      const slug = url.pathname.slice(1)
      const content = await readFile(`./posts/${slug}.txt`, "utf8")
      sendHTML(
        res,
        <Page content={content}/>
      )
    } catch(e) {
      console.log(e)
      res.statusCode = 500
      res.end("err")
    }
  }
}).listen(8080);

function sendHTML(res, jsx) {
  const html = renderJSXToHTML(jsx);
  res.setHeader("Content-Type", "text/html");
  res.end(html);
}

function renderJSXToHTML(jsx) {
  // console.log(jsx);
  if (typeof jsx === "string" || typeof jsx === "number") {
    return escapeHtml(jsx);
  } else if (jsx == null || typeof jsx === "boolean") {
    return "";
  } else if (Array.isArray(jsx)) {
    return jsx.map((child) => renderJSXToHTML(child)).join("");
  } else if (typeof jsx === "object") {
    if (jsx.$$typeof === Symbol.for("react.element")) {
      if (typeof jsx.type === "function") {
        return renderJSXToHTML(jsx.type(jsx.props))
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
        html += renderJSXToHTML(jsx.props.children);
        html += "</" + jsx.type + ">";
        return html;
      }
    } else throw new Error("Cannot render an object.");
  } else throw new Error("Not implemented.");
}
