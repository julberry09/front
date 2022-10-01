const parseJwt = token => {
  try {
    const encodedPayload = token.split('.')[1];
    return JSON.parse(b64_to_utf8(encodedPayload));
  } catch (e) {
    return e;
  }
};

const utf8_to_b64 = ( str ) =>{
  return window.btoa(unescape(encodeURIComponent( str )));
}
const b64_to_utf8 = ( str ) => {
  return decodeURIComponent(escape(window.atob( str )));
}

export default parseJwt;
