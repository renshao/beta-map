require 'sinatra'
require 'erb'
require 'json'
require 'sinatra/assetpack'
require './photo_manager'
require 'instagram'

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
    config.client_id = ENV["INSTAGRAM_CLIENT_ID"] 
  end

  get '/' do
    content_type :html
    erb :map
  end

  before do
    content_type :json
  end

  get '/photos' do
    instagrams = Instagram.media_search latitude, longitude, {:count => 50}
    instagrams.data.collect do |photo|
      Photo.from_instagram_photo photo
    end.to_json
  end

  get '/most_popular' do
    Instagram.media_popular.delete_if { |photo| photo.location.nil? }.collect do |photo|
      Photo.from_instagram_photo photo
    end.to_json
  end
  
  get '/photo/:name' do
    instagram_user(params[:name]).to_json
  end

  get '/instagram' do
    puts Instagram.media_search(latitude, longitude, {:count => 50}).data.count
  end

private 

  # this appears half-implemented so i've left as was
  def instagram_user(name)
    puts "searching for #{name}"
    instagramUsers = Instagram.user_search(name)
    instagramUser = Instagram.user(instagramUsers.first.id)
    #return result;
  end

  def latitude
    params[:lat] || '-33.863093'
  end

  def longitude
    params[:lon] || '151.207731'
  end

end


