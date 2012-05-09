Live URL
--------
http://floating-ice-4900.heroku.com

Environments
------------
Install rvm, ruby 1.9.3, create gemset beta-map

Run bundle to install gems

    $ rvm 1.9.3@beta-map

    $ bundle

Obtain your Instagram *client id* and *access token* from http://instagr.am/developer, and run

    $ export INSTAGRAM_CLIENT_ID=your.client.id
    $ export INSTAGRAM_ACCESS_TOKEN=your.access.token

You might want to define these variables in .bash_profile

Start app using shotgun (auto redeploy after code change)
  
    $ shotgun

Open http://localhost:9393
