require 'sinatra'
require 'erb'
require 'flickraw'

FlickRaw.api_key="531816ea45f21f6d28e52fcb85ce2a73"
FlickRaw.shared_secret="5b82d3f843e69f0e"
flickr.access_token = "72157629909297383-b7e0f092dddc3be4"
flickr.access_secret = "f9c89919ce1f93b8"

get '/' do    
    
    # location = {:lat => '-33.863093', :lon => '151.207731', :accuracy => '6'} # Sydney
    location = {:lat => '-37.7833', :lon => '144.9667', :accuracy => '6'}     # Melbourne
    
    photos = flickr.photos.search location

    erb :index, :locals => {:photos => photos}
end

get '/map' do
    erb :map
end

