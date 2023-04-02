
/**
 * @service (time)
 */
module.exports = class TimeService {

  getSeconds(value) {
    if (typeof value === 'string') {
      let seconds = 0;
      let split = value.split(':');
      if (split.length > 1) {
        if (split.length === 3) {
          seconds += 60 * 60 * parseInt(split[0]);
          seconds += 60 * parseInt(split[1]);
          seconds += parseInt(split[2]);
        } else if (split.length === 2) {
          seconds += 60 * parseInt(split[0]);
          seconds += parseInt(split[1]);
        }
        return seconds;
      }
      if (value.startsWith('PT')) {
        value = value.substring(2).toLowerCase();
      }
      split = value.split(/[smh]/);
      if (split.length > 1) {
        let index = 0;
        for (const item of split.filter(i => i)) {
          index += item.length + 1;
          switch (value.substring(index - 1, index)) {
            case 'h':
              seconds += 60 * 60 * parseInt(item);
              break;
            case 'm':
              seconds += 60 * parseInt(item);
              break;
            case 's':
              seconds += parseInt(item);
              break;
            default: 
              return null;
          }
        }
        return seconds;
      }
    }
    return parseInt(value + '');
  }

}