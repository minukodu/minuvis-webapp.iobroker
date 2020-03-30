export function ReadSettings () {
  let settings = {};
  
  // console.debug("############## LocalStorage  ##############");
  // console.debug(localStorage);
  for ( var i = 0, len = localStorage.length; i < len; ++i ) {
    // console.debug("############## LocalStorage Key ##############");
    // console.debug(localStorage.key(i));
    // console.debug( localStorage.getItem( localStorage.key( i ) ) );
    settings[localStorage.key(i)] = ReadSetting (localStorage.key( i ), null);
  }

  // console.debug("############## settings ##############");
  // console.debug(settings);
  return settings;
  
}
export function ReadSetting (key, defaultValue) {
  return localStorage.getItem(key) || defaultValue;
}
export function SaveSetting (key, value) {

  // console.debug("############## SaveSetting ##############");
  // console.debug(key + ":" + value);
  // console.debug(localStorage.setItem(key, value));
  return localStorage.setItem(key, value);
}



