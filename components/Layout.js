
export const Layout = ({children}) => {
    const author = "aaaa";
    return (<html>
      <head>
        <title>My blog</title>
      </head>
      <body>
        {children}
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