require 'sinatra'
require 'erb'
require 'json'
require 'flickraw'

require 'sinatra/assetpack'

require './photo_manager'

require 'instagram'

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
  
  Instagram.configure do |config|
    config.client_id = "ddbe06df91774af98776a3aa31fce89f" 
    config.access_token = "51500982.ddbe06d.2c0a0ca1189543929599b0cf0c8d121f"
  end

  get '/' do
      erb :map
  end

  get '/photos' do
    content_type :json
    populate_lat_lon
    
    result = getInstagramPhotos()
    result.to_json
  end

  get '/most_popular' do
    content_type :json
    
    instagrams = Instagram.media_popular
    instagrams.delete_if { |photo| photo.location.nil? } 
    puts instagrams.count
    instagrams.collect do |photo|
      extract_photo_info(photo)
    end.to_json
  end
  
  get '/instagram' do
    puts Instagram.media_search(LAT_DEFAULT,LON_DEFAULT, {:count => 50}).data.count
  end

  get '/photo/:name' do
    content_type :json

    populate_lat_lon

    result = getInstagramUser(params[:name])
    #result = photos.collect { |photo| Photo.new(photo.title, photo.latitude, photo.longitude, photo.url_s, photo.url_sq, photo.owner) }

    result.to_json
  end

  def getInstagramUser(name)

    puts "searching for #{name}"

    instagramUsers = Instagram.user_search(name)
    instagramUser = Instagram.user(instagramUsers.first.id)

    return result;
  end

  def getInstagramPhotos
    instagrams = Instagram.media_search(@lat, @lon, {:count => 50})

    #flickr_photos = []#flickrs.collect { |photo| Photo.new(photo.title, photo.latitude, photo.longitude, photo.url_s, photo.url_sq, photo.owner) }
    convertInstagramPhotosToPhotos(instagrams)
  end

  def convertInstagramPhotosToPhotos(instagrams)
    instagram_photos = instagrams.data.collect do |photo|
      caption = photo.caption ? photo.caption.text : ""
      extract_photo_info(photo)
    end
  end

  def extract_photo_info(photo)
    created_time = Time.at(photo.created_time.to_i).strftime("%I:%M%p %d %b %Y")

    caption = photo.caption ? photo.caption.text : ""
    Photo.new(photo.id, caption,
              photo.location.latitude,
              photo.location.longitude,
              photo.images.standard_resolution.url,
              photo.images.standard_resolution.url,
              photo.user.full_name,
              created_time)
  end

  def populate_search_params
    puts params.inspect
    populate_lat_lon
    accuracy = params[:accuracy] ? params[:accuracy] : 5

    {:text => params[:keyword], :lat => @lat, :lon => @lon, :radius => accuracy, :per_page => '20', :extras => "geo, url_s, url_sq, owner_name"}
  end

  def populate_lat_lon
    @lat = params[:lat] ? params[:lat] : LAT_DEFAULT
    @lon = params[:lon] ? params[:lon] : LON_DEFAULT

    puts "LAT: #{@lat}"
    puts "LON: #{@lon}"
  end
end


