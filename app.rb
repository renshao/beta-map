require 'sinatra'
require 'erb'

get '/' do
    erb :index
end

get '/map' do
    erb :map
end
