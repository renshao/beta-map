require 'sinatra'
require 'erb'
require 'json'
require 'flickraw'

require 'sinatra/assetpack'

require './photo_manager'

FlickRaw.api_key="665020df0e5ace2a2efbd8a6f5ad1f55"
FlickRaw.shared_secret="d57c75447d843c9b"

class App < Sinatra::Base
  LAT_DEFAULT = '-33.863093'
  LON_DEFAULT = '151.207731'

  set :root, File.dirname(__FILE__)
  register Sinatra::AssetPack

  assets {
    serve '/js',     from: 'asset/js'        # Optional
    serve '/css',    from: 'asset/css'       # Optional
    serve '/images', from: 'asset/images'    # Optional
    serve '/vendor', from: 'asset/vendor'    # Optional

    # The second parameter defines where the compressed version will be served.
    # (Note: that parameter is optional, AssetPack will figure it out.)
    js :application, [
      '/vendor/**.js',
      '/js/**.js'
    ]
    
    css :application, '/css/app.css', [
      '/css/*.css'
    ]

    js_compression  :jsmin      # Optional
    css_compression :sass       # Optional
  }

  get '/' do
      erb :index
  end

  get '/map' do
      erb :map
  end

  get '/photos' do
      content_type :json
      photos = flickr.photos.search populate_search_params
      result = photos.collect { |photo| Photo.new(photo.title, photo.latitude, photo.longitude, "http://farm#{photo.farm}.staticflickr.com/#{photo.server}/#{photo.id}_#{photo.secret}_t.jpg") }
      
      result.to_json
  end

  get '/flickr' do
    photos = flickr.photos.search populate_search_params
    erb :photos, :locals => {:photos => photos}
  end

  def populate_search_params
    lat = params[:lat] ? params[:lat] : LAT_DEFAULT
    lon = params[:lon] ? params[:lon] : LON_DEFAULT

    search_params = {:text => params[:q], :lat => lat, :lon => lon, :accuracy => '6', :per_page => '20', :extras => "geo"}
    puts "Flickr search params are " + search_params.to_s

    return search_params
  end
end


