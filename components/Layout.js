
export const Layout = ({children}) => {
    const author = "aaaa";
    return (<html>
      <head>
        <title>My blog</title>
      </head>
      <body>
        <div>
        search:<input></input>
        </div>
        {children}
        <hr/>
        <div><a href="/">back to home</a></div>
        <footer>
          <hr />
          <p>
            <i>
              (c) {author} {new Date().getFullYear()}
            </i>
          </p>
        </footer>
      </body>
    </html>);
  }