export default {
  fetch(request: Request): Response {
    const url = new URL(request.url);
    url.protocol = "https:";
    url.hostname = "prayer-calendar.com";
    return Response.redirect(url.toString(), 301);
  },
};
