require 'sinatra'
require 'erb'
require 'json'
require 'flickraw'

require 'sinatra/assetpack'

require './photo_manager'

require 'twitter'

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
      erb :map
  end

  get '/photos' do
      content_type :json
      photos = flickr.photos.search populate_search_params
      result = photos.collect { |photo| Photo.new(photo.title, photo.latitude, photo.longitude, "http://farm#{photo.farm}.staticflickr.com/#{photo.server}/#{photo.id}_#{photo.secret}_t.jpg") }
      
      result.to_json
  end
  
  get '/photos_dev' do
    content_type :json
    puts "!----------WARNING! IN DEV MODE!----------!"
    puts "!----------WARNING! IN DEV MODE!----------!"
    # "[{\"name\":\"017 Guissipepe from Italy\",\"lat\":-33.86115,\"lng\":151.209383,\"url\":\"http://farm8.staticflickr.com/7201/7130761905_600d6b2be1_t.jpg\"},{\"name\":\"Martin Place, Sydney\",\"lat\":-33.866638,\"lng\":151.207923,\"url\":\"http://farm8.staticflickr.com/7228/6983746814_e6e38770d0_t.jpg\"}]"
    
    "[{\"name\":\"017 Guissipepe from Italy\",\"lat\":-33.86115,\"lng\":151.209383,\"url\":\"http://farm8.staticflickr.com/7201/7130761905_600d6b2be1_t.jpg\"},{\"name\":\"Martin Place, Sydney\",\"lat\":-33.866638,\"lng\":151.207923,\"url\":\"http://farm8.staticflickr.com/7228/6983746814_e6e38770d0_t.jpg\"},{\"name\":\"Bird Cage\",\"lat\":-33.867244,\"lng\":151.207895,\"url\":\"http://farm8.staticflickr.com/7199/6984952374_fb4e7d467f_t.jpg\"},{\"name\":\"Ten women on deck of the Chilean naval vessel BAQUEDANO in Circular Quay, July 1931\",\"lat\":-33.859796,\"lng\":151.212558,\"url\":\"http://farm9.staticflickr.com/8156/6984193610_bd37ddb223_t.jpg\"},{\"name\":\"Lieutenant Raul Braun, R Dundas Smith and Captain Luis Alvarez at Circular Quay, 17 July 1931\",\"lat\":-33.860045,\"lng\":151.212816,\"url\":\"http://farm8.staticflickr.com/7225/7129900755_30c616b5f6_t.jpg\"},{\"name\":\"Sydney_PittStreet-April 23, 2012.jpg\",\"lat\":-33.869628,\"lng\":151.206954,\"url\":\"http://farm9.staticflickr.com/8026/7130571529_da2f98c111_t.jpg\"},{\"name\":\"Double shot of a man arrested by Australian police in 1923\",\"lat\":-33.869628,\"lng\":151.206954,\"url\":\"http://farm8.staticflickr.com/7186/7130912615_ef5f6a0d53_t.jpg\"},{\"name\":\"4H9C2695\",\"lat\":-33.869628,\"lng\":151.206954,\"url\":\"http://farm8.staticflickr.com/7122/6984625990_0c55766ecf_t.jpg\"},{\"name\":\"A young Asian arrested by Australian police in 1922\",\"lat\":-33.870415,\"lng\":151.207923,\"url\":\"http://farm8.staticflickr.com/7248/7130912371_1c8602763a_t.jpg\"},{\"name\":\"016 Carol from Australia\",\"lat\":-33.870718,\"lng\":151.206851,\"url\":\"http://farm8.staticflickr.com/7046/7130762623_f75d688599_t.jpg\"},{\"name\":\"A burglar, arrested by Australian police in 1924\",\"lat\":-33.870843,\"lng\":151.20758,\"url\":\"http://farm8.staticflickr.com/7262/6984827858_15651ece89_t.jpg\"},{\"name\":\"015 Brandon from Australia\",\"lat\":-33.870985,\"lng\":151.205949,\"url\":\"http://farm8.staticflickr.com/7227/6984677130_dcfb79ac98_t.jpg\"},{\"name\":\"Bennelong Bar\",\"lat\":-33.857405,\"lng\":151.214626,\"url\":\"http://farm8.staticflickr.com/7209/6984302570_4719062534_t.jpg\"},{\"name\":\"Park St, Sydney\",\"lat\":-33.87266,\"lng\":151.207408,\"url\":\"http://farm9.staticflickr.com/8149/6983756710_539a47cb0b_t.jpg\"},{\"name\":\"Opera\",\"lat\":-33.856775,\"lng\":151.215147,\"url\":\"http://farm8.staticflickr.com/7119/6984491922_cc412905a8_t.jpg\"},{\"name\":\"Decision makers' breakfast at #CU12 during Q&A sponsored by @SKEDA_IT\",\"lat\":-33.866763,\"lng\":151.195961,\"url\":\"http://farm9.staticflickr.com/8015/6983731314_fa61971be7_t.jpg\"},{\"name\":\"Time to celebrate -1000 pics - creative creation from another artist - #zumbo #instagood #instagram #igerssydney #igaustralia #sydney #cake #stunning #celebration #mikestone #1000 #wow\",\"lat\":-33.869611,\"lng\":151.19612,\"url\":\"http://farm8.staticflickr.com/7275/6984761520_82e9990898_t.jpg\"},{\"name\":\"Peach soju #peach #soju #friday #korean #alcoholism\",\"lat\":-33.876414,\"lng\":151.203978,\"url\":\"http://farm8.staticflickr.com/7062/7129963737_a4df72f406_t.jpg\"}]"
  end

  get '/twitter' do
    query = params[:keyword] ? params[:keyword] : "twitter"
    twitters = Twitter.search(query, populate_twitter_params)
    erb :twitters, :locals => {:twitters => twitters}
  end

  def populate_search_params
    puts params.inspect
    populate_lat_lon
    accuracy = params[:accuracy] ? 20 - params[:accuracy].to_i : 6

    search_params = {:text => params[:keyword], :lat => @lat, :lon => @lon, :accuracy => accuracy, :per_page => '20', :extras => "geo"}
    puts "Flickr search params are " + search_params.to_s

    return search_params
  end

  def populate_twitter_params
    populate_lat_lon

    search_params = {:geo => "#{@lat},#{@lon},20km", :rpp => 10}
    puts "Twitter search params are " + search_params.to_s

    return search_params
  end

  def populate_lat_lon
    @lat = params[:lat] ? params[:lat] : LAT_DEFAULT
    @lon = params[:lon] ? params[:lon] : LON_DEFAULT

    puts "LAT: #{@lat}"
    puts "LON: #{@lon}"
  end
end


