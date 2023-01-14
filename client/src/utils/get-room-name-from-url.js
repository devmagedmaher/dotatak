
export default function getRoomNameFromURL() {
  try {
    let url = new URL(window.location.href);
    let params = new URLSearchParams(url.search);
    let roomName = params.get("r");
    return roomName
  }
  catch(e) {
    return null
  }
}