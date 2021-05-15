     if (process.env.YOUTH_HEADER && process.env.YOUTH_HEADER.indexOf('#') > -1) {
        cookieYouth = process.env.YOUTH_HEADER.split('#');
      } else if (process.env.YOUTH_HEADER && process.env.YOUTH_HEADER.indexOf('\n') > -1) {
        cookieYouth = process.env.YOUTH_HEADER.split('\n');
      } else {
        cookieYouth = [process.env.YOUTH_HEADER]
      };
      if (process.env.YOUTH_ARTBODY && process.env.YOUTH_ARTBODY.indexOf('&') > -1) {
        ARTBODYs = process.env.YOUTH_ARTBODY.split('&');
      } else if (process.env.YOUTH_ARTBODY && process.env.YOUTH_ARTBODY.indexOf('\n') > -1) {
        ARTBODYs = process.env.YOUTH_ARTBODY.split('\n');
      } else {
        ARTBODYs = [process.env.YOUTH_ARTBODY]
      };
      if (process.env.YOUTH_TIME && process.env.YOUTH_TIME.indexOf('&') > -1) {
        READTIME = process.env.YOUTH_TIME.split('&');
      } else if (process.env.YOUTH_TIME && process.env.YOUTH_TIME.indexOf('\n') > -1) {
        READTIME = process.env.YOUTH_TIME.split('\n');
      } else {
        READTIME = [process.env.YOUTH_TIME]
      }