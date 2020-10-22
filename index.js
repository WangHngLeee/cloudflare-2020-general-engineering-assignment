addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

const Path = regExp => req => {
  const url = new URL(req.url)
  const path = url.pathname
  const match = path.match(regExp) || []
  return match[0] === path
}

const LinksPath = Path("/links");

const links = [
  { "name": "Google", "url": "https://www.google.com" },
  { "name": "My Portfolio", "url": "https://www.leeeinfo.com" },
  { "name": "BBC News", "url": "https://www.bbc.com/" },
];

/**
 * Respond with hello worker text
 * @param {Request} request
 */

async function handleRequest(request) {

  if (LinksPath(request)) {
    return new Response(JSON.stringify(links), {
      headers: { 'content-type': 'application/json' },
    })
  }

  const rawHTMLResponse = await fetch("https://static-links-page.signalnerve.workers.dev");

  return new HTMLRewriter()
    .on("div#links", {
      element: (element) => {
        element.append(links.map((link) => {
          return `<a href="${link.url}">${link.name}</a>`
        }),{html: true});
      }
    })
    .on("div#profile", {
      element: (element) => {
        element.removeAttribute("style");
      }
    })
    .on("div#social", {
      element: (element) => {
        element.removeAttribute("style");
        element.append(`<a href="https://twitter.com/HoungLeee">
          <svg role="img" viewBox="0 0 24 24" fill="#fff" xmlns="http://www.w3.org/2000/svg"><title>Twitter icon</title><path d="M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.951.555-2.005.959-3.127 1.184-.896-.959-2.173-1.559-3.591-1.559-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124C7.691 8.094 4.066 6.13 1.64 3.161c-.427.722-.666 1.561-.666 2.475 0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.189 1.394 4.768 2.209 7.557 2.209 9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63.961-.689 1.8-1.56 2.46-2.548l-.047-.02z"/></svg>
        </a>`, {html: true});
      }
    })
    .on("img#avatar", {
      element: (element) => {
        element.setAttribute("src", "https://s.gravatar.com/avatar/c59e288078119826c32067942427d222?s=80");
      }
    })
    .on("h1#name", {
      element: (element) => {
        element.append(`HomLee`);
      }
    })
    .on("title", {
      element: (element) => {
        element.setInnerContent(`HomLee`);
      }
    })
    .on("body", {
      element: (element) => {
        element.setAttribute('style', 'background-image: linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%);');
      }
    })
    .transform(rawHTMLResponse);
}