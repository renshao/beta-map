require 'sinatra'
require 'erb'
require 'flickraw'
require 'sinatra/assetpack'

FlickRaw.api_key="531816ea45f21f6d28e52fcb85ce2a73"
FlickRaw.shared_secret="5b82d3f843e69f0e"
flickr.access_token = "72157629909297383-b7e0f092dddc3be4"
flickr.access_secret = "f9c89919ce1f93b8"

class App < Sinatra::Base
  set :root, File.dirname(__FILE__)
  register Sinatra::AssetPack

  assets {
    serve '/js',     from: 'asset/js'        # Optional
    serve '/css',    from: 'asset/css'       # Optional
    serve '/images', from: 'asset/images'    # Optional
    serve '/vendor', from: 'asset/vendor'    # Optional

    # The second parameter defines where the compressed version will be served.
    # (Note: that parameter is optional, AssetPack will figure it out.)
    js :app, '/js/app.js', [
      '/js/**.js',
      '/vendor/**.js'
    ]

    css :app, '/css/app.css', [
      '/css/*.css'
    ]

    js_compression  :jsmin      # Optional
    css_compression :sass       # Optional
  }

  get '/' do
      # location = {:lat => '-33.863093', :lon => '151.207731', :accuracy => '6'} # Sydney
      location = {:lat => '-37.7833', :lon => '144.9667', :accuracy => '6'}     # Melbourne

      photos = flickr.photos.search location

      erb :index, :locals => {:photos => photos}
  end

  get '/map' do
      erb :map
  end
end
