Live URL
--------
http://floating-ice-4900.heroku.com

Run beta-map locally
------------
Install rvm, ruby 1.9.3, create gemset beta-map

Run bundle to install gems

    $ rvm 1.9.3@beta-map

    $ bundle

Obtain your Instagram **client id** from http://instagr.am/developer, and run

    $ export INSTAGRAM_CLIENT_ID=your.client.id

(Optional) Obtain your **Google Maps API key** from https://code.google.com/apis/console, and run

    $ export MAPS_API_KEY=your.maps.api.key

(It's recommended to setup your maps api key, it enables you to monitor your application's Maps API usage)

You probably want to define these variables in .bash_profile

Start app using shotgun (auto redeploy after code change)
  
    $ shotgun

Open http://localhost:9393
