// const HOSTNAME = "localhost";
const HOSTNAME = null;
const PORT = null;
const PREFIX = "api"; //"api"

let url = null;

let config = {
  backendUrl: function(){
    if(url) return url;
    
    let hostName = HOSTNAME ? HOSTNAME : window.location.hostname;
    let port = PORT ? PORT : window.location.port;
    let host = hostName + ":" + port;
    host = PREFIX ? (host + "/" + PREFIX ): host
    if(!hostName && !port)
      host = window.location.host
    url = "http://" + host
    return url;
  },
}
export default config;
