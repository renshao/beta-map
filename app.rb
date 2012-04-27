require 'sinatra'
require 'erb'

require 'sinatra/assetpack'

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
      erb :index
  end

  get '/map' do
      erb :map
  end
end


